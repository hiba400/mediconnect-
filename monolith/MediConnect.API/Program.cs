using Microsoft.EntityFrameworkCore;
using MediConnect.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using FluentValidation;
using FluentValidation.AspNetCore;
using MediConnect.API.Validators;
using MediConnect.Domain.Interfaces;
using MediConnect.Infrastructure.Services;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddHttpClient<IAiServiceClient, AiServiceClient>(client =>
{
    client.BaseAddress = new Uri("http://localhost:8000/");
});

builder.Services.AddFluentValidationAutoValidation();

builder.Services.AddValidatorsFromAssemblyContaining<CreateUserDtoValidator>();

builder.Services.AddEndpointsApiExplorer();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (connectionString?.Contains("Host=") == true)
    {
        options.UseNpgsql(connectionString);
    }
    else
    {
        options.UseSqlite(connectionString);
    }
});

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

        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();

    if (connectionString?.Contains("Host=") == true)
    {
        db.Database.ExecuteSqlRaw("""
            CREATE TABLE IF NOT EXISTS "DoctorApplications" (
                "Id" uuid NOT NULL PRIMARY KEY,
                "UserId" uuid NOT NULL,
                "FullName" text NOT NULL,
                "Email" text NOT NULL,
                "Specialty" text NOT NULL,
                "LicenseNumber" text NOT NULL,
                "City" text NOT NULL,
                "YearsOfExperience" integer NOT NULL,
                "Bio" text NOT NULL,
                "DocumentCount" integer NOT NULL,
                "Status" integer NOT NULL,
                "SubmittedAt" timestamp with time zone NOT NULL
            );
            """);
    }

    // Seed a doctor if none exists
    if (!db.Users.Any(u => u.Role == MediConnect.Domain.Enums.UserRole.Doctor))
    {
        var doctorUser = new MediConnect.Domain.Entities.ApplicationUser
        {
            Id = Guid.NewGuid(),
            FullName = "Dr. Sarah Smith",
            Email = "doctor@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
            Role = MediConnect.Domain.Enums.UserRole.Doctor
        };
        
        db.Users.Add(doctorUser);
        
        db.SaveChanges();
    }

    // Seed a patient if none exists
    if (!db.Users.Any(u => u.Role == MediConnect.Domain.Enums.UserRole.Patient))
    {
        var patientUser = new MediConnect.Domain.Entities.ApplicationUser
        {
            Id = Guid.NewGuid(),
            FullName = "Sarah Mitchell",
            Email = "patient@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
            Role = MediConnect.Domain.Enums.UserRole.Patient
        };
        
        db.Users.Add(patientUser);
        
        db.SaveChanges();
    }

    // Ensure demo accounts exist (even if other users were registered)
    if (!db.Users.Any(u => u.Email == "patient@example.com"))
    {
        db.Users.Add(new MediConnect.Domain.Entities.ApplicationUser
        {
            Id = Guid.NewGuid(),
            FullName = "Sarah Mitchell",
            Email = "patient@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
            Role = MediConnect.Domain.Enums.UserRole.Patient,
            IsActive = true
        });
        db.SaveChanges();
    }

    if (!db.Users.Any(u => u.Email == "doctor@example.com"))
    {
        db.Users.Add(new MediConnect.Domain.Entities.ApplicationUser
        {
            Id = Guid.NewGuid(),
            FullName = "Dr. Sarah Smith",
            Email = "doctor@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
            Role = MediConnect.Domain.Enums.UserRole.Doctor,
            IsActive = true
        });
        db.SaveChanges();
    }

    // Seed an admin if none exists
    if (!db.Users.Any(u => u.Role == MediConnect.Domain.Enums.UserRole.Admin))
    {
        var adminUser = new MediConnect.Domain.Entities.ApplicationUser
        {
            Id = Guid.NewGuid(),
            FullName = "Admin User",
            Email = "admin@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
            Role = MediConnect.Domain.Enums.UserRole.Admin
        };
        
        db.Users.Add(adminUser);
        
        db.SaveChanges();
    }
}

// app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => Results.Redirect("http://localhost:8081"));

app.Run();