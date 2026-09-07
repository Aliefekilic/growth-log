using GrowthLog.Domain.Common;
using GrowthLog.Domain.Enums;

namespace GrowthLog.Domain.Entities;





public class Project : BaseEntity
{
    public Guid DeveloperProfileId { get; set; }
    public DeveloperProfile DeveloperProfile { get; set; } = null!;

    public string Title { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string? RepoUrl { get; set; }
    public string? LiveUrl { get; set; }
    public ProjectStatus Status { get; set; } = ProjectStatus.Planning;
    public DateTime StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }

    
    public string ProblemStatement { get; set; } = string.Empty;   
    public string? ApproachesTried { get; set; }                   
    public string FinalSolution { get; set; } = string.Empty;      
    public string? LessonsLearned { get; set; }                    

    public ICollection<ProjectTechnology> ProjectTechnologies { get; set; } = new List<ProjectTechnology>();
}
