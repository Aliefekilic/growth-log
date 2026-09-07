using GrowthLog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GrowthLog.Infrastructure.Persistence.Configurations;

public class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.Property(p => p.Title).HasMaxLength(200).IsRequired();
        builder.Property(p => p.Summary).HasMaxLength(1000).IsRequired();
        builder.Property(p => p.ProblemStatement).HasMaxLength(4000).IsRequired();
        builder.Property(p => p.FinalSolution).HasMaxLength(4000).IsRequired();

        builder.HasOne(p => p.DeveloperProfile)
            .WithMany(dp => dp.Projects)
            .HasForeignKey(p => p.DeveloperProfileId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
