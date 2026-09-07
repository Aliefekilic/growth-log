namespace GrowthLog.Application.DTOs.Certificates;

public class CertificateDto
{
    public Guid Id { get; set; }
    public Guid DeveloperProfileId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string IssuedBy { get; set; } = string.Empty;
    public DateTime IssuedAt { get; set; }
    public string? CredentialUrl { get; set; }
    public string? CredentialId { get; set; }
    public DateTime CreatedAt { get; set; }
}
