using Microsoft.AspNetCore.Identity;

namespace GrowthLog.Infrastructure.Identity;





public class ApplicationUser : IdentityUser<Guid>
{
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiresAt { get; set; }
}
