using GrowthLog.Application.DTOs.Auth;
using GrowthLog.Domain.Entities;
using GrowthLog.Infrastructure.Auth;
using GrowthLog.Infrastructure.Identity;
using GrowthLog.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Moq;
using Xunit;

namespace GrowthLog.Application.Tests;

public class AuthServiceTests
{
    private static AppDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    private static JwtTokenGenerator GetJwtTokenGenerator()
    {
        var settings = Options.Create(new JwtSettings
        {
            Secret = "super-secret-key-that-is-very-long-and-secure-12345",
            Issuer = "GrowthLog.Test",
            Audience = "GrowthLog.TestAudience",
            AccessTokenMinutes = 15,
            RefreshTokenDays = 7
        });
        return new JwtTokenGenerator(settings);
    }

    private static Mock<UserManager<ApplicationUser>> GetMockUserManager()
    {
        var store = new Mock<IUserStore<ApplicationUser>>();
        var userManager = new Mock<UserManager<ApplicationUser>>(
            store.Object, null!, null!, null!, null!, null!, null!, null!, null!);
        return userManager;
    }

    [Fact]
    public async Task RegisterAsync_WithValidRequest_CreatesUserAndProfile_ReturnsTokens()
    {
        // Arrange
        using var db = GetInMemoryDbContext();
        var mockUserManager = GetMockUserManager();
        var jwtGenerator = GetJwtTokenGenerator();

        mockUserManager
            .Setup(m => m.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Success);

        mockUserManager
            .Setup(m => m.UpdateAsync(It.IsAny<ApplicationUser>()))
            .ReturnsAsync(IdentityResult.Success);

        var service = new AuthService(mockUserManager.Object, jwtGenerator, db);
        var request = new RegisterRequest("newuser@example.com", "Password123!", "Yeni Kullanıcı");

        // Act
        var result = await service.RegisterAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.False(string.IsNullOrWhiteSpace(result.AccessToken));
        Assert.False(string.IsNullOrWhiteSpace(result.RefreshToken));

        var createdProfile = await db.DeveloperProfiles.FirstOrDefaultAsync(p => p.DisplayName == "Yeni Kullanıcı");
        Assert.False(string.IsNullOrWhiteSpace(createdProfile.PublicSlug));
    }

    [Fact]
    public async Task RegisterAsync_WhenUserCreationFails_ThrowsInvalidOperationException()
    {
        // Arrange
        using var db = GetInMemoryDbContext();
        var mockUserManager = GetMockUserManager();
        var jwtGenerator = GetJwtTokenGenerator();

        var identityErrors = new[]
        {
            new IdentityError { Code = "DuplicateUserName", Description = "E-posta zaten kullanımda." }
        };

        mockUserManager
            .Setup(m => m.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()))
            .ReturnsAsync(IdentityResult.Failed(identityErrors));

        var service = new AuthService(mockUserManager.Object, jwtGenerator, db);
        var request = new RegisterRequest("existing@example.com", "Password123!", "Mevcut Kullanıcı");

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => service.RegisterAsync(request));
        Assert.Contains("Kayıt başarısız", ex.Message);
    }

    [Fact]
    public async Task LoginAsync_WithValidCredentials_ReturnsTokens()
    {
        // Arrange
        using var db = GetInMemoryDbContext();
        var mockUserManager = GetMockUserManager();
        var jwtGenerator = GetJwtTokenGenerator();

        var existingUser = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            Email = "testuser@example.com",
            UserName = "testuser@example.com"
        };

        mockUserManager
            .Setup(m => m.FindByEmailAsync("testuser@example.com"))
            .ReturnsAsync(existingUser);

        mockUserManager
            .Setup(m => m.CheckPasswordAsync(existingUser, "CorrectPassword123!"))
            .ReturnsAsync(true);

        mockUserManager
            .Setup(m => m.UpdateAsync(existingUser))
            .ReturnsAsync(IdentityResult.Success);

        var service = new AuthService(mockUserManager.Object, jwtGenerator, db);
        var request = new LoginRequest("testuser@example.com", "CorrectPassword123!");

        // Act
        var result = await service.LoginAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.False(string.IsNullOrWhiteSpace(result.AccessToken));
        Assert.False(string.IsNullOrWhiteSpace(result.RefreshToken));
    }

    [Fact]
    public async Task LoginAsync_WithInvalidPassword_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        using var db = GetInMemoryDbContext();
        var mockUserManager = GetMockUserManager();
        var jwtGenerator = GetJwtTokenGenerator();

        var existingUser = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            Email = "testuser@example.com",
            UserName = "testuser@example.com"
        };

        mockUserManager
            .Setup(m => m.FindByEmailAsync("testuser@example.com"))
            .ReturnsAsync(existingUser);

        mockUserManager
            .Setup(m => m.CheckPasswordAsync(existingUser, "WrongPassword"))
            .ReturnsAsync(false);

        var service = new AuthService(mockUserManager.Object, jwtGenerator, db);
        var request = new LoginRequest("testuser@example.com", "WrongPassword");

        // Act & Assert
        var ex = await Assert.ThrowsAsync<UnauthorizedAccessException>(() => service.LoginAsync(request));
        Assert.Contains("E-posta veya şifre hatalı", ex.Message);
    }
}
