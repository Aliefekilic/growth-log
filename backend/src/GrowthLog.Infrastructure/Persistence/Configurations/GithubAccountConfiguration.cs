using GrowthLog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GrowthLog.Infrastructure.Persistence.Configurations;

public class GithubAccountConfiguration : IEntityTypeConfiguration<GithubAccount>
{
    public void Configure(EntityTypeBuilder<GithubAccount> builder)
    {
        builder.Property(a => a.GithubUsername).HasMaxLength(100).IsRequired();
        builder.HasIndex(a => a.DeveloperProfileId).IsUnique(); // bir profile en fazla 1 GitHub hesabı

        builder.HasOne(a => a.DeveloperProfile)
            .WithOne(dp => dp.GithubAccount)
            .HasForeignKey<GithubAccount>(a => a.DeveloperProfileId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
