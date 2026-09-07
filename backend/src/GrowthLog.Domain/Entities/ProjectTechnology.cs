using GrowthLog.Domain.Common;

namespace GrowthLog.Domain.Entities;






public class ProjectTechnology : BaseEntity
{
    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = null!;

    public Guid TechnologyId { get; set; }
    public Technology Technology { get; set; } = null!;

    public DateTime UsedAt { get; set; } = DateTime.UtcNow;
    public string? Note { get; set; } 
}
