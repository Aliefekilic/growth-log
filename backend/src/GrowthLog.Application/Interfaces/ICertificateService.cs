using GrowthLog.Application.DTOs.Certificates;

namespace GrowthLog.Application.Interfaces;

public interface ICertificateService
{
    Task<List<CertificateDto>> GetMyCertificatesAsync(Guid userId);
    Task<CertificateDto?> GetByIdAsync(Guid userId, Guid certificateId);
    Task<CertificateDto> CreateCertificateAsync(Guid userId, CreateCertificateDto dto);
    Task<CertificateDto?> UpdateCertificateAsync(Guid userId, Guid certificateId, UpdateCertificateDto dto);
    Task<bool> DeleteCertificateAsync(Guid userId, Guid certificateId);
    Task<List<CertificateDto>> GetPublicCertificatesBySlugAsync(string slug);
}
