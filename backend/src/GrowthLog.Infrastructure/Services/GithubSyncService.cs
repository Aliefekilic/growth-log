using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using GrowthLog.Application.DTOs.Github;
using GrowthLog.Application.Interfaces;
using GrowthLog.Domain.Entities;
using GrowthLog.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace GrowthLog.Infrastructure.Services;

/// <summary>
/// GitHub senkronizasyonu OAuth yerine GitHub'ın public REST API'siyle yapılıyor
/// (GET /users/{username}/repos — kimlik doğrulama gerektirmez, sadece public repoları döner).
/// Bu, "read-only repo sync" hedefini OAuth app kaydı/secret yönetimi olmadan karşılıyor;
/// bkz. README "neden bu teknik karar". İleride gerçek OAuth'a geçilirse sadece bu servis
/// ve ConnectAsync değişir — Controller ve DTO'lar aynı kalır.
/// </summary>
public class GithubSyncService : IGithubSyncService
{
    private readonly AppDbContext _db;
    private readonly IHttpClientFactory _httpClientFactory;

    public GithubSyncService(AppDbContext db, IHttpClientFactory httpClientFactory)
    {
        _db = db;
        _httpClientFactory = httpClientFactory;
    }

    public async Task<GithubAccountDto> ConnectAsync(Guid userId, ConnectGithubRequest request, CancellationToken ct = default)
    {
        var username = request.GithubUsername.Trim();
        if (username.Length == 0)
            throw new InvalidOperationException("GitHub kullanıcı adı boş olamaz.");

        var profileId = await GetProfileIdAsync(userId, ct);

        var account = await _db.GithubAccounts
            .Include(a => a.Repositories)
            .FirstOrDefaultAsync(a => a.DeveloperProfileId == profileId, ct);

        var repos = await FetchPublicReposAsync(username, ct); // önce doğrula: kullanıcı gerçekten var mı ve public repo çekilebiliyor mu

        if (account is null)
        {
            account = new GithubAccount { DeveloperProfileId = profileId, GithubUsername = username };
            _db.GithubAccounts.Add(account);
        }
        else
        {
            account.GithubUsername = username;
            _db.Repositories.RemoveRange(account.Repositories);
            account.Repositories.Clear();
        }

        account.LastSyncedAt = DateTime.UtcNow;
        foreach (var repo in repos) account.Repositories.Add(repo);

        await _db.SaveChangesAsync(ct);
        return ToDto(account);
    }

    public async Task<GithubAccountDto> SyncAsync(Guid userId, CancellationToken ct = default)
    {
        var profileId = await GetProfileIdAsync(userId, ct);

        var account = await _db.GithubAccounts
            .Include(a => a.Repositories)
            .FirstOrDefaultAsync(a => a.DeveloperProfileId == profileId, ct)
            ?? throw new InvalidOperationException("Önce bir GitHub kullanıcı adı bağlamalısın.");

        var repos = await FetchPublicReposAsync(account.GithubUsername, ct);

        _db.Repositories.RemoveRange(account.Repositories);
        account.Repositories.Clear();
        foreach (var repo in repos) account.Repositories.Add(repo);

        account.LastSyncedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);
        return ToDto(account);
    }

    public async Task<GithubAccountDto?> GetMineAsync(Guid userId, CancellationToken ct = default)
    {
        var profileId = await GetProfileIdAsync(userId, ct);

        var account = await _db.GithubAccounts
            .Include(a => a.Repositories)
            .FirstOrDefaultAsync(a => a.DeveloperProfileId == profileId, ct);

        return account is null ? null : ToDto(account);
    }

    public async Task<bool> DisconnectAsync(Guid userId, CancellationToken ct = default)
    {
        var profileId = await GetProfileIdAsync(userId, ct);

        var account = await _db.GithubAccounts.FirstOrDefaultAsync(a => a.DeveloperProfileId == profileId, ct);
        if (account is null) return false;

        _db.GithubAccounts.Remove(account); // Repository satırları cascade ile silinir.
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<List<RepositoryDto>?> GetPublicRepositoriesAsync(string slug, CancellationToken ct = default)
    {
        var profile = await _db.DeveloperProfiles.FirstOrDefaultAsync(p => p.PublicSlug == slug && p.IsPublic, ct);
        if (profile is null) return null;

        var account = await _db.GithubAccounts
            .Include(a => a.Repositories)
            .FirstOrDefaultAsync(a => a.DeveloperProfileId == profile.Id, ct);

        if (account is null) return new List<RepositoryDto>();

        return account.Repositories
            .OrderByDescending(r => r.RepoUpdatedAt)
            .Select(ToRepoDto)
            .ToList();
    }

    // --- yardımcılar ---

    private async Task<Guid> GetProfileIdAsync(Guid userId, CancellationToken ct)
    {
        var profileId = await _db.DeveloperProfiles
            .Where(p => p.UserId == userId)
            .Select(p => p.Id)
            .FirstOrDefaultAsync(ct);

        if (profileId == Guid.Empty)
            throw new InvalidOperationException("Profil bulunamadı.");

        return profileId;
    }

    private async Task<List<Repository>> FetchPublicReposAsync(string username, CancellationToken ct)
    {
        var client = _httpClientFactory.CreateClient("GitHub");

        HttpResponseMessage response;
        try
        {
            response = await client.GetAsync(
                $"users/{Uri.EscapeDataString(username)}/repos?per_page=100&sort=updated&type=owner",
                ct);
        }
        catch (HttpRequestException ex)
        {
            throw new InvalidOperationException("GitHub API'sine ulaşılamadı, daha sonra tekrar dene.", ex);
        }

        if (response.StatusCode == HttpStatusCode.NotFound)
            throw new InvalidOperationException($"'{username}' adında bir GitHub kullanıcısı bulunamadı.");

        if (!response.IsSuccessStatusCode)
            throw new InvalidOperationException("GitHub API isteği başarısız oldu (muhtemelen rate limit). Birkaç dakika sonra tekrar dene.");

        var json = await response.Content.ReadAsStringAsync(ct);
        var items = JsonSerializer.Deserialize<List<GithubRepoResponse>>(json, JsonOptions) ?? new();

        return items
            .Where(r => !r.Fork && !r.Archived)
            .Select(r => new Repository
            {
                Name = r.Name,
                PrimaryLanguage = r.Language,
                StarCount = r.StargazersCount,
                RepoUpdatedAt = r.UpdatedAt,
                HtmlUrl = r.HtmlUrl
            })
            .ToList();
    }

    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    private static GithubAccountDto ToDto(GithubAccount a) => new(
        a.GithubUsername,
        a.LastSyncedAt,
        a.Repositories.OrderByDescending(r => r.RepoUpdatedAt).Select(ToRepoDto).ToList());

    private static RepositoryDto ToRepoDto(Repository r) => new(
        r.Name, r.PrimaryLanguage, r.StarCount, r.RepoUpdatedAt, r.HtmlUrl);

    // GitHub REST API'nin /users/{username}/repos yanıtından ihtiyacımız olan alt küme.
    private class GithubRepoResponse
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("language")]
        public string? Language { get; set; }

        [JsonPropertyName("stargazers_count")]
        public int StargazersCount { get; set; }

        [JsonPropertyName("updated_at")]
        public DateTime UpdatedAt { get; set; }

        [JsonPropertyName("html_url")]
        public string HtmlUrl { get; set; } = string.Empty;

        [JsonPropertyName("fork")]
        public bool Fork { get; set; }

        [JsonPropertyName("archived")]
        public bool Archived { get; set; }
    }
}
