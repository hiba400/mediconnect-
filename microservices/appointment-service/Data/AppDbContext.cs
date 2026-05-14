using Microsoft.EntityFrameworkCore;
using AppointmentService.API.Entities;

namespace AppointmentService.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Appointment> Appointments => Set<Appointment>();
}