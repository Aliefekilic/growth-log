using GrowthLog.Application.DTOs.Profiles;
using GrowthLog.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GrowthLog.Api.Controllers;

[ApiController]
[Route("api/profiles")]
public class ProfilesController : ControllerBase
{
    private readonly IProfileService _profileService;
    private readonly ICurrentUserService _currentUser;

    public ProfilesController(IProfileService profileService, ICurrentUserService currentUser)
    {
        _profileService = profileService;
        _currentUser = currentUser;
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<ProfileDto>> GetMyProfile(CancellationToken ct)
    {
        if (_currentUser.UserId is not { } userId) return Unauthorized();

        try
        {
            return Ok(await _profileService.GetMyProfileAsync(userId, ct));
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPut("me")]
    [Authorize]
    public async Task<ActionResult<ProfileDto>> UpdateMyProfile(UpdateProfileRequest request, CancellationToken ct)
    {
        if (_currentUser.UserId is not { } userId) return Unauthorized();

        try
        {
            return Ok(await _profileService.UpdateMyProfileAsync(userId, request, ct));
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // Public endpoint — auth gerektirmez, sadece IsPublic=true profiller döner.
    [HttpGet("{slug}")]
    [AllowAnonymous]
    public async Task<ActionResult<ProfileDto>> GetPublicProfile(string slug, CancellationToken ct)
    {
        var profile = await _profileService.GetPublicProfileAsync(slug, ct);
        return profile is null ? NotFound() : Ok(profile);
    }

    [HttpGet("public")]
    [AllowAnonymous]
    public async Task<ActionResult<List<ProfileDto>>> GetAllPublicProfiles(CancellationToken ct)
    {
        return Ok(await _profileService.GetAllPublicProfilesAsync(ct));
    }
}
