using GrowthLog.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GrowthLog.Infrastructure.Persistence.Configurations;

public class RepositoryConfiguration : IEntityTypeConfiguration<Repository>
{
    public void Configure(EntityTypeBuilder<Repository> builder)
    {
        builder.Property(r => r.Name).HasMaxLength(200).IsRequired();
        builder.Property(r => r.HtmlUrl).HasMaxLength(500).IsRequired();

        builder.HasOne(r => r.GithubAccount)
            .WithMany(a => a.Repositories)
            .HasForeignKey(r => r.GithubAccountId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
