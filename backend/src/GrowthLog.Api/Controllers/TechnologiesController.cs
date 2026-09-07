using GrowthLog.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GrowthLog.Api.Controllers;

/// <summary>
/// Proje formundaki teknoloji etiket girişine otomatik tamamlama sağlar.
/// Asıl Technology kaydı ProjectService içinde proje kaydedilirken otomatik oluşturulur;
/// bu uç nokta sadece mevcut isimleri önermek için var.
/// </summary>
[ApiController]
[Route("api/technologies")]
[Authorize]
public class TechnologiesController : ControllerBase
{
    private readonly AppDbContext _db;

    public TechnologiesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<string>>> GetAll(CancellationToken ct)
    {
        var names = await _db.Technologies
            .OrderBy(t => t.Name)
            .Select(t => t.Name)
            .ToListAsync(ct);

        return Ok(names);
    }
}
