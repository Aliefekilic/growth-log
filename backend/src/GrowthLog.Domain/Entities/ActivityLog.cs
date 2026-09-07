using GrowthLog.Domain.Common;

namespace GrowthLog.Domain.Entities;




public class ActivityLog : BaseEntity
{
    public Guid DeveloperProfileId { get; set; }
    public string ActivityType { get; set; } = string.Empty; 
    public string? MetadataJson { get; set; }
}
