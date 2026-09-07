namespace GrowthLog.Application.DTOs.Projects;

public record CreateProjectRequest(
    string Title,
    string Summary,
    string? RepoUrl,
    string? LiveUrl,
    string Status,               // ProjectStatus enum adı: "Planning" | "InProgress" | "Completed" | "OnHold" | "Archived"
    string ProblemStatement,
    string? ApproachesTried,
    string FinalSolution,
    string? LessonsLearned,
    DateTime StartedAt,
    DateTime? CompletedAt,
    List<string> TechnologyNames
);
