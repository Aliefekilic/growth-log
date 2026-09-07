
using System;
using GrowthLog.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace GrowthLog.Infrastructure.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20260906154207_InitialCreate")]
    partial class InitialCreate
    {
        
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("GrowthLog.Domain.Entities.ActivityLog", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("ActivityType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("DeveloperProfileId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("MetadataJson")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.ToTable("ActivityLogs");
                });

            modelBuilder.Entity("GrowthLog.Domain.Entities.BlogPost", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("ContentMarkdown")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("DeveloperProfileId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<bool>("IsPublished")
                        .HasColumnType("bit");

                    b.Property<DateTime?>("PublishedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Slug")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("DeveloperProfileId");

                    b.ToTable("BlogPosts");
                });

            modelBuilder.Entity("GrowthLog.Domain.Entities.Certificate", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("CredentialId")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CredentialUrl")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("DeveloperProfileId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("IssuedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("IssuedBy")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("DeveloperProfileId");

                    b.ToTable("Certificates");
                });

            modelBuilder.Entity("GrowthLog.Domain.Entities.DeveloperProfile", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("AvatarUrl")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Bio")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("DisplayName")
                        .IsRequired()
                        .HasMaxLength(150)
                        .HasColumnType("nvarchar(150)");

                    b.Property<bool>("IsPublic")
                        .HasColumnType("bit");

                    b.Property<string>("LinkedInUrl")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Location")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PublicSlug")
                        .IsRequired()
                        .HasMaxLength(150)
                        .HasColumnType("nvarchar(150)");

                    b.Property<string>("Title")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("WebsiteUrl")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("PublicSlug")
                        .IsUnique();

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("DeveloperProfiles");
                });

            modelBuilder.Entity("GrowthLog.Domain.Entities.GithubAccount", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("AccessTokenEncrypted")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("DeveloperProfileId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("GithubUsername")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<DateTime?>("LastSyncedAt")
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("DeveloperProfileId")
                        .IsUnique();

                    b.ToTable("GithubAccounts");
                });

            modelBuilder.Entity("GrowthLog.Domain.Entities.Project", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("ApproachesTried")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("CompletedAt")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("DeveloperProfileId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("FinalSolution")
                        .IsRequired()
                        .HasMaxLength(4000)
                        .HasColumnType("nvarchar(4000)");

                    b.Property<string>("LessonsLearned")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LiveUrl")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ProblemStatement")
                        .IsRequired()
                        .HasMaxLength(4000)
                        .HasColumnType("nvarchar(4000)");

                    b.Property<string>("RepoUrl")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("StartedAt")
                        .HasColumnType("datetime2");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.Property<string>("Summary")
                        .IsRequired()
                        .HasMaxLength(1000)
                        .HasColumnType("nvarchar(1000)");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("DeveloperProfileId");

                    b.ToTable("Projects");
                });

            modelBuilder.Entity("GrowthLog.Domain.Entities.ProjectTechnology", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Note")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("ProjectId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("TechnologyId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("UsedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("ProjectId");

                    b.HasIndex("TechnologyId");

                    b.ToTable("ProjectTechnologies");
                });

            modelBuilder.Entity("GrowthLog.Domain.Entities.Repository", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("GithubAccountId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("HtmlUrl")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<string>("PrimaryLanguage")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("RepoUpdatedAt")
                        .HasColumnType("datetime2");

                    b.Property<int>("StarCount")
                        .HasColumnType("int");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("GithubAccountId");

                    b.ToTable("Repositories");
                });

            modelBuilder.Entity("GrowthLog.Domain.Entities.Technology", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Category")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("IconUrl")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.ToTable("Technologies");
                });

            modelBuilder.Entity("GrowthLog.Infrastructure.Identity.ApplicationUser", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("int");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("bit");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("bit");

                    b.Property<DateTimeOffset?>("LockoutEnd")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("bit");

                    b.Property<string>("RefreshToken")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("RefreshTokenExpiresAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("bit");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasDatabaseName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasDatabaseName("UserNameIndex")
                        .HasFilter("[NormalizedUserName] IS NOT NULL");

                    b.ToTable("AspNetUsers", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRole<System.Guid>", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("nvarchar(256)");

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasDatabaseName("RoleNameIndex")
                        .HasFilter("[NormalizedName] IS NOT NULL");

                    b.ToTable("AspNetRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<System.Guid>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("RoleId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<System.Guid>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<System.Guid>", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ProviderKey")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<System.Guid>", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("RoleId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles", (string)null);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<System.Guid>", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("LoginProvider")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Value")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens", (string)null);
                });

            modelBuilder.Entity("GrowthLog.Domain.Entities.BlogPost", b =>
                {
                    b.HasOne("GrowthLog.Domain.Entities.DeveloperProfile", "DeveloperProfile")
                        .WithMany("BlogPosts")
                        .HasForeignKey("DeveloperProfileId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("DeveloperProfile");
                });

            modelBuilder.Entity("GrowthLog.Domain.Entities.Certificate", b =>
                {
                    b.HasOne("GrowthLog.Domain.Entities.DeveloperProfile", "DeveloperProfile")
                        .WithMany("Certificates")
                        .HasForeignKey("DeveloperProfileId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("DeveloperProfile");
                });

            modelBuilder.Entity("GrowthLog.Domain.Entities.GithubAccount", b =>
                {
                    b.HasOne("GrowthLog.Domain.Entities.DeveloperProfile", "DeveloperProfile")
                        .WithOne("GithubAccount")
                        .HasForeignKey("GrowthLog.Domain.Entities.GithubAccount", "DeveloperProfileId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("DeveloperProfile");
                });

            modelBuilder.Entity("GrowthLog.Domain.Entities.Project", b =>
                {
                    b.HasOne("GrowthLog.Domain.Entities.DeveloperProfile", "DeveloperProfile")
                        .WithMany("Projects")
                        .HasForeignKey("DeveloperProfileId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("DeveloperProfile");
                });

            modelBuilder.Entity("GrowthLog.Domain.Entities.ProjectTechnology", b =>
                {
                    b.HasOne("GrowthLog.Domain.Entities.Project", "Project")
                        .WithMany("ProjectTechnologies")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("GrowthLog.Domain.Entities.Technology", "Technology")
                        .WithMany("ProjectTechnologies")
                        .HasForeignKey("TechnologyId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Project");

                    b.Navigation("Technology");
                });

            modelBuilder.Entity("GrowthLog.Domain.Entities.Repository", b =>
                {
                    b.HasOne("GrowthLog.Domain.Entities.GithubAccount", "GithubAccount")
                        .WithMany("Repositories")
                        .HasForeignKey("GithubAccountId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("GithubAccount");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityRoleClaim<System.Guid>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole<System.Guid>", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserClaim<System.Guid>", b =>
                {
                    b.HasOne("GrowthLog.Infrastructure.Identity.ApplicationUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserLogin<System.Guid>", b =>
                {
                    b.HasOne("GrowthLog.Infrastructure.Identity.ApplicationUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserRole<System.Guid>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.IdentityRole<System.Guid>", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("GrowthLog.Infrastructure.Identity.ApplicationUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.IdentityUserToken<System.Guid>", b =>
                {
                    b.HasOne("GrowthLog.Infrastructure.Identity.ApplicationUser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("GrowthLog.Domain.Entities.DeveloperProfile", b =>
                {
                    b.Navigation("BlogPosts");

                    b.Navigation("Certificates");

                    b.Navigation("GithubAccount");

                    b.Navigation("Projects");
                });

            modelBuilder.Entity("GrowthLog.Domain.Entities.GithubAccount", b =>
                {
                    b.Navigation("Repositories");
                });

            modelBuilder.Entity("GrowthLog.Domain.Entities.Project", b =>
                {
                    b.Navigation("ProjectTechnologies");
                });

            modelBuilder.Entity("GrowthLog.Domain.Entities.Technology", b =>
                {
                    b.Navigation("ProjectTechnologies");
                });
#pragma warning restore 612, 618
        }
    }
}
