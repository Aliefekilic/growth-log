using GrowthLog.Application.DTOs.Github;

namespace GrowthLog.Application.Interfaces;

public interface IGithubSyncService
{
    
    Task<GithubAccountDto> ConnectAsync(Guid userId, ConnectGithubRequest request, CancellationToken ct = default);

    
    Task<GithubAccountDto> SyncAsync(Guid userId, CancellationToken ct = default);

    
    Task<GithubAccountDto?> GetMineAsync(Guid userId, CancellationToken ct = default);

    Task<bool> DisconnectAsync(Guid userId, CancellationToken ct = default);

    
    Task<List<RepositoryDto>?> GetPublicRepositoriesAsync(string slug, CancellationToken ct = default);
}
