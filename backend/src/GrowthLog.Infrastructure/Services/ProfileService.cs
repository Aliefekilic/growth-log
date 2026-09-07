using GrowthLog.Application.DTOs.Profiles;
using GrowthLog.Application.Interfaces;
using GrowthLog.Domain.Entities;
using GrowthLog.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace GrowthLog.Infrastructure.Services;

public class ProfileService : IProfileService
{
    private readonly AppDbContext _db;

    public ProfileService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<ProfileDto> GetMyProfileAsync(Guid userId, CancellationToken ct = default)
    {
        var profile = await _db.DeveloperProfiles.FirstOrDefaultAsync(p => p.UserId == userId, ct);
        if (profile == null)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId, ct);
            var displayName = user?.Email?.Split('@')[0] ?? "Geliştirici";
            var slugBase = displayName.ToLowerInvariant().Replace(" ", "-");
            profile = new DeveloperProfile
            {
                UserId = userId,
                DisplayName = displayName,
                PublicSlug = $"{slugBase}-{userId.ToString()[..6]}",
                IsPublic = true
            };
            _db.DeveloperProfiles.Add(profile);
            await _db.SaveChangesAsync(ct);
        }

        return ToDto(profile);
    }

    public async Task<ProfileDto> UpdateMyProfileAsync(Guid userId, UpdateProfileRequest request, CancellationToken ct = default)
    {
        var profile = await _db.DeveloperProfiles.FirstOrDefaultAsync(p => p.UserId == userId, ct);
        if (profile == null)
        {
            var slugBase = request.DisplayName.ToLowerInvariant().Replace(" ", "-");
            profile = new DeveloperProfile
            {
                UserId = userId,
                DisplayName = request.DisplayName,
                PublicSlug = $"{slugBase}-{userId.ToString()[..6]}",
                IsPublic = true
            };
            _db.DeveloperProfiles.Add(profile);
        }

        profile.DisplayName = request.DisplayName;
        profile.Title = request.Title;
        profile.Bio = request.Bio;
        profile.AvatarUrl = request.AvatarUrl;
        profile.Location = request.Location;
        profile.WebsiteUrl = request.WebsiteUrl;
        profile.LinkedInUrl = request.LinkedInUrl;
        profile.IsPublic = request.IsPublic;
        profile.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        return ToDto(profile);
    }

    public async Task<ProfileDto?> GetPublicProfileAsync(string slug, CancellationToken ct = default)
    {
        var profile = await _db.DeveloperProfiles
            .FirstOrDefaultAsync(p => p.PublicSlug == slug && p.IsPublic, ct);

        return profile is null ? null : ToDto(profile);
    }

    public async Task<List<ProfileDto>> GetAllPublicProfilesAsync(CancellationToken ct = default)
    {
        var profiles = await _db.DeveloperProfiles
            .Where(p => p.IsPublic)
            .OrderByDescending(p => p.UpdatedAt)
            .ToListAsync(ct);

        return profiles.Select(ToDto).ToList();
    }

    private static ProfileDto ToDto(DeveloperProfile p) => new(
        p.Id, p.DisplayName, p.PublicSlug, p.Title, p.Bio, p.AvatarUrl,
        p.Location, p.WebsiteUrl, p.LinkedInUrl, p.IsPublic);
}
