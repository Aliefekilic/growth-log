using GrowthLog.Domain.Common;

namespace GrowthLog.Domain.Entities;





public class Technology : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Category { get; set; } 
    public string? IconUrl { get; set; }

    public ICollection<ProjectTechnology> ProjectTechnologies { get; set; } = new List<ProjectTechnology>();
}
