using System.Text.RegularExpressions;
using GrowthLog.Application.DTOs.Blog;
using GrowthLog.Application.Interfaces;
using GrowthLog.Domain.Entities;
using GrowthLog.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace GrowthLog.Infrastructure.Services;

public class BlogService : IBlogService
{
    private readonly AppDbContext _db;

    public BlogService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<BlogPostDto>> GetMyBlogPostsAsync(Guid userId)
    {
        var profile = await GetProfileByUserIdAsync(userId);
        if (profile == null) return [];

        return await _db.BlogPosts
            .Where(b => b.DeveloperProfileId == profile.Id)
            .OrderByDescending(b => b.CreatedAt)
            .Select(b => MapToDto(b))
            .ToListAsync();
    }

    public async Task<BlogPostDto?> GetByIdAsync(Guid userId, Guid postId)
    {
        var profile = await GetProfileByUserIdAsync(userId);
        if (profile == null) return null;

        var post = await _db.BlogPosts
            .FirstOrDefaultAsync(b => b.Id == postId && b.DeveloperProfileId == profile.Id);

        return post == null ? null : MapToDto(post);
    }

    public async Task<BlogPostDto> CreateBlogPostAsync(Guid userId, CreateBlogPostDto dto)
    {
        var profile = await GetProfileByUserIdAsync(userId)
            ?? throw new InvalidOperationException("Profil bulunamadı.");

        var slug = GenerateSlug(dto.Title);
        var post = new BlogPost
        {
            DeveloperProfileId = profile.Id,
            Title = dto.Title,
            Slug = slug,
            ContentMarkdown = dto.ContentMarkdown,
            IsPublished = dto.IsPublished,
            PublishedAt = dto.IsPublished ? DateTime.UtcNow : null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.BlogPosts.Add(post);
        await _db.SaveChangesAsync();

        return MapToDto(post);
    }

    public async Task<BlogPostDto?> UpdateBlogPostAsync(Guid userId, Guid postId, UpdateBlogPostDto dto)
    {
        var profile = await GetProfileByUserIdAsync(userId);
        if (profile == null) return null;

        var post = await _db.BlogPosts
            .FirstOrDefaultAsync(b => b.Id == postId && b.DeveloperProfileId == profile.Id);

        if (post == null) return null;

        if (post.Title != dto.Title)
        {
            post.Title = dto.Title;
            post.Slug = GenerateSlug(dto.Title);
        }

        post.ContentMarkdown = dto.ContentMarkdown;

        if (!post.IsPublished && dto.IsPublished)
        {
            post.PublishedAt = DateTime.UtcNow;
        }

        post.IsPublished = dto.IsPublished;
        post.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return MapToDto(post);
    }

    public async Task<bool> DeleteBlogPostAsync(Guid userId, Guid postId)
    {
        var profile = await GetProfileByUserIdAsync(userId);
        if (profile == null) return false;

        var post = await _db.BlogPosts
            .FirstOrDefaultAsync(b => b.Id == postId && b.DeveloperProfileId == profile.Id);

        if (post == null) return false;

        _db.BlogPosts.Remove(post);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<List<BlogPostDto>> GetPublicBlogPostsBySlugAsync(string profileSlug)
    {
        var profile = await _db.DeveloperProfiles
            .FirstOrDefaultAsync(p => p.PublicSlug == profileSlug && p.IsPublic);

        if (profile == null) return [];

        return await _db.BlogPosts
            .Where(b => b.DeveloperProfileId == profile.Id && b.IsPublished)
            .OrderByDescending(b => b.PublishedAt ?? DateTime.MinValue)
            .Select(b => MapToDto(b))
            .ToListAsync();
    }

    public async Task<BlogPostDto?> GetPublicBlogPostBySlugAsync(string profileSlug, string postSlug)
    {
        var profile = await _db.DeveloperProfiles
            .FirstOrDefaultAsync(p => p.PublicSlug == profileSlug && p.IsPublic);

        if (profile == null) return null;

        var post = await _db.BlogPosts
            .FirstOrDefaultAsync(b => b.DeveloperProfileId == profile.Id && b.Slug == postSlug && b.IsPublished);

        return post == null ? null : MapToDto(post);
    }

    private async Task<DeveloperProfile?> GetProfileByUserIdAsync(Guid userId)
    {
        return await _db.DeveloperProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
    }

    private static string GenerateSlug(string title)
    {
        var str = title.ToLowerInvariant();
        str = str.Replace("ı", "i").Replace("ğ", "g").Replace("ü", "u").Replace("ş", "s").Replace("ö", "o").Replace("ç", "c");
        str = Regex.Replace(str, @"[^a-z0-9\s-]", "");
        str = Regex.Replace(str, @"\s+", " ").Trim();
        str = str.Replace(" ", "-");
        return string.IsNullOrWhiteSpace(str) ? Guid.NewGuid().ToString("N")[..8] : str;
    }

    private static BlogPostDto MapToDto(BlogPost b)
    {
        return new BlogPostDto
        {
            Id = b.Id,
            DeveloperProfileId = b.DeveloperProfileId,
            Title = b.Title,
            Slug = b.Slug,
            ContentMarkdown = b.ContentMarkdown,
            IsPublished = b.IsPublished,
            PublishedAt = b.PublishedAt,
            CreatedAt = b.CreatedAt,
            UpdatedAt = b.UpdatedAt
        };
    }
}
