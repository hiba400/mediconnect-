using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DoctorService.Application.Interfaces;
using DoctorService.Application.Services;
using DoctorService.Domain.Interfaces;
using DoctorService.Infrastructure.Data;
using DoctorService.Infrastructure.Repositories;
using DoctorService.Domain.Entities;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<DoctorDbContext>(options =>
{
    options.UseNpgsql(connectionString);
});

// Dependency Injection
builder.Services.AddScoped<IDoctorRepository, DoctorRepository>();
builder.Services.AddScoped<IDoctorService, DoctorService.Application.Services.DoctorService>();

// Authentication
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
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

// Auto-migrate on startup for ease of testing
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<DoctorDbContext>();
    db.Database.EnsureCreated();

    if (!db.DoctorProfiles.Any())
    {
        db.DoctorProfiles.AddRange(
            new DoctorProfile
            {
                Id = Guid.NewGuid(),
                UserId = Guid.NewGuid(),
                FullName = "Dr. Sarah Smith",
                Specialty = "Cardiology",
                City = "Paris",
                ConsultationFee = 80,
                YearsOfExperience = 12,
                Bio = "Expert in cardiovascular health."
            },
            new DoctorProfile
            {
                Id = Guid.NewGuid(),
                UserId = Guid.NewGuid(),
                FullName = "Dr. James Wilson",
                Specialty = "Dermatology",
                City = "Lyon",
                ConsultationFee = 60,
                YearsOfExperience = 8,
                Bio = "Specialist in skin health."
            }
        );
        db.SaveChanges();
    }
}

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
