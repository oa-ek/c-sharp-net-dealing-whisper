FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["Whisper.API/Whisper.API.csproj", "Whisper.API/"]
COPY ["Whisper.Application/Whisper.Application.csproj", "Whisper.Application/"]
COPY ["Whisper.Domain/Whisper.Domain.csproj", "Whisper.Domain/"]
COPY ["Whisper.Persistence/Whisper.Persistence.csproj", "Whisper.Persistence/"]

RUN dotnet restore "Whisper.API/Whisper.API.csproj"

COPY . .
WORKDIR "/src/Whisper.API"
RUN dotnet publish "Whisper.API.csproj" -c Release -o /app/publish

# Етап запуску
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=https://+:7055;http://+:5055
EXPOSE 7055
EXPOSE 5055

ENTRYPOINT ["dotnet", "Whisper.API.dll"]