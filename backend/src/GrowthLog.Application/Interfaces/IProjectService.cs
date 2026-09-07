using GrowthLog.Application.DTOs.Projects;

namespace GrowthLog.Application.Interfaces;

public interface IProjectService
{
    /// <summary>Giriş yapmış kullanıcının kendi projeleri (tüm durumlar), en yeni başlayan üstte.</summary>
    Task<List<ProjectDto>> GetForCurrentUserAsync(Guid userId, CancellationToken ct = default);

    /// <summary>Tek bir projeyi getirir. Proje, çağıran kullanıcıya ait değilse null döner (edit formu için).</summary>
    Task<ProjectDto?> GetByIdForCurrentUserAsync(Guid userId, Guid projectId, CancellationToken ct = default);

    Task<ProjectDto> CreateAsync(Guid userId, CreateProjectRequest request, CancellationToken ct = default);

    /// <summary>Proje bu kullanıcıya ait değilse null döner.</summary>
    Task<ProjectDto?> UpdateAsync(Guid userId, Guid projectId, UpdateProjectRequest request, CancellationToken ct = default);

    /// <summary>Proje bu kullanıcıya ait değilse false döner.</summary>
    Task<bool> DeleteAsync(Guid userId, Guid projectId, CancellationToken ct = default);

    /// <summary>Herkese açık profil sayfası için: slug IsPublic=true değilse null döner.</summary>
    Task<List<ProjectDto>?> GetPublicProjectsAsync(string slug, CancellationToken ct = default);
}
