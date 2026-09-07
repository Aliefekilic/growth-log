using System.ComponentModel.DataAnnotations;

namespace GrowthLog.Application.DTOs.Blog;

public class UpdateBlogPostDto
{
    [Required(ErrorMessage = "Başlık zorunludur.")]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "İçerik zorunludur.")]
    public string ContentMarkdown { get; set; } = string.Empty;

    public bool IsPublished { get; set; }
}
