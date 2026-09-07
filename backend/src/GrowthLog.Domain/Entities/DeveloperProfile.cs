using GrowthLog.Domain.Common;

namespace GrowthLog.Domain.Entities;

/// <summary>
/// Kullanıcının herkese açık profil bilgileri.
/// Kimlik (login/şifre) bilgisi Infrastructure katmanındaki ApplicationUser'da tutulur;
/// bu entity ona UserId üzerinden 1-1 bağlanır (Domain, Identity'e bağımlı değildir).
/// </summary>
public class DeveloperProfile : BaseEntity
{
    public Guid UserId { get; set; } // ApplicationUser.Id (Infrastructure) ile eşleşir

    public string DisplayName { get; set; } = string.Empty;
    public string PublicSlug { get; set; } = string.Empty; // /p/{slug} public url
    public string? Title { get; set; }        // "Full-Stack Developer" gibi
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
    public string? Location { get; set; }
    public string? WebsiteUrl { get; set; }
    public string? LinkedInUrl { get; set; }
    public bool IsPublic { get; set; } = true;

    public ICollection<Project> Projects { get; set; } = new List<Project>();
    public ICollection<Certificate> Certificates { get; set; } = new List<Certificate>();
    public ICollection<BlogPost> BlogPosts { get; set; } = new List<BlogPost>();
    public GithubAccount? GithubAccount { get; set; }
}
