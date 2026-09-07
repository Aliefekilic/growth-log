using GrowthLog.Application.DTOs.Certificates;
using GrowthLog.Application.Interfaces;
using GrowthLog.Domain.Entities;
using GrowthLog.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace GrowthLog.Infrastructure.Services;

public class CertificateService : ICertificateService
{
    private readonly AppDbContext _db;

    public CertificateService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<CertificateDto>> GetMyCertificatesAsync(Guid userId)
    {
        var profile = await GetProfileByUserIdAsync(userId);
        if (profile == null) return [];

        return await _db.Certificates
            .Where(c => c.DeveloperProfileId == profile.Id)
            .OrderByDescending(c => c.IssuedAt)
            .Select(c => MapToDto(c))
            .ToListAsync();
    }

    public async Task<CertificateDto?> GetByIdAsync(Guid userId, Guid certificateId)
    {
        var profile = await GetProfileByUserIdAsync(userId);
        if (profile == null) return null;

        var cert = await _db.Certificates
            .FirstOrDefaultAsync(c => c.Id == certificateId && c.DeveloperProfileId == profile.Id);

        return cert == null ? null : MapToDto(cert);
    }

    public async Task<CertificateDto> CreateCertificateAsync(Guid userId, CreateCertificateDto dto)
    {
        var profile = await GetProfileByUserIdAsync(userId)
            ?? throw new InvalidOperationException("Profil bulunamadı.");

        var cert = new Certificate
        {
            DeveloperProfileId = profile.Id,
            Title = dto.Title,
            IssuedBy = dto.IssuedBy,
            IssuedAt = dto.IssuedAt,
            CredentialUrl = dto.CredentialUrl,
            CredentialId = dto.CredentialId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Certificates.Add(cert);
        await _db.SaveChangesAsync();

        return MapToDto(cert);
    }

    public async Task<CertificateDto?> UpdateCertificateAsync(Guid userId, Guid certificateId, UpdateCertificateDto dto)
    {
        var profile = await GetProfileByUserIdAsync(userId);
        if (profile == null) return null;

        var cert = await _db.Certificates
            .FirstOrDefaultAsync(c => c.Id == certificateId && c.DeveloperProfileId == profile.Id);

        if (cert == null) return null;

        cert.Title = dto.Title;
        cert.IssuedBy = dto.IssuedBy;
        cert.IssuedAt = dto.IssuedAt;
        cert.CredentialUrl = dto.CredentialUrl;
        cert.CredentialId = dto.CredentialId;
        cert.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return MapToDto(cert);
    }

    public async Task<bool> DeleteCertificateAsync(Guid userId, Guid certificateId)
    {
        var profile = await GetProfileByUserIdAsync(userId);
        if (profile == null) return false;

        var cert = await _db.Certificates
            .FirstOrDefaultAsync(c => c.Id == certificateId && c.DeveloperProfileId == profile.Id);

        if (cert == null) return false;

        _db.Certificates.Remove(cert);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<List<CertificateDto>> GetPublicCertificatesBySlugAsync(string slug)
    {
        var profile = await _db.DeveloperProfiles
            .FirstOrDefaultAsync(p => p.PublicSlug == slug && p.IsPublic);

        if (profile == null) return [];

        return await _db.Certificates
            .Where(c => c.DeveloperProfileId == profile.Id)
            .OrderByDescending(c => c.IssuedAt)
            .Select(c => MapToDto(c))
            .ToListAsync();
    }

    private async Task<DeveloperProfile?> GetProfileByUserIdAsync(Guid userId)
    {
        return await _db.DeveloperProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
    }

    private static CertificateDto MapToDto(Certificate c)
    {
        return new CertificateDto
        {
            Id = c.Id,
            DeveloperProfileId = c.DeveloperProfileId,
            Title = c.Title,
            IssuedBy = c.IssuedBy,
            IssuedAt = c.IssuedAt,
            CredentialUrl = c.CredentialUrl,
            CredentialId = c.CredentialId,
            CreatedAt = c.CreatedAt
        };
    }
}
