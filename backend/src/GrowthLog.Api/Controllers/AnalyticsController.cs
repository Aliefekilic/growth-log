using GrowthLog.Application.DTOs.Analytics;
using GrowthLog.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GrowthLog.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analyticsService;
    private readonly ICurrentUserService _currentUserService;

    public AnalyticsController(IAnalyticsService analyticsService, ICurrentUserService currentUserService)
    {
        _analyticsService = analyticsService;
        _currentUserService = currentUserService;
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<AnalyticsOverviewDto>> GetMyAnalytics()
    {
        if (_currentUserService.UserId is not { } userId) return Unauthorized();
        var analytics = await _analyticsService.GetMyAnalyticsAsync(userId);
        return Ok(analytics);
    }

    [HttpGet("/api/profiles/{slug}/analytics")]
    public async Task<ActionResult<AnalyticsOverviewDto>> GetPublicAnalytics(string slug)
    {
        var analytics = await _analyticsService.GetPublicAnalyticsBySlugAsync(slug);
        if (analytics == null) return NotFound("Profil bulunamadı.");
        return Ok(analytics);
    }
}
