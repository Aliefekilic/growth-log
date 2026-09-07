using GrowthLog.Application.DTOs.Certificates;
using GrowthLog.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GrowthLog.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CertificatesController : ControllerBase
{
    private readonly ICertificateService _certificateService;
    private readonly ICurrentUserService _currentUserService;

    public CertificatesController(ICertificateService certificateService, ICurrentUserService currentUserService)
    {
        _certificateService = certificateService;
        _currentUserService = currentUserService;
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<List<CertificateDto>>> GetMyCertificates()
    {
        if (_currentUserService.UserId is not { } userId) return Unauthorized();
        var certificates = await _certificateService.GetMyCertificatesAsync(userId);
        return Ok(certificates);
    }

    [Authorize]
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CertificateDto>> GetById(Guid id)
    {
        if (_currentUserService.UserId is not { } userId) return Unauthorized();
        var cert = await _certificateService.GetByIdAsync(userId, id);
        if (cert == null) return NotFound("Sertifika bulunamadı.");
        return Ok(cert);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<CertificateDto>> Create([FromBody] CreateCertificateDto dto)
    {
        if (_currentUserService.UserId is not { } userId) return Unauthorized();
        var cert = await _certificateService.CreateCertificateAsync(userId, dto);
        return CreatedAtAction(nameof(GetById), new { id = cert.Id }, cert);
    }

    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<CertificateDto>> Update(Guid id, [FromBody] UpdateCertificateDto dto)
    {
        if (_currentUserService.UserId is not { } userId) return Unauthorized();
        var cert = await _certificateService.UpdateCertificateAsync(userId, id, dto);
        if (cert == null) return NotFound("Sertifika bulunamadı.");
        return Ok(cert);
    }

    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        if (_currentUserService.UserId is not { } userId) return Unauthorized();
        var success = await _certificateService.DeleteCertificateAsync(userId, id);
        if (!success) return NotFound("Sertifika bulunamadı.");
        return NoContent();
    }

    [HttpGet("/api/profiles/{slug}/certificates")]
    public async Task<ActionResult<List<CertificateDto>>> GetPublicCertificates(string slug)
    {
        var certificates = await _certificateService.GetPublicCertificatesBySlugAsync(slug);
        return Ok(certificates);
    }
}
