namespace GrowthLog.Application.DTOs.Profiles;

public record UpdateProfileRequest(
    string DisplayName,
    string? Title,
    string? Bio,
    string? AvatarUrl,
    string? Location,
    string? WebsiteUrl,
    string? LinkedInUrl,
    bool IsPublic
);
