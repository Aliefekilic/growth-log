using GrowthLog.Application.DTOs.Analytics;

namespace GrowthLog.Application.Interfaces;

public interface IAnalyticsService
{
    Task<AnalyticsOverviewDto> GetMyAnalyticsAsync(Guid userId);
    Task<AnalyticsOverviewDto?> GetPublicAnalyticsBySlugAsync(string slug);
}
