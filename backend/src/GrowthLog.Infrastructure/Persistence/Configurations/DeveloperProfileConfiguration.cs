using GrowthLog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GrowthLog.Infrastructure.Persistence.Configurations;

public class DeveloperProfileConfiguration : IEntityTypeConfiguration<DeveloperProfile>
{
    public void Configure(EntityTypeBuilder<DeveloperProfile> builder)
    {
        builder.Property(p => p.DisplayName).HasMaxLength(150).IsRequired();
        builder.Property(p => p.PublicSlug).HasMaxLength(150).IsRequired();
        builder.HasIndex(p => p.PublicSlug).IsUnique();
        builder.HasIndex(p => p.UserId).IsUnique();
    }
}
