using GrowthLog.Domain.Common;

namespace GrowthLog.Domain.Entities;

/// <summary>
/// GitHub'dan senkronize edilen repo özeti (read-only).
/// </summary>
public class Repository : BaseEntity
{
    public Guid GithubAccountId { get; set; }
    public GithubAccount GithubAccount { get; set; } = null!;

    public string Name { get; set; } = string.Empty;
    public string? PrimaryLanguage { get; set; }
    public int StarCount { get; set; }
    public DateTime RepoUpdatedAt { get; set; }
    public string HtmlUrl { get; set; } = string.Empty;
}
