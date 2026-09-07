namespace GrowthLog.Application.DTOs.Projects;

// Create ile aynı şekil: PUT ile tam güncelleme (partial patch yok, basit tutuluyor).
public record UpdateProjectRequest(
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
    List<string> TechnologyNames
);
