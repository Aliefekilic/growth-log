using GrowthLog.Application.DTOs.Certificates;
using GrowthLog.Domain.Entities;
using GrowthLog.Infrastructure.Persistence;
using GrowthLog.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace GrowthLog.Application.Tests;

public class CertificateServiceTests
{
    private static AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task CreateCertificateAsync_ShouldAddCertificate_WhenProfileExists()
    {
        // Arrange
        using var db = GetInMemoryDbContext();
        var userId = Guid.NewGuid();
        var profile = new DeveloperProfile
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            DisplayName = "Test Developer",
            PublicSlug = "test-dev",
            IsPublic = true
        };
        db.DeveloperProfiles.Add(profile);
        await db.SaveChangesAsync();

        var service = new CertificateService(db);
        var createDto = new CreateCertificateDto
        {
            Title = "AWS Certified Developer",
            IssuedBy = "Amazon Web Services",
            IssuedAt = DateTime.UtcNow,
            CredentialUrl = "https://aws.amazon.com/verify/123",
            CredentialId = "AWS-123"
        };

        // Act
        var result = await service.CreateCertificateAsync(userId, createDto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("AWS Certified Developer", result.Title);
        Assert.Equal("Amazon Web Services", result.IssuedBy);
        Assert.Equal("AWS-123", result.CredentialId);

        var certInDb = await db.Certificates.FirstOrDefaultAsync(c => c.Id == result.Id);
        Assert.NotNull(certInDb);
    }

    [Fact]
    public async Task GetMyCertificatesAsync_ShouldReturnCertificates_ForGivenUser()
    {
        // Arrange
        using var db = GetInMemoryDbContext();
        var userId = Guid.NewGuid();
        var profile = new DeveloperProfile
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            DisplayName = "Dev",
            PublicSlug = "dev",
            IsPublic = true
        };
        db.DeveloperProfiles.Add(profile);

        db.Certificates.Add(new Certificate
        {
            Id = Guid.NewGuid(),
            DeveloperProfileId = profile.Id,
            Title = "Cert 1",
            IssuedBy = "Org 1",
            IssuedAt = DateTime.UtcNow
        });
        await db.SaveChangesAsync();

        var service = new CertificateService(db);

        // Act
        var certs = await service.GetMyCertificatesAsync(userId);

        // Assert
        Assert.Single(certs);
        Assert.Equal("Cert 1", certs[0].Title);
    }

    [Fact]
    public async Task DeleteCertificateAsync_ShouldRemoveCertificate()
    {
        // Arrange
        using var db = GetInMemoryDbContext();
        var userId = Guid.NewGuid();
        var profile = new DeveloperProfile { Id = Guid.NewGuid(), UserId = userId, PublicSlug = "dev-del" };
        db.DeveloperProfiles.Add(profile);

        var certId = Guid.NewGuid();
        db.Certificates.Add(new Certificate
        {
            Id = certId,
            DeveloperProfileId = profile.Id,
            Title = "To Be Deleted",
            IssuedBy = "Issuer",
            IssuedAt = DateTime.UtcNow
        });
        await db.SaveChangesAsync();

        var service = new CertificateService(db);

        // Act
        var success = await service.DeleteCertificateAsync(userId, certId);

        // Assert
        Assert.True(success);
        var cert = await db.Certificates.FindAsync(certId);
        Assert.Null(cert);
    }
}
