using GrowthLog.Domain.Common;

namespace GrowthLog.Domain.Entities;

/// <summary>
/// Katalogdaki teknoloji (React, ASP.NET Core, PostgreSQL...).
/// Technology Timeline ekranı bu tablo + ProjectTechnology.UsedAt üzerinden hesaplanır.
/// </summary>
public class Technology : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Category { get; set; } // "Frontend", "Backend", "Database", "Tool" vs.
    public string? IconUrl { get; set; }

    public ICollection<ProjectTechnology> ProjectTechnologies { get; set; } = new List<ProjectTechnology>();
}
