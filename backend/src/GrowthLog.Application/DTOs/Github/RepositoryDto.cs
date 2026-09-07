namespace GrowthLog.Application.DTOs.Github;

public record RepositoryDto(
    string Name,
    string? PrimaryLanguage,
    int StarCount,
    DateTime RepoUpdatedAt,
    string HtmlUrl
);
