using Microsoft.EntityFrameworkCore;
using DoctorService.Domain.Entities;

namespace DoctorService.Infrastructure.Data;

public class DoctorDbContext : DbContext
{
    public DoctorDbContext(DbContextOptions<DoctorDbContext> options) : base(options)
    {
    }

    public DbSet<DoctorProfile> DoctorProfiles => Set<DoctorProfile>();
}
