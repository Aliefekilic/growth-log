using GrowthLog.Application.DTOs.Blog;
using GrowthLog.Domain.Entities;
using GrowthLog.Infrastructure.Persistence;
using GrowthLog.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace GrowthLog.Application.Tests;

public class BlogServiceTests
{
    private static AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task CreateBlogPostAsync_ShouldGenerateSlugAndCreatePost()
    {
        // Arrange
        using var db = GetInMemoryDbContext();
        var userId = Guid.NewGuid();
        var profile = new DeveloperProfile
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            DisplayName = "Writer Dev",
            PublicSlug = "writer-dev",
            IsPublic = true
        };
        db.DeveloperProfiles.Add(profile);
        await db.SaveChangesAsync();

        var service = new BlogService(db);
        var createDto = new CreateBlogPostDto
        {
            Title = "Clean Architecture Mimarisi Neden Seçildi?",
            ContentMarkdown = "# İçerik\nClean architecture detayları...",
            IsPublished = true
        };

        // Act
        var post = await service.CreateBlogPostAsync(userId, createDto);

        // Assert
        Assert.NotNull(post);
        Assert.Equal("Clean Architecture Mimarisi Neden Seçildi?", post.Title);
        Assert.True(post.IsPublished);
        Assert.NotNull(post.PublishedAt);
        Assert.Contains("clean-architecture", post.Slug);
    }
}
