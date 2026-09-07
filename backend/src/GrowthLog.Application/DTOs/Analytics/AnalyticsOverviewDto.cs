namespace GrowthLog.Application.DTOs.Analytics;

public class AnalyticsOverviewDto
{
    public int TotalProjects { get; set; }
    public int TotalCertificates { get; set; }
    public int TotalRepositories { get; set; }
    public int TotalBlogPosts { get; set; }

    public Dictionary<string, int> StatusBreakdown { get; set; } = new();
    public List<TechUsageDto> TopTechnologies { get; set; } = new();
    public List<TechTimelineItemDto> TechnologyTimeline { get; set; } = new();
}

public class TechUsageDto
{
    public string TechnologyName { get; set; } = string.Empty;
    public int ProjectCount { get; set; }
    public DateTime FirstUsedAt { get; set; }
}

public class TechTimelineItemDto
{
    public string TechnologyName { get; set; } = string.Empty;
    public DateTime FirstUsedAt { get; set; }
    public Guid ProjectId { get; set; }
    public string ProjectTitle { get; set; } = string.Empty;
    public string ProjectSummary { get; set; } = string.Empty;
    public string ProblemStatement { get; set; } = string.Empty;
    public string FinalSolution { get; set; } = string.Empty;
}
