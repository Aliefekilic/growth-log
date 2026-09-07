using GrowthLog.Application.DTOs.Blog;
using GrowthLog.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GrowthLog.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BlogController : ControllerBase
{
    private readonly IBlogService _blogService;
    private readonly ICurrentUserService _currentUserService;

    public BlogController(IBlogService blogService, ICurrentUserService currentUserService)
    {
        _blogService = blogService;
        _currentUserService = currentUserService;
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<List<BlogPostDto>>> GetMyPosts()
    {
        if (_currentUserService.UserId is not { } userId) return Unauthorized();
        var posts = await _blogService.GetMyBlogPostsAsync(userId);
        return Ok(posts);
    }

    [Authorize]
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<BlogPostDto>> GetById(Guid id)
    {
        if (_currentUserService.UserId is not { } userId) return Unauthorized();
        var post = await _blogService.GetByIdAsync(userId, id);
        if (post == null) return NotFound("Yazı bulunamadı.");
        return Ok(post);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<BlogPostDto>> Create([FromBody] CreateBlogPostDto dto)
    {
        if (_currentUserService.UserId is not { } userId) return Unauthorized();
        var post = await _blogService.CreateBlogPostAsync(userId, dto);
        return CreatedAtAction(nameof(GetById), new { id = post.Id }, post);
    }

    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<BlogPostDto>> Update(Guid id, [FromBody] UpdateBlogPostDto dto)
    {
        if (_currentUserService.UserId is not { } userId) return Unauthorized();
        var post = await _blogService.UpdateBlogPostAsync(userId, id, dto);
        if (post == null) return NotFound("Yazı bulunamadı.");
        return Ok(post);
    }

    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        if (_currentUserService.UserId is not { } userId) return Unauthorized();
        var success = await _blogService.DeleteBlogPostAsync(userId, id);
        if (!success) return NotFound("Yazı bulunamadı.");
        return NoContent();
    }

    [HttpGet("/api/profiles/{slug}/blog")]
    public async Task<ActionResult<List<BlogPostDto>>> GetPublicPosts(string slug)
    {
        var posts = await _blogService.GetPublicBlogPostsBySlugAsync(slug);
        return Ok(posts);
    }

    [HttpGet("/api/profiles/{slug}/blog/{postSlug}")]
    public async Task<ActionResult<BlogPostDto>> GetPublicPostBySlug(string slug, string postSlug)
    {
        var post = await _blogService.GetPublicBlogPostBySlugAsync(slug, postSlug);
        if (post == null) return NotFound("Yazı bulunamadı.");
        return Ok(post);
    }
}
