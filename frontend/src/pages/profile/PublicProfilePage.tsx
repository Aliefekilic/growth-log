import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { profileApi } from '../../api/profileApi';
import { projectApi } from '../../api/projectApi';
import { githubApi } from '../../api/githubApi';
import { certificateApi } from '../../api/certificateApi';
import type { Profile } from '../../types/profile';
import type { Project } from '../../types/project';
import { PROJECT_STATUS_LABELS } from '../../types/project';
import type { Repository } from '../../types/github';
import type { Certificate } from '../../types/certificate';
import {
  User,
  MapPin,
  Globe,
  Share2,
  GitBranch,
  Award,
  Clock,
  FolderKanban,
  ExternalLink,
  ShieldCheck,
  Star,
  Sparkles,
  ChevronDown,
  Code2,
} from 'lucide-react';

function buildTechnologyTimeline(projects: Project[]) {
  const firstSeen = new Map<string, { date: string; project: string }>();
  for (const p of projects) {
    for (const tech of p.technologies) {
      const existing = firstSeen.get(tech);
      if (!existing || p.startedAt < existing.date) {
        firstSeen.set(tech, { date: p.startedAt, project: p.title });
      }
    }
  }
  return [...firstSeen.entries()]
    .map(([tech, info]) => ({ tech, ...info }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export default function PublicProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    Promise.all([
      profileApi.getPublic(slug).catch(() => null),
      projectApi.getPublicForSlug(slug).catch(() => []),
      githubApi.getPublicForSlug(slug).catch(() => []),
      certificateApi.getPublicCertificates(slug).catch(() => []),
    ])
      .then(([prof, proj, repo, cert]) => {
        if (!prof) {
          setNotFound(true);
        } else {
          setProfile(prof);
          setProjects(proj);
          setRepositories(repo);
          setCertificates(cert);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-slate-500 text-sm animate-pulse">Profil yükleniyor...</div>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-950/50 border border-red-800/50 text-red-400 flex items-center justify-center mx-auto">
            <User className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-bold text-white">Profil Bulunamadı</h1>
          <p className="text-xs text-slate-400">
            Aradığınız profil mevcut değil veya henüz herkese açık hale getirilmemiş.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition"
          >
            Panele Dön
          </Link>
        </div>
      </div>
    );
  }

  const timeline = buildTechnologyTimeline(projects);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-600/10 via-purple-600/5 to-transparent blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Profile Header Card */}
        <div className="relative overflow-hidden bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-xl shadow-indigo-500/20 shrink-0 overflow-hidden">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  className="w-full h-full object-cover rounded-[22px]"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center font-black text-3xl sm:text-4xl text-white">
                  {profile.displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {profile.displayName}
                </h1>
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 text-[11px] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Doğrulanmış Profil
                </span>
              </div>

              {profile.title && (
                <p className="text-sm font-semibold text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  {profile.title}
                </p>
              )}

              {profile.bio && (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line pt-1">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          {/* Social Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-800/80 text-xs">
            {profile.location && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                {profile.location}
              </span>
            )}

            {profile.websiteUrl && (
              <a
                href={profile.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-indigo-300 hover:text-white hover:bg-indigo-900/50 transition"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Web Sitesi</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            )}

            {profile.linkedInUrl && (
              <a
                href={profile.linkedInUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-950/40 border border-blue-800/40 text-blue-300 hover:text-white hover:bg-blue-900/50 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            )}
          </div>
        </div>

        {/* GitHub Repositories Grid */}
        {repositories.length > 0 && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Öne Çıkan GitHub Repoları</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {repositories.map((r) => (
                <a
                  key={r.htmlUrl}
                  href={r.htmlUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group block bg-slate-950 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 transition-all duration-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-200 group-hover:text-indigo-300 transition">
                      {r.name}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-mono">
                      <Star className="w-3.5 h-3.5 fill-amber-400/20" />
                      {r.starCount}
                    </span>
                  </div>

                  {r.primaryLanguage && (
                    <span className="inline-block text-[11px] font-mono px-2 py-0.5 rounded-md bg-indigo-950/40 text-indigo-300 border border-indigo-800/40">
                      {r.primaryLanguage}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Certificates Showcase */}
        {certificates.length > 0 && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">Sertifikalar & Doğrulanabilir Başarımlar</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {certificates.map((c) => (
                <div
                  key={c.id}
                  className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm text-slate-100">{c.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-mono shrink-0">
                      ✓ Onaylı
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-indigo-400">{c.issuedBy}</p>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-900">
                    <span>{new Date(c.issuedAt).toLocaleDateString('tr-TR')}</span>
                    {c.credentialUrl && (
                      <a
                        href={c.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
                      >
                        <span>Doğrula</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technology Timeline */}
        {timeline.length > 0 && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-bold text-white">Teknoloji Zaman Çizelgesi</h2>
            </div>
            <p className="text-xs text-slate-400">
              Geliştiricinin her teknolojiyle ilk ne zaman, hangi projede tanıştığının kronolojik gösterimi.
            </p>

            <div className="space-y-3 pt-2">
              {timeline.map((t) => (
                <div
                  key={t.tech}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs"
                >
                  <span className="font-bold text-indigo-300 bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-800/40 font-mono">
                    {t.tech}
                  </span>
                  <span className="text-slate-400">
                    <span className="text-slate-500 font-mono">
                      {new Date(t.date).toLocaleDateString('tr-TR')}
                    </span>{' '}
                    · <span className="text-slate-200 font-medium">{t.project}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Showcase */}
        {projects.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 px-1">
              <FolderKanban className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-white">Portföy Projeleri</h2>
            </div>

            <div className="space-y-4">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white">{p.title}</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">{p.summary}</p>
                    </div>

                    <span
                      className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full border ${
                        p.status === 'Completed'
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50'
                          : p.status === 'InProgress'
                          ? 'bg-amber-950/60 text-amber-400 border-amber-800/50'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {PROJECT_STATUS_LABELS[p.status]}
                    </span>
                  </div>

                  {p.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {p.technologies.map((t) => (
                        <span
                          key={t}
                          className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-indigo-950/40 text-indigo-300 border border-indigo-800/40"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Problem & Solution Accordion */}
                  <details className="group border border-slate-800 rounded-2xl bg-slate-950/60 overflow-hidden">
                    <summary className="flex items-center justify-between p-4 text-xs font-semibold text-indigo-400 cursor-pointer hover:bg-slate-900/50 transition">
                      <span className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-indigo-400" />
                        Problem → Çözüm & Öğrenilen Dersler Günlüğü
                      </span>
                      <ChevronDown className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform duration-200" />
                    </summary>

                    <div className="p-4 pt-2 border-t border-slate-800/60 space-y-3 text-xs text-slate-300">
                      <div>
                        <span className="font-bold text-amber-400 block mb-0.5">Problem Tanımı:</span>
                        <p className="bg-slate-900 p-3 rounded-xl border border-slate-800">{p.problemStatement}</p>
                      </div>

                      {p.approachesTried && (
                        <div>
                          <span className="font-bold text-blue-400 block mb-0.5">Denenen Yaklaşımlar:</span>
                          <p className="bg-slate-900 p-3 rounded-xl border border-slate-800">{p.approachesTried}</p>
                        </div>
                      )}

                      <div>
                        <span className="font-bold text-emerald-400 block mb-0.5">Nihai Çözüm:</span>
                        <p className="bg-slate-900 p-3 rounded-xl border border-slate-800">{p.finalSolution}</p>
                      </div>

                      {p.lessonsLearned && (
                        <div>
                          <span className="font-bold text-purple-400 block mb-0.5">Öğrenilen Dersler:</span>
                          <p className="bg-slate-900 p-3 rounded-xl border border-slate-800">{p.lessonsLearned}</p>
                        </div>
                      )}
                    </div>
                  </details>

                  {/* Project Links */}
                  {(p.repoUrl || p.liveUrl) && (
                    <div className="flex items-center gap-4 pt-2 text-xs font-semibold">
                      {p.repoUrl && (
                        <a
                          href={p.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition"
                        >
                          <GitBranch className="w-3.5 h-3.5" />
                          <span>Kod Reposu</span>
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </a>
                      )}
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>Canlı Önizleme</span>
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GitHub Repositories Showcase */}
        {repositories.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 px-1">
              <GitBranch className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-white">GitHub Projeleri & Repolar ({repositories.length})</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {repositories.map((repo) => (
                <div
                  key={repo.name}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400">
                        <GitBranch className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-sm text-white truncate max-w-[200px]">{repo.name}</h3>
                    </div>

                    <a
                      href={repo.htmlUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2.5 py-1 rounded-lg bg-indigo-950/40 border border-indigo-800/40 transition"
                    >
                      <span>GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60 text-slate-400 font-mono">
                    {repo.primaryLanguage ? (
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-indigo-300 border border-slate-700 font-sans text-[11px]">
                        {repo.primaryLanguage}
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Genel Repo</span>
                    )}

                    <div className="flex items-center gap-3 text-slate-400">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                        {repo.starCount}
                      </span>
                      <span>{new Date(repo.repoUpdatedAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
