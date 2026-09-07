using GrowthLog.Application.DTOs.Profiles;

namespace GrowthLog.Application.Interfaces;

public interface IProfileService
{
    /// <summary>Giriş yapmış kullanıcının kendi profili (private alanlar dahil).</summary>
    Task<ProfileDto> GetMyProfileAsync(Guid userId, CancellationToken ct = default);

    /// <summary>Kendi profilini günceller.</summary>
    Task<ProfileDto> UpdateMyProfileAsync(Guid userId, UpdateProfileRequest request, CancellationToken ct = default);

    /// <summary>Public slug ile herkese açık profil. IsPublic=false ise null döner.</summary>
    Task<ProfileDto?> GetPublicProfileAsync(string slug, CancellationToken ct = default);

    /// <summary>Herkese açık tüm geliştirici profillerini listeler.</summary>
    Task<List<ProfileDto>> GetAllPublicProfilesAsync(CancellationToken ct = default);
}
