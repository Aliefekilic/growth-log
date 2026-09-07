using System.ComponentModel.DataAnnotations;

namespace GrowthLog.Application.DTOs.Certificates;

public class UpdateCertificateDto
{
    [Required(ErrorMessage = "Sertifika başlığı zorunludur.")]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Veren kurum zorunludur.")]
    [StringLength(200)]
    public string IssuedBy { get; set; } = string.Empty;

    [Required(ErrorMessage = "Veriliş tarihi zorunludur.")]
    public DateTime IssuedAt { get; set; }

    [Url(ErrorMessage = "Geçerli bir doğrulama URL'si giriniz.")]
    [StringLength(500)]
    public string? CredentialUrl { get; set; }

    [StringLength(100)]
    public string? CredentialId { get; set; }
}
