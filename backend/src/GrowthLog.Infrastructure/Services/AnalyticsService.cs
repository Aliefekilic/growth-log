using GrowthLog.Application.DTOs.Analytics;
using GrowthLog.Application.Interfaces;
using GrowthLog.Domain.Entities;
using GrowthLog.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace GrowthLog.Infrastructure.Services;

public class AnalyticsService : IAnalyticsService
{
    private readonly AppDbContext _db;

    public AnalyticsService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<AnalyticsOverviewDto> GetMyAnalyticsAsync(Guid userId)
    {
        var profile = await _db.DeveloperProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (profile == null)
        {
            return new AnalyticsOverviewDto();
        }

        return await BuildAnalyticsForProfileAsync(profile.Id);
    }

    public async Task<AnalyticsOverviewDto?> GetPublicAnalyticsBySlugAsync(string slug)
    {
        var profile = await _db.DeveloperProfiles
            .FirstOrDefaultAsync(p => p.PublicSlug == slug && p.IsPublic);

        if (profile == null) return null;

        return await BuildAnalyticsForProfileAsync(profile.Id);
    }

    private async Task<AnalyticsOverviewDto> BuildAnalyticsForProfileAsync(Guid profileId)
    {
        var projects = await _db.Projects
            .Include(p => p.ProjectTechnologies)
                .ThenInclude(pt => pt.Technology)
            .Where(p => p.DeveloperProfileId == profileId)
            .OrderBy(p => p.StartedAt)
            .ToListAsync();

        var totalCerts = await _db.Certificates.CountAsync(c => c.DeveloperProfileId == profileId);
        var totalRepos = await _db.Repositories.CountAsync(r => r.GithubAccount.DeveloperProfileId == profileId);
        var totalBlogs = await _db.BlogPosts.CountAsync(b => b.DeveloperProfileId == profileId && b.IsPublished);

        var statusBreakdown = projects
            .GroupBy(p => p.Status.ToString())
            .ToDictionary(g => g.Key, g => g.Count());

        // Top Technologies
        var techUsageList = projects
            .SelectMany(p => p.ProjectTechnologies.Select(pt => new { pt.Technology.Name, p.StartedAt }))
            .GroupBy(t => t.Name)
            .Select(g => new TechUsageDto
            {
                TechnologyName = g.Key,
                ProjectCount = g.Count(),
                FirstUsedAt = g.Min(x => x.StartedAt)
            })
            .OrderByDescending(t => t.ProjectCount)
            .ThenBy(t => t.FirstUsedAt)
            .ToList();

        // Technology Timeline (First project where each technology was used)
        var timelineMap = new Dictionary<string, TechTimelineItemDto>(StringComparer.OrdinalIgnoreCase);

        foreach (var proj in projects)
        {
            foreach (var pt in proj.ProjectTechnologies)
            {
                var techName = pt.Technology.Name;
                if (!timelineMap.ContainsKey(techName))
                {
                    timelineMap[techName] = new TechTimelineItemDto
                    {
                        TechnologyName = techName,
                        FirstUsedAt = pt.UsedAt != default ? pt.UsedAt : proj.StartedAt,
                        ProjectId = proj.Id,
                        ProjectTitle = proj.Title,
                        ProjectSummary = proj.Summary,
                        ProblemStatement = proj.ProblemStatement,
                        FinalSolution = proj.FinalSolution
                    };
                }
            }
        }

        var timelineList = timelineMap.Values
            .OrderBy(t => t.FirstUsedAt)
            .ToList();

        return new AnalyticsOverviewDto
        {
            TotalProjects = projects.Count,
            TotalCertificates = totalCerts,
            TotalRepositories = totalRepos,
            TotalBlogPosts = totalBlogs,
            StatusBreakdown = statusBreakdown,
            TopTechnologies = techUsageList,
            TechnologyTimeline = timelineList
        };
    }
}
