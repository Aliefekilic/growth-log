using GrowthLog.Application.DTOs.Projects;
using GrowthLog.Application.Interfaces;
using GrowthLog.Domain.Entities;
using GrowthLog.Domain.Enums;
using GrowthLog.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace GrowthLog.Infrastructure.Services;

public class ProjectService : IProjectService
{
    private readonly AppDbContext _db;

    public ProjectService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<ProjectDto>> GetForCurrentUserAsync(Guid userId, CancellationToken ct = default)
    {
        var profileId = await GetProfileIdAsync(userId, ct);

        var projects = await _db.Projects
            .Where(p => p.DeveloperProfileId == profileId)
            .Include(p => p.ProjectTechnologies).ThenInclude(pt => pt.Technology)
            .OrderByDescending(p => p.StartedAt)
            .ToListAsync(ct);

        return projects.Select(ToDto).ToList();
    }

    public async Task<ProjectDto?> GetByIdForCurrentUserAsync(Guid userId, Guid projectId, CancellationToken ct = default)
    {
        var profileId = await GetProfileIdAsync(userId, ct);

        var project = await _db.Projects
            .Include(p => p.ProjectTechnologies).ThenInclude(pt => pt.Technology)
            .FirstOrDefaultAsync(p => p.Id == projectId && p.DeveloperProfileId == profileId, ct);

        return project is null ? null : ToDto(project);
    }

    public async Task<ProjectDto> CreateAsync(Guid userId, CreateProjectRequest request, CancellationToken ct = default)
    {
        var profileId = await GetProfileIdAsync(userId, ct);

        var project = new Project
        {
            DeveloperProfileId = profileId,
            Title = request.Title,
            Summary = request.Summary,
            RepoUrl = request.RepoUrl,
            LiveUrl = request.LiveUrl,
            Status = ParseStatus(request.Status),
            ProblemStatement = request.ProblemStatement,
            ApproachesTried = request.ApproachesTried,
            FinalSolution = request.FinalSolution,
            LessonsLearned = request.LessonsLearned,
            StartedAt = request.StartedAt,
            CompletedAt = request.CompletedAt
        };

        project.ProjectTechnologies = await BuildProjectTechnologiesAsync(request.TechnologyNames, request.StartedAt, ct);

        _db.Projects.Add(project);
        await _db.SaveChangesAsync(ct);

        
        await _db.Entry(project).Collection(p => p.ProjectTechnologies).Query()
            .Include(pt => pt.Technology).LoadAsync(ct);

        return ToDto(project);
    }

    public async Task<ProjectDto?> UpdateAsync(Guid userId, Guid projectId, UpdateProjectRequest request, CancellationToken ct = default)
    {
        var profileId = await GetProfileIdAsync(userId, ct);

        var project = await _db.Projects
            .Include(p => p.ProjectTechnologies)
            .FirstOrDefaultAsync(p => p.Id == projectId && p.DeveloperProfileId == profileId, ct);

        if (project is null) return null;

        project.Title = request.Title;
        project.Summary = request.Summary;
        project.RepoUrl = request.RepoUrl;
        project.LiveUrl = request.LiveUrl;
        project.Status = ParseStatus(request.Status);
        project.ProblemStatement = request.ProblemStatement;
        project.ApproachesTried = request.ApproachesTried;
        project.FinalSolution = request.FinalSolution;
        project.LessonsLearned = request.LessonsLearned;
        project.StartedAt = request.StartedAt;
        project.CompletedAt = request.CompletedAt;
        project.UpdatedAt = DateTime.UtcNow;

        var existingPts = await _db.ProjectTechnologies.Where(pt => pt.ProjectId == projectId).ToListAsync(ct);
        if (existingPts.Count > 0)
        {
            _db.ProjectTechnologies.RemoveRange(existingPts);
        }

        var newTechs = await BuildProjectTechnologiesAsync(request.TechnologyNames, request.StartedAt, ct);
        foreach (var pt in newTechs)
        {
            pt.ProjectId = projectId;
            _db.ProjectTechnologies.Add(pt);
        }

        await _db.SaveChangesAsync(ct);

        await _db.Entry(project).Collection(p => p.ProjectTechnologies).Query()
            .Include(pt => pt.Technology).LoadAsync(ct);

        return ToDto(project);
    }

    public async Task<bool> DeleteAsync(Guid userId, Guid projectId, CancellationToken ct = default)
    {
        var profileId = await GetProfileIdAsync(userId, ct);

        var project = await _db.Projects
            .FirstOrDefaultAsync(p => p.Id == projectId && p.DeveloperProfileId == profileId, ct);

        if (project is null) return false;

        _db.Projects.Remove(project); 
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<List<ProjectDto>?> GetPublicProjectsAsync(string slug, CancellationToken ct = default)
    {
        var profile = await _db.DeveloperProfiles
            .FirstOrDefaultAsync(p => p.PublicSlug == slug && p.IsPublic, ct);

        if (profile is null) return null;

        var projects = await _db.Projects
            .Where(p => p.DeveloperProfileId == profile.Id)
            .Include(p => p.ProjectTechnologies).ThenInclude(pt => pt.Technology)
            .OrderByDescending(p => p.StartedAt)
            .ToListAsync(ct);

        return projects.Select(ToDto).ToList();
    }

    

    private async Task<Guid> GetProfileIdAsync(Guid userId, CancellationToken ct)
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

        return profile.Id;
    }

    
    
    
    
    
    private async Task<List<ProjectTechnology>> BuildProjectTechnologiesAsync(
        List<string> technologyNames, DateTime usedAt, CancellationToken ct)
    {
        var names = technologyNames
            .Select(n => n.Trim())
            .Where(n => n.Length > 0)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        if (names.Count == 0) return new List<ProjectTechnology>();

        var existing = await _db.Technologies
            .Where(t => names.Contains(t.Name))
            .ToListAsync(ct);

        var result = new List<ProjectTechnology>();

        foreach (var name in names)
        {
            var tech = existing.FirstOrDefault(t => string.Equals(t.Name, name, StringComparison.OrdinalIgnoreCase));
            if (tech is null)
            {
                tech = new Technology { Name = name };
                _db.Technologies.Add(tech);
                existing.Add(tech);
            }

            result.Add(new ProjectTechnology { Technology = tech, UsedAt = usedAt });
        }

        return result;
    }

    private static ProjectStatus ParseStatus(string status) =>
        Enum.TryParse<ProjectStatus>(status, ignoreCase: true, out var parsed)
            ? parsed
            : throw new InvalidOperationException($"Geçersiz proje durumu: {status}");

    private static ProjectDto ToDto(Project p) => new(
        p.Id, p.Title, p.Summary, p.RepoUrl, p.LiveUrl, p.Status.ToString(),
        p.ProblemStatement, p.ApproachesTried, p.FinalSolution, p.LessonsLearned,
        p.StartedAt, p.CompletedAt,
        p.ProjectTechnologies.Select(pt => pt.Technology.Name).OrderBy(n => n).ToList());
}
