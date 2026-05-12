# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project files and restore dependencies
COPY ["MessagingService.API/MessagingService.API.csproj", "MessagingService.API/"]
COPY ["MessagingService.Application/MessagingService.Application.csproj", "MessagingService.Application/"]
COPY ["MessagingService.Domain/MessagingService.Domain.csproj", "MessagingService.Domain/"]
COPY ["MessagingService.Infrastructure/MessagingService.Infrastructure.csproj", "MessagingService.Infrastructure/"]
RUN dotnet restore "MessagingService.API/MessagingService.API.csproj"

# Copy the rest of the source code
COPY . .
WORKDIR "/src/MessagingService.API"

# Build the application
RUN dotnet build "MessagingService.API.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "MessagingService.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
COPY --from=publish /app/publish .

# Environment variables for the application
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "MessagingService.API.dll"]
