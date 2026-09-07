using GrowthLog.Domain.Common;

namespace GrowthLog.Domain.Entities;

/// <summary>
/// Analytics ekranı için ham aktivite kaydı (proje oluşturuldu, teknoloji eklendi, vb.).
/// </summary>
public class ActivityLog : BaseEntity
{
    public Guid DeveloperProfileId { get; set; }
    public string ActivityType { get; set; } = string.Empty; // "ProjectCreated", "TechnologyAdded" vs.
    public string? MetadataJson { get; set; }
}
