using GrowthLog.Domain.Entities;
using GrowthLog.Domain.Enums;
using GrowthLog.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace GrowthLog.Infrastructure.Persistence;

public static class DbInitializer
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<AppDbContext>>();

        try
        {
            // Auto-migrate if database is relational and pending migrations exist
            if (context.Database.IsSqlServer())
            {
                await context.Database.MigrateAsync();
            }
            else
            {
                await context.Database.EnsureCreatedAsync();
            }

            const string demoEmail = "demo@growthlog.dev";
            var existingUser = await userManager.FindByEmailAsync(demoEmail);

            if (existingUser != null)
            {
                // Demo user already seeded
                return;
            }

            logger.LogInformation("Seeding demo user and sample data...");

            // 1. Create Demo User
            var demoUser = new ApplicationUser
            {
                UserName = demoEmail,
                Email = demoEmail,
                EmailConfirmed = true
            };

            var createResult = await userManager.CreateAsync(demoUser, "DemoUser123!");
            if (!createResult.Succeeded)
            {
                logger.LogError("Failed to create demo user: {Errors}", string.Join(", ", createResult.Errors.Select(e => e.Description)));
                return;
            }

            // 2. Create Developer Profile
            var profile = new DeveloperProfile
            {
                UserId = demoUser.Id,
                DisplayName = "Ali Efe (Demo Portföy)",
                Title = "Full-Stack Developer & Software Architect",
                Bio = "Problem-çözüm odaklı yazılım geliştiren, Clean Architecture, .NET 8 ve React 19 üzerine çalışan kıdemli yazılımcı.",
                PublicSlug = "ali-efe-demo",
                Location = "İstanbul, Türkiye",
                LinkedInUrl = "https://linkedin.com/in/aliefe",
                WebsiteUrl = "https://aliefe.dev",
                IsPublic = true,
                UpdatedAt = DateTime.UtcNow
            };
            context.DeveloperProfiles.Add(profile);
            await context.SaveChangesAsync(); // Save to generate profile.Id

            // 3. Create Projects with Problem-Solution focus
            var project1 = new Project
            {
                DeveloperProfileId = profile.Id,
                Title = "Developer Growth Log Engine",
                Summary = "Geliştiricilerin sadece ne kod yazdığını değil, hangi problemi nasıl çözdüğünü ve ne öğrendiğini kanıtlanabilir şekilde sunan CV/Portföy platformu.",
                ProblemStatement = "Yazılımcılar projelerinde çok fazla teknik problem çözüyor ama geleneksel CV'ler sadece 'C#, React kullandım' demekle yetiniyor. Mülakatçılar gerçek problem çözme yeteneğini göremiyor.",
                ApproachesTried = "Statik PDF özgeçmişler ve standart GitHub reposu bağlantıları. İkisi de mülakatçının projenin içindeki mimari kararları hızlıca anlamasını sağlamıyordu.",
                FinalSolution = "Clean Architecture prensiplerine uygun .NET 8 Web API + React 19 SPA mimarisi. Otomatik GitHub sync, problem-çözüm kayıtları ve kamuya açık dinamik profil slug yapısı kuruldu.",
                LessonsLearned = "Domain ve Application katmanlarını altyapıdan tamamen izole etmenin birim test yazımını ne kadar kolaylaştırdığını deneyimledim.",
                Status = ProjectStatus.Completed,
                LiveUrl = "https://growthlog.demo.dev",
                RepoUrl = "https://github.com/aliefe/growth-log",
                StartedAt = DateTime.UtcNow.AddDays(-60),
                CompletedAt = DateTime.UtcNow.AddDays(-5),
                CreatedAt = DateTime.UtcNow.AddDays(-60)
            };

            var project2 = new Project
            {
                DeveloperProfileId = profile.Id,
                Title = "High-Throughput IP Rate Limiter & Security Service",
                Summary = "Mikrohizmet mimarilerinde brute-force saldırılarını önleyen IP partitioned rate limiting altyapısı.",
                ProblemStatement = "Giriş ve kayıt endpoint'lerine yapılan yoğun brute-force istekleri veritabanı bağlantı havuzunu tüketip yanıt sürelerini yükseltiyordu.",
                ApproachesTried = "Veritabanı seviyesinde giriş denemesi sayma middleware'i. Yüksek trafikte DB lock'larına ve gecikmelere sebep oldu.",
                FinalSolution = "ASP.NET Core RateLimiter ve IP bazlı FixedWindow partitioning kullanılarak bellek içi (in-memory) ultra hızlı 429 koruması entegre edildi.",
                LessonsLearned = "IP adreslerinin ters proxy (Nginx, Cloudflare) arkasında X-Forwarded-For başlığıyla nasıl güvenle ayıklanacağını ve middleware sıralamasının kritik önemini öğrendim.",
                Status = ProjectStatus.Completed,
                RepoUrl = "https://github.com/aliefe/rate-limiter-service",
                StartedAt = DateTime.UtcNow.AddDays(-30),
                CompletedAt = DateTime.UtcNow.AddDays(-10),
                CreatedAt = DateTime.UtcNow.AddDays(-30)
            };

            var project3 = new Project
            {
                DeveloperProfileId = profile.Id,
                Title = "AI-Powered Devlog & Portfolio Showcase",
                Summary = "Geliştiricilerin teknik günlük (Devlog) tutmasını kolaylaştıran Markdown editor ve canlı önizleme modülü.",
                ProblemStatement = "Teknik blog yazıları yazmak ve düzenlemek uzun sürüyor; geliştiriciler karmaşık CMS araçları yerine sade ve hızlı bir deneyim istiyor.",
                ApproachesTried = "WYSIWYG zengin metin editörleri. Çıktı HTML'i çok fazla gereksiz inline stil üretiyordu.",
                FinalSolution = "React 19 tabanlı split-screen Markdown editörü, syntax highlighting ve etiket bazlı devlog indeksleme sistemi.",
                LessonsLearned = "React state güncellemelerinde debounce tekniği ile DOM re-render maliyetlerini düşürmeyi uyguladım.",
                Status = ProjectStatus.InProgress,
                StartedAt = DateTime.UtcNow.AddDays(-15),
                CreatedAt = DateTime.UtcNow.AddDays(-15)
            };

            context.Projects.AddRange(project1, project2, project3);

            // 4. Create Blog Posts
            var post1 = new BlogPost
            {
                DeveloperProfileId = profile.Id,
                Title = "Neden Clean Architecture Tercih Etmeliyiz?",
                Slug = "neden-clean-architecture-tercih-etmeliyiz",
                ContentMarkdown = @"# Neden Clean Architecture?

Clean Architecture, bir yazılım projesinin iş kurallarını (Domain) dış faktörlerden (veritabanı, UI, 3. parti kütüphaneler) ayırmayı hedefler.

## Temel Avantajlar
1. **Veritabanından Bağımsızlık**: EF Core SQL Server yerine PostgreSQL'e geçildiğinde Domain katmanı değişmez.
2. **Kolay Test Edilebilirlik**: Mock objeler ile tüm iş kuralları saniyeler içinde unit test edilebilir.
3. **UI Esnekliği**: Web API, Console ya da gRPC arayüzleri aynı Application katmanını tüketir.

```csharp
public class ProjectService : IProjectService
{
    private readonly IAppDbContext _context;
    // Domain entity'leri bağımsızdır
}
```",
                IsPublished = true,
                PublishedAt = DateTime.UtcNow.AddDays(-10),
                CreatedAt = DateTime.UtcNow.AddDays(-10)
            };

            var post2 = new BlogPost
            {
                DeveloperProfileId = profile.Id,
                Title = "Vite + React 19 ile Süper Hızlı Geliştirme Ortamı",
                Slug = "vite-react-19-ile-super-hizli-gelistirme-ortami",
                ContentMarkdown = @"# Vite ve React 19 Gücü

Vite'in sunduğu instant HMR (Hot Module Replacement) sayesinde kod değişiklikleri saliseler içinde ekrana yansıyor.

## Öne Çıkan Özellikler
- **TypeScript Desteği**: Sıfır konfigürasyon ile tam tip güvenliği.
- **Tailwind CSS v4**: CSS değişkenleri tabanlı ultra hızlı stil yapılandırması.
- **Lucide Icons**: Hafif ve modern ikon kütüphanesi entegrasyonu.",
                IsPublished = true,
                PublishedAt = DateTime.UtcNow.AddDays(-4),
                CreatedAt = DateTime.UtcNow.AddDays(-4)
            };

            context.BlogPosts.AddRange(post1, post2);

            // 5. Create Certificates
            var cert1 = new Certificate
            {
                DeveloperProfileId = profile.Id,
                Title = "Microsoft Certified: Azure Solutions Architect Expert",
                IssuedBy = "Microsoft",
                IssuedAt = new DateTime(2025, 5, 15),
                CredentialUrl = "https://learn.microsoft.com/credentials",
                CreatedAt = DateTime.UtcNow.AddDays(-60)
            };

            var cert2 = new Certificate
            {
                DeveloperProfileId = profile.Id,
                Title = "Meta Front-End Developer Professional Certificate",
                IssuedBy = "Coursera / Meta",
                IssuedAt = new DateTime(2024, 11, 20),
                CredentialUrl = "https://coursera.org/verify",
                CreatedAt = DateTime.UtcNow.AddDays(-120)
            };

            context.Certificates.AddRange(cert1, cert2);

            await context.SaveChangesAsync();
            logger.LogInformation("Demo user and sample data successfully seeded!");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while seeding the database.");
        }
    }
}
