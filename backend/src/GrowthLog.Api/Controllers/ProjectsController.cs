using GrowthLog.Application.DTOs.Projects;
using GrowthLog.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GrowthLog.Api.Controllers;

[ApiController]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;
    private readonly ICurrentUserService _currentUser;

    public ProjectsController(IProjectService projectService, ICurrentUserService currentUser)
    {
        _projectService = projectService;
        _currentUser = currentUser;
    }

    [HttpGet("api/projects")]
    [Authorize]
    public async Task<ActionResult<List<ProjectDto>>> GetMine(CancellationToken ct)
    {
        if (_currentUser.UserId is not { } userId) return Unauthorized();

        try
        {
            return Ok(await _projectService.GetForCurrentUserAsync(userId, ct));
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("api/projects/{id:guid}")]
    [Authorize]
    public async Task<ActionResult<ProjectDto>> GetById(Guid id, CancellationToken ct)
    {
        if (_currentUser.UserId is not { } userId) return Unauthorized();

        var project = await _projectService.GetByIdForCurrentUserAsync(userId, id, ct);
        return project is null ? NotFound() : Ok(project);
    }

    [HttpPost("api/projects")]
    [Authorize]
    public async Task<ActionResult<ProjectDto>> Create(CreateProjectRequest request, CancellationToken ct)
    {
        if (_currentUser.UserId is not { } userId) return Unauthorized();

        try
        {
            var created = await _projectService.CreateAsync(userId, request, ct);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("api/projects/{id:guid}")]
    [Authorize]
    public async Task<ActionResult<ProjectDto>> Update(Guid id, UpdateProjectRequest request, CancellationToken ct)
    {
        if (_currentUser.UserId is not { } userId) return Unauthorized();

        try
        {
            var updated = await _projectService.UpdateAsync(userId, id, request, ct);
            return updated is null ? NotFound() : Ok(updated);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("api/projects/{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        if (_currentUser.UserId is not { } userId) return Unauthorized();

        var deleted = await _projectService.DeleteAsync(userId, id, ct);
        return deleted ? NoContent() : NotFound();
    }

    // Herkese açık profil sayfası bunu kullanır — auth gerekmez, sadece IsPublic=true profiller döner.
    [HttpGet("api/profiles/{slug}/projects")]
    [AllowAnonymous]
    public async Task<ActionResult<List<ProjectDto>>> GetPublic(string slug, CancellationToken ct)
    {
        var projects = await _projectService.GetPublicProjectsAsync(slug, ct);
        return projects is null ? NotFound() : Ok(projects);
    }
}
