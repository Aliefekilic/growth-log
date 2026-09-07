namespace GrowthLog.Application.DTOs.Profiles;

public record ProfileDto(
    Guid Id,
    string DisplayName,
    string PublicSlug,
    string? Title,
    string? Bio,
    string? AvatarUrl,
    string? Location,
    string? WebsiteUrl,
    string? LinkedInUrl,
    bool IsPublic
);
