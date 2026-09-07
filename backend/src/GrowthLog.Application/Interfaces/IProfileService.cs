using GrowthLog.Application.DTOs.Profiles;

namespace GrowthLog.Application.Interfaces;

public interface IProfileService
{
    
    Task<ProfileDto> GetMyProfileAsync(Guid userId, CancellationToken ct = default);

    
    Task<ProfileDto> UpdateMyProfileAsync(Guid userId, UpdateProfileRequest request, CancellationToken ct = default);

    
    Task<ProfileDto?> GetPublicProfileAsync(string slug, CancellationToken ct = default);

    
    Task<List<ProfileDto>> GetAllPublicProfilesAsync(CancellationToken ct = default);
}
