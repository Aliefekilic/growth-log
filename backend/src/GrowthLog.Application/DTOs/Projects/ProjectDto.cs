namespace GrowthLog.Application.DTOs.Projects;

public record ProjectDto(
    Guid Id,
    string Title,
    string Summary,
    string? RepoUrl,
    string? LiveUrl,
    string Status,
    string ProblemStatement,
    string? ApproachesTried,
    string FinalSolution,
    string? LessonsLearned,
    DateTime StartedAt,
    DateTime? CompletedAt,
    List<string> Technologies
);
