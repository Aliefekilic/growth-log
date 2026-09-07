using System.Security.Claims;
using GrowthLog.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.JsonWebTokens;

namespace GrowthLog.Infrastructure.Services;





public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid? UserId
    {
        get
        {
            var user = _httpContextAccessor.HttpContext?.User;
            var sub = user?.FindFirstValue(JwtRegisteredClaimNames.Sub)
                ?? user?.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? user?.FindFirst("sub")?.Value;
            return Guid.TryParse(sub, out var id) ? id : null;
        }
    }

    public string? Email =>
        _httpContextAccessor.HttpContext?.User?.FindFirstValue(JwtRegisteredClaimNames.Email)
        ?? _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Email);
}
