using GrowthLog.Domain.Common;

namespace GrowthLog.Domain.Entities;






public class DeveloperProfile : BaseEntity
{
    public Guid UserId { get; set; } 

    public string DisplayName { get; set; } = string.Empty;
    public string PublicSlug { get; set; } = string.Empty; 
    public string? Title { get; set; }        
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
