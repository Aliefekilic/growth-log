using GrowthLog.Application.DTOs.Blog;

namespace GrowthLog.Application.Interfaces;

public interface IBlogService
{
    Task<List<BlogPostDto>> GetMyBlogPostsAsync(Guid userId);
    Task<BlogPostDto?> GetByIdAsync(Guid userId, Guid postId);
    Task<BlogPostDto> CreateBlogPostAsync(Guid userId, CreateBlogPostDto dto);
    Task<BlogPostDto?> UpdateBlogPostAsync(Guid userId, Guid postId, UpdateBlogPostDto dto);
    Task<bool> DeleteBlogPostAsync(Guid userId, Guid postId);
    Task<List<BlogPostDto>> GetPublicBlogPostsBySlugAsync(string profileSlug);
    Task<BlogPostDto?> GetPublicBlogPostBySlugAsync(string profileSlug, string postSlug);
}
