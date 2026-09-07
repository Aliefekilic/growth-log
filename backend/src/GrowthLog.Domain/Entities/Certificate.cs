using GrowthLog.Domain.Common;

namespace GrowthLog.Domain.Entities;

public class Certificate : BaseEntity
{
    public Guid DeveloperProfileId { get; set; }
    public DeveloperProfile DeveloperProfile { get; set; } = null!;

    public string Title { get; set; } = string.Empty;
    public string IssuedBy { get; set; } = string.Empty;
    public DateTime IssuedAt { get; set; }
    public string? CredentialUrl { get; set; } // public verification linki
    public string? CredentialId { get; set; }
}
