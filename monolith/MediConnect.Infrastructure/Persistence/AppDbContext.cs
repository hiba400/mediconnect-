using Microsoft.EntityFrameworkCore;
using MediConnect.Domain.Entities;

namespace MediConnect.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<ApplicationUser> Users => Set<ApplicationUser>();


    public DbSet<Appointment> Appointments => Set<Appointment>();
}