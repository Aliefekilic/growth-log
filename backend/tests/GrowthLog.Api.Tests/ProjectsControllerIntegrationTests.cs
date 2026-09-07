using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using GrowthLog.Application.DTOs.Auth;
using GrowthLog.Application.DTOs.Projects;
using GrowthLog.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace GrowthLog.Api.Tests;

public class ProjectsControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    private static readonly string DbName = $"ProjectTestDb_{Guid.NewGuid()}";

    public ProjectsControllerIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
                if (descriptor != null) services.Remove(descriptor);

                services.AddDbContext<AppDbContext>(options =>
                {
                    options.UseInMemoryDatabase(DbName);
                });
            });
        }).CreateClient();
    }

    [Fact]
    public async Task GetMyProjects_WithoutAuth_ReturnsUnauthorized()
    {
        // Act
        var response = await _client.GetAsync("/api/projects");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task CreateAndGetProject_WithAuthenticatedUser_ReturnsCreatedProject()
    {
        // 1. Kayıt Ol ve Token Al
        var regRequest = new RegisterRequest("proj_user@example.com", "Password123!", "Proje Sahibi");
        var regResponse = await _client.PostAsJsonAsync("/api/auth/register", regRequest);
        Assert.Equal(HttpStatusCode.OK, regResponse.StatusCode);

        var authData = await regResponse.Content.ReadFromJsonAsync<AuthResponse>();
        Assert.NotNull(authData);

        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authData.AccessToken);

        // 2. Proje Oluştur (POST /api/projects)
        var createProject = new CreateProjectRequest(
            Title: "Entest Projesi",
            Summary: "Entegrasyon testi ile oluşturulan proje",
            RepoUrl: "https://github.com/example/entest",
            LiveUrl: null,
            Status: "InProgress",
            ProblemStatement: "Test problemi",
            ApproachesTried: "Yaklaşımlar",
            FinalSolution: "Test çözümü",
            LessonsLearned: "Dersler",
            StartedAt: DateTime.UtcNow,
            CompletedAt: null,
            TechnologyNames: new List<string> { "C#", "xUnit" }
        );

        var postResponse = await _client.PostAsJsonAsync("/api/projects", createProject);
        Assert.True(postResponse.IsSuccessStatusCode, $"POST /api/projects failed with status {postResponse.StatusCode}");

        var createdProject = await postResponse.Content.ReadFromJsonAsync<ProjectDto>();
        Assert.NotNull(createdProject);
        Assert.Equal("Entest Projesi", createdProject.Title);

        // 3. Projelerimi Listele (GET /api/projects)
        var getResponse = await _client.GetAsync("/api/projects");
        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);

        var myProjects = await getResponse.Content.ReadFromJsonAsync<List<ProjectDto>>();
        Assert.NotNull(myProjects);
        Assert.Single(myProjects);
        Assert.Equal("Entest Projesi", myProjects[0].Title);
    }
}
