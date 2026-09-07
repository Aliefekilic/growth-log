using GrowthLog.Application.DTOs.Github;
using GrowthLog.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GrowthLog.Api.Controllers;

[ApiController]
[Route("api/github")]
public class GithubController : ControllerBase
{
    private readonly IGithubSyncService _githubService;
    private readonly ICurrentUserService _currentUser;

    public GithubController(IGithubSyncService githubService, ICurrentUserService currentUser)
    {
        _githubService = githubService;
        _currentUser = currentUser;
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<GithubAccountDto>> GetMine(CancellationToken ct)
    {
        if (_currentUser.UserId is not { } userId) return Unauthorized();

        var account = await _githubService.GetMineAsync(userId, ct);
        return account is null ? NotFound() : Ok(account);
    }

    [HttpPost("connect")]
    [Authorize]
    public async Task<ActionResult<GithubAccountDto>> Connect(ConnectGithubRequest request, CancellationToken ct)
    {
        if (_currentUser.UserId is not { } userId) return Unauthorized();

        try
        {
            return Ok(await _githubService.ConnectAsync(userId, request, ct));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("sync")]
    [Authorize]
    public async Task<ActionResult<GithubAccountDto>> Sync(CancellationToken ct)
    {
        if (_currentUser.UserId is not { } userId) return Unauthorized();

        try
        {
            return Ok(await _githubService.SyncAsync(userId, ct));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("disconnect")]
    [Authorize]
    public async Task<IActionResult> Disconnect(CancellationToken ct)
    {
        if (_currentUser.UserId is not { } userId) return Unauthorized();

        var disconnected = await _githubService.DisconnectAsync(userId, ct);
        return disconnected ? NoContent() : NotFound();
    }

    
    [HttpGet("/api/profiles/{slug}/repositories")]
    [AllowAnonymous]
    public async Task<ActionResult<List<RepositoryDto>>> GetPublic(string slug, CancellationToken ct)
    {
        var repos = await _githubService.GetPublicRepositoriesAsync(slug, ct);
        return repos is null ? NotFound() : Ok(repos);
    }
}
