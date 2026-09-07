namespace GrowthLog.Application.DTOs.Github;

public record GithubAccountDto(
    string GithubUsername,
    DateTime? LastSyncedAt,
    List<RepositoryDto> Repositories
);
