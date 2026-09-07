using System.ComponentModel.DataAnnotations;

namespace GrowthLog.Application.DTOs.Auth;

public record RegisterRequest(
    [Required(ErrorMessage = "E-posta adresi zorunludur.")]
    [EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi giriniz.")]
    string Email,

    [Required(ErrorMessage = "Şifre zorunludur.")]
    [MinLength(8, ErrorMessage = "Şifre en az 8 karakter olmalıdır.")]
    string Password,

    [Required(ErrorMessage = "Görünen ad zorunludur.")]
    [MinLength(2, ErrorMessage = "Görünen ad en az 2 karakter olmalıdır.")]
    string DisplayName
);
