import { useEffect, useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { analyticsApi } from '../../api/analyticsApi';
import type { AnalyticsOverview } from '../../types/analytics';
import {
  BarChart3,
  Rocket,
  Award,
  GitBranch,
  BookOpen,
  Zap,
  Target,
  Clock,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
} from 'lucide-react';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    analyticsApi
      .getMyAnalytics()
      .then((data) => {
        setAnalytics(data);
        setError('');
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Analitik veriler yüklenirken hata oluştu.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <div className="max-w-6xl mx-auto p-8 text-center text-slate-500 animate-pulse">
          Analitik verileri yükleniyor...
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <div className="max-w-4xl mx-auto p-8">
          <div className="p-4 bg-red-950/60 border border-red-800/60 rounded-2xl text-red-200 text-xs">
            {error || 'Analitik verileri yüklenemedi.'}
          </div>
        </div>
      </div>
    );
  }

  const maxTechCount = Math.max(...analytics.topTechnologies.map((t) => t.projectCount), 1);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Gelişim Analitiği & Timeline</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <BarChart3 className="w-7 h-7 text-indigo-400" />
              <span>Teknik Gelişim Dashboard'u</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Gelişiminizin kanıtı: Teknolojik zaman çizelgeniz, proje dağılımınız ve öğrenme geçmişiniz.
            </p>
          </div>
        </div>

        {/* Metrics Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <MetricCard
            title="Toplam Proje"
            value={analytics.totalProjects}
            subtext="Geliştirilen projeler"
            icon={Rocket}
            gradient="from-indigo-500/20 via-indigo-600/10 to-transparent"
            borderColor="border-indigo-500/30"
            iconColor="text-indigo-400"
          />
          <MetricCard
            title="Kayıtlı Sertifikalar"
            value={analytics.totalCertificates}
            subtext="Doğrulanmış başarımlar"
            icon={Award}
            gradient="from-emerald-500/20 via-emerald-600/10 to-transparent"
            borderColor="border-emerald-500/30"
            iconColor="text-emerald-400"
          />
          <MetricCard
            title="GitHub Repoları"
            value={analytics.totalRepositories}
            subtext="Açık kaynak repoları"
            icon={GitBranch}
            gradient="from-blue-500/20 via-blue-600/10 to-transparent"
            borderColor="border-blue-500/30"
            iconColor="text-blue-400"
          />
          <MetricCard
            title="Devlog Yazıları"
            value={analytics.totalBlogPosts}
            subtext="Geliştirici günlüğü"
            icon={BookOpen}
            gradient="from-purple-500/20 via-purple-600/10 to-transparent"
            borderColor="border-purple-500/30"
            iconColor="text-purple-400"
          />
        </div>

        {/* Section 1: Technology Usage & Status Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Technologies Bar Chart */}
          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">En Çok Kullanılan Teknolojiler</h2>
                <p className="text-xs text-slate-400">
                  Projelerinizdeki teknoloji frekansı ve ilk deneyimleme tarihiniz.
                </p>
              </div>
            </div>

            {analytics.topTechnologies.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-6 text-center">Henüz kayıtlı teknoloji bulunmuyor.</p>
            ) : (
              <div className="space-y-4 pt-2">
                {analytics.topTechnologies.map((tech) => {
                  const percentage = Math.round((tech.projectCount / maxTechCount) * 100);
                  return (
                    <div key={tech.technologyName} className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-200 font-mono">{tech.technologyName}</span>
                        <span className="text-slate-400">
                          <span className="text-indigo-400 font-bold">{tech.projectCount} Proje</span> ·{' '}
                          <span className="text-slate-500 font-mono">
                            İlk: {new Date(tech.firstUsedAt).toLocaleDateString('tr-TR')}
                          </span>
                        </span>
                      </div>

                      <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700 shadow-sm shadow-indigo-500/50"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Project Status Breakdown */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Proje Yaşam Döngüsü</h2>
                <p className="text-xs text-slate-400">Durum dağılımı</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {Object.keys(analytics.statusBreakdown).length === 0 ? (
                <p className="text-xs text-slate-500 italic py-6 text-center">Proje verisi yok.</p>
              ) : (
                Object.entries(analytics.statusBreakdown).map(([status, count]) => (
                  <div
                    key={status}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80"
                  >
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                      {status === 'InProgress' && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                      {status === 'Completed' && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                      {status === 'Maintenance' && <span className="w-2 h-2 rounded-full bg-blue-400" />}
                      {status === 'Archived' && <span className="w-2 h-2 rounded-full bg-slate-500" />}
                      <span>
                        {status === 'InProgress'
                          ? 'Devam Ediyor'
                          : status === 'Completed'
                          ? 'Tamamlandı'
                          : status === 'Maintenance'
                          ? 'Bakımda'
                          : 'Arşivlendi'}
                      </span>
                    </span>

                    <span className="text-xs font-extrabold text-indigo-300 bg-indigo-950/60 px-3 py-1 rounded-xl border border-indigo-800/40 font-mono">
                      {count}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Technology Timeline (Chronological proof of work) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Teknoloji Zaman Çizelgesi (Timeline)</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                "Hangi teknolojiyle ilk ne zaman, hangi projede tanıştın, ne öğrendin" kronolojik kanıtı.
              </p>
            </div>
          </div>

          {analytics.technologyTimeline.length === 0 ? (
            <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-2xl text-xs">
              Zaman çizelgesini besleyecek henüz proje verisi bulunmuyor.
            </div>
          ) : (
            <div className="relative border-l-2 border-indigo-500/30 ml-4 space-y-8 pl-6 sm:pl-8">
              {analytics.technologyTimeline.map((item, index) => (
                <div key={index} className="relative group">
                  {/* Timeline Node */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-indigo-500 border-4 border-slate-950 group-hover:scale-125 group-hover:bg-purple-400 transition duration-200" />

                  <div className="bg-slate-950 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 transition duration-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-indigo-300 bg-indigo-950/60 px-3 py-1 rounded-xl border border-indigo-800/40 font-mono">
                        {item.technologyName}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {new Date(item.firstUsedAt).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 flex items-center gap-1.5">
                      <span className="text-slate-500">İlk Kullanılan Proje:</span>
                      <span className="font-bold text-white">{item.projectTitle}</span>
                    </div>

                    {item.problemStatement && (
                      <div className="mt-3 p-4 bg-slate-900/90 rounded-xl text-xs space-y-2 border border-slate-800/60">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-amber-400">Karşılaşılan Problem: </span>
                            <span className="text-slate-300">{item.problemStatement}</span>
                          </div>
                        </div>

                        {item.finalSolution && (
                          <div className="flex items-start gap-2 pt-2 border-t border-slate-800/60">
                            <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-emerald-400">Nihai Çözüm: </span>
                              <span className="text-slate-300">{item.finalSolution}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtext,
  icon: Icon,
  gradient,
  borderColor,
  iconColor,
}: {
  title: string;
  value: number;
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
          <p className="text-xs font-medium text-slate-400">{title}</p>
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
