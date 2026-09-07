using GrowthLog.Application.DTOs.Github;

namespace GrowthLog.Application.Interfaces;

public interface IGithubSyncService
{
    /// <summary>Kullanıcının hesabına bir GitHub kullanıcı adı bağlar ve ilk senkronizasyonu yapar.</summary>
    Task<GithubAccountDto> ConnectAsync(Guid userId, ConnectGithubRequest request, CancellationToken ct = default);

    /// <summary>Bağlı hesabı GitHub'ın public API'sinden tekrar çeker (repo adı, dil, star, güncellenme tarihi).</summary>
    Task<GithubAccountDto> SyncAsync(Guid userId, CancellationToken ct = default);

    /// <summary>Giriş yapmış kullanıcının bağlı GitHub hesabı; hiç bağlamadıysa null.</summary>
    Task<GithubAccountDto?> GetMineAsync(Guid userId, CancellationToken ct = default);

    Task<bool> DisconnectAsync(Guid userId, CancellationToken ct = default);

    /// <summary>Herkese açık profil sayfası için repo listesi. Slug IsPublic=false ya da hesap bağlı değilse null.</summary>
    Task<List<RepositoryDto>?> GetPublicRepositoriesAsync(string slug, CancellationToken ct = default);
}
