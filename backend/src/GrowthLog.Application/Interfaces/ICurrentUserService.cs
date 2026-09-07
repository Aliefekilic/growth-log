namespace GrowthLog.Application.Interfaces;

/// <summary>HttpContext'ten bağımsız, JWT'den çözülen kullanıcı bilgisine erişim.</summary>
public interface ICurrentUserService
{
    Guid? UserId { get; }
    string? Email { get; }
}
