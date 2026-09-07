using GrowthLog.Domain.Common;

namespace GrowthLog.Domain.Entities;

/// <summary>
/// Project <-> Technology many-to-many ilişkisi.
/// UsedAt, "bu teknolojiyi bu projede ne zaman kullandın" sorusuna cevap verir
/// ve Technology Timeline'ın veri kaynağıdır.
/// </summary>
public class ProjectTechnology : BaseEntity
{
    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = null!;

    public Guid TechnologyId { get; set; }
    public Technology Technology { get; set; } = null!;

    public DateTime UsedAt { get; set; } = DateTime.UtcNow;
    public string? Note { get; set; } // "İlk kez burada öğrendim" gibi kısa not
}
