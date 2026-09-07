using System.ComponentModel.DataAnnotations;

namespace GrowthLog.Application.DTOs.Auth;

public record LoginRequest(
    [Required(ErrorMessage = "E-posta adresi zorunludur.")]
    [EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi giriniz.")]
    string Email,

    [Required(ErrorMessage = "Şifre zorunludur.")]
    string Password
);
