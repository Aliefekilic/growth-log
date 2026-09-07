import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { projectApi } from '../api/projectApi';
import { profileApi } from '../api/profileApi';
import type { Project } from '../types/project';
import type { Profile } from '../types/profile';
import { PROJECT_STATUS_LABELS } from '../types/project';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Code2,
  Plus,
  ArrowRight,
  Sparkles,
  BookOpen,
  Award,
  BarChart3,
  ExternalLink,
  Flame,
  Layers,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      projectApi.getMine().catch(() => []),
      profileApi.getMine().catch(() => null),
    ]).then(([projData, profData]) => {
      setProjects(projData);
      setProfile(profData);
      setLoading(false);
    });
  }, []);

  const statusCounts = (projects ?? []).reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, {});

  const allTechs = Array.from(new Set((projects ?? []).flatMap((p) => p.technologies)));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Banner / Greeting */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/60 border border-indigo-500/20 p-6 sm:p-8 shadow-2xl shadow-indigo-950/30">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Developer Growth Engine v2.0</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Hoş geldin, <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">{profile?.displayName || 'Geliştirici'}</span> 👋
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Yazılım yolculuğunu kanıtlanabilir verilere dönüştür. Projelerini ekle, karşılaştığın problemleri & çözümleri kayıt altına al, teknik timeline'ını otomatik besle.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/projects/new"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Proje Ekle</span>
              </Link>

              <Link
                to="/devlog/new"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-indigo-500 text-slate-200 hover:text-white font-medium text-sm transition duration-200"
              >
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Devlog Yaz</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            label="Toplam Proje"
            value={projects ? projects.length : '…'}
            subtext="Aktif portföy büyüklüğü"
            icon={FolderKanban}
            gradient="from-indigo-500/20 via-indigo-600/10 to-transparent"
            borderColor="border-indigo-500/30"
            iconColor="text-indigo-400"
          />
          <StatCard
            label="Devam Eden"
            value={projects ? (statusCounts.InProgress ?? 0) : '…'}
            subtext="Geliştirme aşamasında"
            icon={Clock}
            gradient="from-amber-500/20 via-amber-600/10 to-transparent"
            borderColor="border-amber-500/30"
            iconColor="text-amber-400"
          />
          <StatCard
            label="Tamamlanan"
            value={projects ? (statusCounts.Completed ?? 0) : '…'}
            subtext="Canlı veya kullanıma hazır"
            icon={CheckCircle2}
            gradient="from-emerald-500/20 via-emerald-600/10 to-transparent"
            borderColor="border-emerald-500/30"
            iconColor="text-emerald-400"
          />
          <StatCard
            label="Teknoloji Çeşitliliği"
            value={projects ? allTechs.length : '…'}
            subtext="Deneyimlenen teknolojiler"
            icon={Code2}
            gradient="from-purple-500/20 via-purple-600/10 to-transparent"
            borderColor="border-purple-500/30"
            iconColor="text-purple-400"
          />
        </div>

        {/* Main Content Grid: Projects & Analytics Quick Peek */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Projects Overview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Öne Çıkan Projelerin</h2>
                    <p className="text-xs text-slate-400">Problem & Çözüm kayıtları içeren projeleriniz</p>
                  </div>
                </div>

                <Link
                  to="/projects"
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
                >
                  <span>Tümünü Gör ({projects?.length ?? 0})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {loading ? (
                <div className="py-12 text-center text-slate-500 text-sm">Yükleniyor...</div>
              ) : projects && projects.length === 0 ? (
                <div className="bg-slate-950/60 border border-dashed border-slate-800 rounded-xl p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mx-auto text-slate-500">
                    <FolderKanban className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-slate-300 font-medium">Henüz bir proje eklemedin.</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Kullandığın teknolojileri ve yaşadığın problem çözümlerini kaydetmek için ilk projeni ekle.
                  </p>
                  <Link
                    to="/projects/new"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition mt-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>İlk Projeni Ekle</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects?.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      className="group bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/50 rounded-xl p-4 transition-all duration-200 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white group-hover:text-indigo-300 transition">
                              {p.title}
                            </h3>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
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
                          <p className="text-xs text-slate-400 line-clamp-1">{p.summary}</p>
                        </div>

                        <Link
                          to={`/projects/${p.id}/edit`}
                          className="shrink-0 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
                          title="Düzenle"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>

                      {p.technologies && p.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {p.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="text-[11px] px-2.5 py-0.5 rounded-md bg-indigo-950/40 text-indigo-300 border border-indigo-800/40 font-mono"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Quick Stats & Technology Timeline peek */}
          <div className="space-y-6">
            {/* Active Tech Stack */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Kullanılan Teknolojiler</span>
                </h3>
                <span className="text-xs text-slate-400">{allTechs.length} adet</span>
              </div>

              {allTechs.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Henüz teknoloji eklenmedi.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {allTechs.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-medium hover:border-indigo-500/50 hover:text-white transition"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span>Gelişim Modülleri</span>
              </h3>

              <div className="space-y-2">
                <QuickLinkRow
                  to="/analytics"
                  title="Teknik Analitik"
                  subtitle="Zaman çizelgesi ve istatistikler"
                  icon={BarChart3}
                />
                <QuickLinkRow
                  to="/certificates"
                  title="Sertifikalar"
                  subtitle="Doğrulanabilir başarımlar"
                  icon={Award}
                />
                <QuickLinkRow
                  to="/devlog"
                  title="Geliştirici Günlüğü"
                  subtitle="Teknik blog yazıları"
                  icon={BookOpen}
                />
              </div>

              {profile && profile.publicSlug && (
                <div className="pt-2 border-t border-slate-800/80">
                  <Link
                    to={`/p/${profile.publicSlug}`}
                    target="_blank"
                    className="flex items-center justify-between w-full p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/50 transition"
                  >
                    <span>Kamu Profil Bağlantısı</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  gradient,
  borderColor,
  iconColor,
}: {
  label: string;
  value: string | number;
  subtext: string;
  icon: any;
  gradient: string;
  borderColor: string;
  iconColor: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-slate-900/90 border ${borderColor} rounded-2xl p-5 shadow-xl transition-all duration-200 hover:scale-[1.01]`}>
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-b ${gradient} rounded-full blur-2xl pointer-events-none`} />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">{label}</p>
          <p className="text-3xl font-extrabold text-white mt-1 tracking-tight">{value}</p>
        </div>
        <div className={`p-2.5 rounded-xl bg-slate-950 border border-slate-800 ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-[11px] text-slate-500 mt-3">{subtext}</p>
    </div>
  );
}

function QuickLinkRow({
  to,
  title,
  subtitle,
  icon: Icon,
}: {
  to: string;
  title: string;
  subtitle: string;
  icon: any;
}) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 hover:border-indigo-500/40 hover:bg-slate-800/50 transition group"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-slate-900 text-slate-400 group-hover:text-indigo-400 transition">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-200 group-hover:text-white transition">{title}</p>
          <p className="text-[11px] text-slate-500">{subtitle}</p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition" />
    </Link>
  );
}
