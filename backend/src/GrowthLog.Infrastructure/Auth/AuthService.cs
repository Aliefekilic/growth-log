using GrowthLog.Application.DTOs.Auth;
using GrowthLog.Application.Interfaces;
using GrowthLog.Domain.Entities;
using GrowthLog.Infrastructure.Identity;
using GrowthLog.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace GrowthLog.Infrastructure.Auth;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly JwtTokenGenerator _tokenGenerator;
    private readonly AppDbContext _db;

    public AuthService(UserManager<ApplicationUser> userManager, JwtTokenGenerator tokenGenerator, AppDbContext db)
    {
        _userManager = userManager;
        _tokenGenerator = tokenGenerator;
        _db = db;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken ct = default)
    {
        var user = new ApplicationUser { UserName = request.Email, Email = request.Email };
        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
            throw new InvalidOperationException($"Kayıt başarısız: {errors}");
        }

        var slugBase = request.DisplayName.ToLowerInvariant().Replace(" ", "-");
        _db.DeveloperProfiles.Add(new DeveloperProfile
        {
            UserId = user.Id,
            DisplayName = request.DisplayName,
            PublicSlug = $"{slugBase}-{user.Id.ToString()[..6]}"
        });
        await _db.SaveChangesAsync(ct);

        return await IssueTokensAsync(user, ct);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken ct = default)
    {
        var user = await _userManager.FindByEmailAsync(request.Email)
            ?? throw new UnauthorizedAccessException("E-posta veya şifre hatalı.");

        var passwordOk = await _userManager.CheckPasswordAsync(user, request.Password);
        if (!passwordOk)
            throw new UnauthorizedAccessException("E-posta veya şifre hatalı.");

        return await IssueTokensAsync(user, ct);
    }

    public async Task<AuthResponse> RefreshAsync(RefreshTokenRequest request, CancellationToken ct = default)
    {
        var user = await _userManager.Users
            .FirstOrDefaultAsync(u => u.RefreshToken == request.RefreshToken, ct)
            ?? throw new UnauthorizedAccessException("Geçersiz refresh token.");

        if (user.RefreshTokenExpiresAt is null || user.RefreshTokenExpiresAt < DateTime.UtcNow)
            throw new UnauthorizedAccessException("Refresh token süresi dolmuş.");

        return await IssueTokensAsync(user, ct);
    }

    private async Task<AuthResponse> IssueTokensAsync(ApplicationUser user, CancellationToken ct)
    {
        var (accessToken, expiresAt) = _tokenGenerator.GenerateAccessToken(user);
        var refreshToken = _tokenGenerator.GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiresAt = DateTime.UtcNow.AddDays(_tokenGenerator.RefreshTokenDays);
        await _userManager.UpdateAsync(user);

        return new AuthResponse(accessToken, refreshToken, expiresAt);
    }
}
