using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using MongoDB.Driver;
using Scalar.AspNetCore;
using System.Text;
using Minio;
using Whisper.API.Controllers;
using Whisper.Application.Interfaces.Repositories;
using Whisper.Application.Interfaces.Services;
using Whisper.Application.Services;
using Whisper.Application.Common.Config;
using Whisper.Persistence.Context;
using Whisper.Persistence.Repositories;
using Microsoft.Extensions.Options;
using OpenTelemetry.Metrics;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenTelemetry()
    .WithMetrics(metrics => metrics
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddRuntimeInstrumentation()
        .AddPrometheusExporter());

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgresConnection")));


builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var connectionString = builder.Configuration.GetConnectionString("MongoConnection");
    return new MongoClient(connectionString);
});

builder.Services.AddScoped(sp =>
{
    var client = sp.GetRequiredService<IMongoClient>();
    return client.GetDatabase("whisper_messages_db");
});


builder.Services.AddMinio(configureSource => configureSource
    .WithEndpoint(builder.Configuration["MinioSettings:Endpoint"])
    .WithCredentials(builder.Configuration["MinioSettings:AccessKey"], builder.Configuration["MinioSettings:SecretKey"])
    .WithSSL(bool.Parse(builder.Configuration["MinioSettings:WithSSL"] ?? "false")));

// Add repositories
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserDeviceRepository, UserDeviceRepository>();
builder.Services.AddScoped<IUserPrivacySettingRepository, UserPrivacySettingRepository>();
builder.Services.AddScoped<IOneTimePreKeyRepository, OneTimePreKeyRepository>();
builder.Services.AddScoped<IChatRepository, ChatRepository>();
builder.Services.AddScoped<IMessageRepository, MessageRepository>();
builder.Services.AddScoped<IReactionRepository, ReactionRepository>();
builder.Services.AddScoped<IAttachmentRepository, AttachmentRepository>();

//// Add services to the container.
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IPasswordService, PasswordService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserDeviceService, UserDeviceService>();
builder.Services.AddScoped<IUserPrivacySettingService, UserPrivacySettingService>();
builder.Services.AddScoped<IOneTimePreKeyService, OneTimePreKeyService>();
builder.Services.AddScoped<IChatService, ChatService>();
builder.Services.AddScoped<IMessageService, MessageService>();
builder.Services.AddScoped<IReactionService, ReactionService>();
builder.Services.AddScoped<IAttachmentService, AttachmentService>();
builder.Services.AddSingleton<IOnlineTracker, OnlineTracker>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IMediaService, MinioMediaService>();
builder.Services.AddMemoryCache();




builder.Services.AddHttpClient<IBinlistService, BinlistService>(client =>
{
    var baseUrl = builder.Configuration["ExternalApis:Binlist"];
    
    client.BaseAddress = new Uri(baseUrl);
    client.Timeout = TimeSpan.FromSeconds(10); 
})
.AddStandardResilienceHandler(); 

builder.Services.AddMemoryCache();

var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("JWT Key is missing!");
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ClockSkew = TimeSpan.Zero
    };
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;

            if (!string.IsNullOrEmpty(accessToken) &&
                path.Value!.Contains("/ws/v1/chat", StringComparison.OrdinalIgnoreCase))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
});

// Email Service
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("Smtp"));
builder.Services.AddTransient<IEmailService, EmailService>();

// Emoji Api Service
builder.Services.Configure<EmojiApiSettings>(builder.Configuration.GetSection("EmojiApi"));
builder.Services.AddHttpClient<IEmojiService, EmojiService>((serviceProvider, client) =>
{
    var options = serviceProvider
        .GetRequiredService<IOptions<EmojiApiSettings>>()
        .Value;
    client.BaseAddress = new Uri(options.BaseLink);
}).AddStandardResilienceHandler();

// Klipy Api Service
builder.Services.Configure<KlipyApiSettings>(builder.Configuration.GetSection("KlipyApi"));
builder.Services.AddHttpClient<IGifsService, KlipyService>((serviceProvider, client) =>
{
    var options = serviceProvider
        .GetRequiredService<IOptions<KlipyApiSettings>>()
        .Value;
    client.BaseAddress = new Uri(options.BaseLink);
}).AddStandardResilienceHandler();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
                // "https://localhost:5173",
                // "http://localhost:5173",
                // "https://whisper.switzerlandnorth.cloudapp.azure.com",
                // "http://whisper.switzerlandnorth.cloudapp.azure.com",
                // "https://51.103.209.177:5173",
                // "http://51.103.209.177",
                // "http://25.41.224.185:5173",
                // "https://25.41.224.185:5173",
                "https://25.41.224.185:5173",
                "https://100.101.70.10:5173",
                "https://fedora.tailfdec14.ts.net:5173",
                "https://localhost:5173",
                "https://whisper-secure.space:5173",
                "https://whisper-secure.space",
                "http://localhost:5173",
                "https://localhost:5173",
                "http://localhost"
                )
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials(); 
    });
});

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, context, cancellationToken) =>
    {
        const string schemeName = "Bearer";

        document.Components ??= new OpenApiComponents();

        if (document.Components.SecuritySchemes == null)
        {
            document.Components.SecuritySchemes = new Dictionary<string, IOpenApiSecurityScheme>();
        }

        IOpenApiSecurityScheme securityScheme = new OpenApiSecurityScheme
        {
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "Введіть JWT токен"
        };

        if (!document.Components.SecuritySchemes.ContainsKey(schemeName))
        {
            document.Components.SecuritySchemes.Add(schemeName, securityScheme);
        }

        var schemeReference = new OpenApiSecuritySchemeReference(schemeName);

        var requirement = new OpenApiSecurityRequirement();
        requirement.Add(schemeReference, new List<string>());

        document.Security ??= new List<OpenApiSecurityRequirement>();
        document.Security.Add(requirement);

        return Task.CompletedTask;
    });
});
builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;
});

var app = builder.Build();

app.UseOpenTelemetryPrometheusScrapingEndpoint();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.MapScalarApiReference(options =>
    {
        options.WithTitle("Whisper API")
                .WithTheme(ScalarTheme.Moon)
                .WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient);
    });
}
app.UseCors("AllowReactApp");

// app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.MapHub<WSChatController>("ws/v1/chat");

app.Run();