using Microsoft.AspNetCore.Identity;

namespace GrowthLog.Infrastructure.Identity;

/// <summary>
/// ASP.NET Identity kullanıcı sınıfı. Login/şifre/refresh token burada;
/// herkese açık profil bilgisi Domain.DeveloperProfile'da (UserId ile eşleşir).
/// </summary>
public class ApplicationUser : IdentityUser<Guid>
{
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiresAt { get; set; }
}
