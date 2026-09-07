using GrowthLog.Application.DTOs.Projects;

namespace GrowthLog.Application.Interfaces;

public interface IProjectService
{
    
    Task<List<ProjectDto>> GetForCurrentUserAsync(Guid userId, CancellationToken ct = default);

    
    Task<ProjectDto?> GetByIdForCurrentUserAsync(Guid userId, Guid projectId, CancellationToken ct = default);

    Task<ProjectDto> CreateAsync(Guid userId, CreateProjectRequest request, CancellationToken ct = default);

    
    Task<ProjectDto?> UpdateAsync(Guid userId, Guid projectId, UpdateProjectRequest request, CancellationToken ct = default);

    
    Task<bool> DeleteAsync(Guid userId, Guid projectId, CancellationToken ct = default);

    
    Task<List<ProjectDto>?> GetPublicProjectsAsync(string slug, CancellationToken ct = default);
}
