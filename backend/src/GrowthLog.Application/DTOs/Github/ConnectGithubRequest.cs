namespace GrowthLog.Application.DTOs.Github;

// Sadece kullanıcı adı yeterli: senkronizasyon GitHub'ın public REST API'siyle yapılıyor,
// bu yüzden OAuth token/PAT gerekmiyor (bkz. GithubSyncService dokümantasyonu ve README).
public record ConnectGithubRequest(string GithubUsername);
