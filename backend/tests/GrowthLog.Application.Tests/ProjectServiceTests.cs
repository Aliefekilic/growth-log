using GrowthLog.Application.DTOs.Projects;
using GrowthLog.Domain.Entities;
using GrowthLog.Domain.Enums;
using GrowthLog.Infrastructure.Persistence;
using GrowthLog.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace GrowthLog.Application.Tests;

public class ProjectServiceTests
{
    private static AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task CreateAsync_WithValidData_CreatesProjectWithTechnologies()
    {
        // Arrange
        using var db = GetInMemoryDbContext();
        var userId = Guid.NewGuid();
        var profile = new DeveloperProfile
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            DisplayName = "Project Dev",
            PublicSlug = "project-dev",
            IsPublic = true
        };
        db.DeveloperProfiles.Add(profile);
        await db.SaveChangesAsync();

        var service = new ProjectService(db);
        var createRequest = new CreateProjectRequest(
            Title: "Developer Growth Log Platformu",
            Summary: "Geliştirici öğrenim günlüğü ve portföy sistemi.",
            RepoUrl: "https://github.com/example/growth-log",
            LiveUrl: "https://growthlog.example.com",
            Status: "InProgress",
            ProblemStatement: "Geliştiriciler öğrendikleri teknolojileri somut kanıtlarla sunamıyor.",
            ApproachesTried: "Düz CV hazırlamak yetersiz kaldı.",
            FinalSolution: "Clean Architecture ve Problem-Çözüm günlüğü ile platform geliştirildi.",
            LessonsLearned: "EF Core navigation property yönetimi ve JWT authentication pekiştirildi.",
            StartedAt: DateTime.UtcNow.AddDays(-30),
            CompletedAt: null,
            TechnologyNames: new List<string> { "C#", "ASP.NET Core", "React" }
        );

        // Act
        var project = await service.CreateAsync(userId, createRequest);

        // Assert
        Assert.NotNull(project);
        Assert.Equal("Developer Growth Log Platformu", project.Title);
        Assert.Equal(3, project.Technologies.Count);
        Assert.Contains(project.Technologies, t => t == "C#");
        Assert.Contains(project.Technologies, t => t == "React");
    }

    [Fact]
    public async Task GetForCurrentUserAsync_ReturnsOnlyUserProjects()
    {
        // Arrange
        using var db = GetInMemoryDbContext();
        var userId1 = Guid.NewGuid();
        var userId2 = Guid.NewGuid();

        var profile1 = new DeveloperProfile { Id = Guid.NewGuid(), UserId = userId1, DisplayName = "Dev 1", PublicSlug = "dev-1" };
        var profile2 = new DeveloperProfile { Id = Guid.NewGuid(), UserId = userId2, DisplayName = "Dev 2", PublicSlug = "dev-2" };
        db.DeveloperProfiles.AddRange(profile1, profile2);

        db.Projects.Add(new Project { Id = Guid.NewGuid(), DeveloperProfileId = profile1.Id, Title = "User 1 Project 1", Summary = "Desc 1", Status = ProjectStatus.Completed, ProblemStatement = "Prob 1", FinalSolution = "Sol 1" });
        db.Projects.Add(new Project { Id = Guid.NewGuid(), DeveloperProfileId = profile1.Id, Title = "User 1 Project 2", Summary = "Desc 2", Status = ProjectStatus.Completed, ProblemStatement = "Prob 2", FinalSolution = "Sol 2" });
        db.Projects.Add(new Project { Id = Guid.NewGuid(), DeveloperProfileId = profile2.Id, Title = "User 2 Project 1", Summary = "Desc 3", Status = ProjectStatus.Completed, ProblemStatement = "Prob 3", FinalSolution = "Sol 3" });
        await db.SaveChangesAsync();

        var service = new ProjectService(db);

        // Act
        var projectsUser1 = await service.GetForCurrentUserAsync(userId1);

        // Assert
        Assert.NotNull(projectsUser1);
        Assert.Equal(2, projectsUser1.Count);
        Assert.All(projectsUser1, p => Assert.Contains("User 1", p.Title));
    }

    [Fact]
    public async Task UpdateAsync_UpdatesFieldsAndTechnologies_ReturnsUpdatedProject()
    {
        // Arrange
        using var db = GetInMemoryDbContext();
        var userId = Guid.NewGuid();
        var profile = new DeveloperProfile { Id = Guid.NewGuid(), UserId = userId, DisplayName = "Dev", PublicSlug = "dev" };
        db.DeveloperProfiles.Add(profile);

        var existingProject = new Project
        {
            Id = Guid.NewGuid(),
            DeveloperProfileId = profile.Id,
            Title = "Eski Proje Başlığı",
            Summary = "Eski açıklama",
            Status = ProjectStatus.Planning,
            ProblemStatement = "Eski problem",
            FinalSolution = "Eski çözüm"
        };
        db.Projects.Add(existingProject);
        await db.SaveChangesAsync();
        db.ChangeTracker.Clear();

        var service = new ProjectService(db);
        var updateRequest = new UpdateProjectRequest(
            Title: "Güncellenmiş Proje Başlığı",
            Summary: "Yeni güncellenmiş açıklama",
            RepoUrl: null,
            LiveUrl: null,
            Status: "Completed",
            ProblemStatement: "Güncellenmiş problem",
            ApproachesTried: null,
            FinalSolution: "Güncellenmiş çözüm",
            LessonsLearned: null,
            StartedAt: DateTime.UtcNow.AddDays(-10),
            CompletedAt: DateTime.UtcNow,
            TechnologyNames: new List<string> { "TypeScript", "Vite" }
        );

        // Act
        var updated = await service.UpdateAsync(userId, existingProject.Id, updateRequest);

        // Assert
        Assert.NotNull(updated);
        Assert.Equal("Güncellenmiş Proje Başlığı", updated.Title);
        Assert.Equal("Completed", updated.Status);
        Assert.Equal(2, updated.Technologies.Count);
    }

    [Fact]
    public async Task DeleteAsync_RemovesProjectFromDatabase()
    {
        // Arrange
        using var db = GetInMemoryDbContext();
        var userId = Guid.NewGuid();
        var profile = new DeveloperProfile { Id = Guid.NewGuid(), UserId = userId, DisplayName = "Dev", PublicSlug = "dev" };
        db.DeveloperProfiles.Add(profile);

        var project = new Project
        {
            Id = Guid.NewGuid(),
            DeveloperProfileId = profile.Id,
            Title = "Silinecek Proje",
            Summary = "Silinecek açıklama",
            Status = ProjectStatus.Planning,
            ProblemStatement = "Prob",
            FinalSolution = "Sol"
        };
        db.Projects.Add(project);
        await db.SaveChangesAsync();

        var service = new ProjectService(db);

        // Act
        var result = await service.DeleteAsync(userId, project.Id);

        // Assert
        Assert.True(result);
        var deletedInDb = await db.Projects.FirstOrDefaultAsync(p => p.Id == project.Id);
        Assert.Null(deletedInDb);
    }
}
