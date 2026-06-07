FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 5055
EXPOSE 7055

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["Whisper.API/Whisper.API.csproj", "Whisper.API/"]
RUN dotnet restore "Whisper.API/Whisper.API.csproj"
COPY . .
WORKDIR "/src/Whisper.API"
RUN dotnet build "Whisper.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Whisper.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Whisper.API.dll"]