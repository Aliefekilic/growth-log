using GrowthLog.Domain.Common;

namespace GrowthLog.Domain.Entities;




public class GithubAccount : BaseEntity
{
    public Guid DeveloperProfileId { get; set; }
    public DeveloperProfile DeveloperProfile { get; set; } = null!;

    public string GithubUsername { get; set; } = string.Empty;
    public string AccessTokenEncrypted { get; set; } = string.Empty; 
    public DateTime? LastSyncedAt { get; set; }

    public ICollection<Repository> Repositories { get; set; } = new List<Repository>();
}
