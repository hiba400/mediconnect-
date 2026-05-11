# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project files and restore dependencies
COPY ["MediConnect.API/MediConnect.API.csproj", "MediConnect.API/"]
COPY ["MediConnect.Domain/MediConnect.Domain.csproj", "MediConnect.Domain/"]
COPY ["MediConnect.Infrastructure/MediConnect.Infrastructure.csproj", "MediConnect.Infrastructure/"]
RUN dotnet restore "MediConnect.API/MediConnect.API.csproj"

# Copy the rest of the source code
COPY . .
WORKDIR "/src/MediConnect.API"

# Build the application
RUN dotnet build "MediConnect.API.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "MediConnect.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
COPY --from=publish /app/publish .

# Environment variables for the application
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "MediConnect.API.dll"]
