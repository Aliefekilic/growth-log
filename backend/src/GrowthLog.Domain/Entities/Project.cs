using GrowthLog.Domain.Common;
using GrowthLog.Domain.Enums;

namespace GrowthLog.Domain.Entities;

/// <summary>
/// Projenin kendisi + bu projeyi klonlardan ayıran "Problem -> Çözüm" günlüğü alanları.
/// Bu alanlar zorunludur: farklılaşma stratejisinin kalbi burasıdır.
/// </summary>
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

    // --- Problem -> Çözüm günlüğü (farklılaşma ekseni) ---
    public string ProblemStatement { get; set; } = string.Empty;   // Karşılaşılan problem
    public string? ApproachesTried { get; set; }                   // Denenen yaklaşımlar (başarısızlar dahil)
    public string FinalSolution { get; set; } = string.Empty;      // Nihai çözüm ve neden seçildi
    public string? LessonsLearned { get; set; }                    // Bu süreçte öğrenilen/pekişen teknoloji

    public ICollection<ProjectTechnology> ProjectTechnologies { get; set; } = new List<ProjectTechnology>();
}
