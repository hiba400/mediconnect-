# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project files and restore dependencies
COPY ["DoctorService.API/DoctorService.API.csproj", "DoctorService.API/"]
COPY ["DoctorService.Application/DoctorService.Application.csproj", "DoctorService.Application/"]
COPY ["DoctorService.Domain/DoctorService.Domain.csproj", "DoctorService.Domain/"]
COPY ["DoctorService.Infrastructure/DoctorService.Infrastructure.csproj", "DoctorService.Infrastructure/"]
RUN dotnet restore "DoctorService.API/DoctorService.API.csproj"

# Copy the rest of the source code
COPY . .
WORKDIR "/src/DoctorService.API"

# Build the application
RUN dotnet build "DoctorService.API.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "DoctorService.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
COPY --from=publish /app/publish .

# Environment variables for the application
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "DoctorService.API.dll"]
