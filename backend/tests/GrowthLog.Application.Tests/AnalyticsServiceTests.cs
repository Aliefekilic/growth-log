using GrowthLog.Domain.Entities;
using GrowthLog.Domain.Enums;
using GrowthLog.Infrastructure.Persistence;
using GrowthLog.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace GrowthLog.Application.Tests;

public class AnalyticsServiceTests
{
    private static AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task GetMyAnalyticsAsync_ShouldCalculateMetricsCorrectly()
    {
        // Arrange
        using var db = GetInMemoryDbContext();
        var userId = Guid.NewGuid();
        var profile = new DeveloperProfile
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            DisplayName = "Analytics Dev",
            PublicSlug = "analytics-dev",
            IsPublic = true
        };
        db.DeveloperProfiles.Add(profile);

        var techCsharp = new Technology { Id = Guid.NewGuid(), Name = "C#" };
        var techReact = new Technology { Id = Guid.NewGuid(), Name = "React" };
        db.Technologies.AddRange(techCsharp, techReact);

        var proj1 = new Project
        {
            Id = Guid.NewGuid(),
            DeveloperProfileId = profile.Id,
            Title = "Backend API",
            Summary = "Clean Architecture API",
            ProblemStatement = "Needed scalable structure",
            FinalSolution = "Implemented ASP.NET Core Clean Arch",
            Status = ProjectStatus.Completed,
            StartedAt = new DateTime(2024, 1, 1)
        };

        db.Projects.Add(proj1);
        db.ProjectTechnologies.Add(new ProjectTechnology
        {
            ProjectId = proj1.Id,
            TechnologyId = techCsharp.Id,
            UsedAt = new DateTime(2024, 1, 1)
        });

        db.Certificates.Add(new Certificate
        {
            Id = Guid.NewGuid(),
            DeveloperProfileId = profile.Id,
            Title = "Certified C# Dev",
            IssuedBy = "Microsoft",
            IssuedAt = DateTime.UtcNow
        });

        await db.SaveChangesAsync();

        var analyticsService = new AnalyticsService(db);

        // Act
        var analytics = await analyticsService.GetMyAnalyticsAsync(userId);

        // Assert
        Assert.Equal(1, analytics.TotalProjects);
        Assert.Equal(1, analytics.TotalCertificates);
        Assert.True(analytics.StatusBreakdown.ContainsKey("Completed"));
        Assert.Equal(1, analytics.StatusBreakdown["Completed"]);
        Assert.Single(analytics.TechnologyTimeline);
        Assert.Equal("C#", analytics.TechnologyTimeline[0].TechnologyName);
    }
}
