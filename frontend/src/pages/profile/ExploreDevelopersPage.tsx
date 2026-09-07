import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/Navbar";
import { profileApi } from "../../api/profileApi";
import { useAuth } from "../../context/AuthContext";
import type { Profile } from "../../types/profile";
import {
  Users, Search, ShieldCheck, MapPin, Sparkles, ArrowRight,
  Code2, BookOpen, Award, Star, Zap, TrendingUp, Filter, Globe,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────── */
type Category = "Full-Stack" | "Frontend" | "Backend" | "Mobile" | "DevOps";

interface ShowcaseProfile extends Profile {
  featuredBadge?: string;
  badgeColor?: string;
  tags?: string[];
  projectCount?: number;
  devlogCount?: number;
  certCount?: number;
  category?: Category;
  isFeatured?: boolean;
  highlightColor?: string;
}

/* ─── Vitrin Profilleri ──────────────────────────────────── */
const FEATURED_SHOWCASE: ShowcaseProfile[] = [
  {
    id: "showcase-1",
    displayName: "Mert Yılmaz",
    publicSlug: "mert-yilmaz-dev",
    title: "Senior Full-Stack Engineer",
    bio: "Mikroservis mimarileri, Clean Architecture ve DDD prensipleriyle büyük ölçekli SaaS ürünleri geliştiriyorum. Problem-Çözüm günlüklerim teknik mülakatlarda portföyümün omurgası oldu.",
    location: "İstanbul, Türkiye",
    isPublic: true,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    featuredBadge: "Öne Çıkan Rol Model",
    badgeColor: "from-indigo-500 to-purple-600",
    tags: ["React 19", "ASP.NET Core 8", "Docker", "PostgreSQL", "Redis"],
    projectCount: 12,
    devlogCount: 28,
    certCount: 5,
    category: "Full-Stack",
    isFeatured: true,
    highlightColor: "from-indigo-500/15 via-transparent to-transparent",
  },
  {
    id: "showcase-2",
    displayName: "Selin Kaya",
    publicSlug: "selin-kaya-ui",
    title: "Frontend Architect & UI/UX Lead",
    bio: "Erişilebilir, yüksek performanslı ve kullanıcı odaklı web platformları tasarlıyorum. Figma→Kod sürecimi, animasyon stratejilerimi ve Core Web Vitals optimizasyonlarımı devlog'larımda belgeliyorum.",
    location: "Ankara, Türkiye",
    isPublic: true,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    featuredBadge: "Tasarım & UI Lideri",
    badgeColor: "from-pink-500 to-rose-600",
    tags: ["React", "TypeScript", "Tailwind CSS v4", "Vite", "Figma"],
    projectCount: 8,
    devlogCount: 19,
    certCount: 3,
    category: "Frontend",
    isFeatured: true,
    highlightColor: "from-pink-500/15 via-transparent to-transparent",
  },
  {
    id: "showcase-3",
    displayName: "Caner Demir",
    publicSlug: "caner-backend",
    title: "Backend Systems & Cloud Architect",
    bio: "Dağıtık sistemler, event-driven mimari ve veritabanı indeksleme stratejileri konusunda üretim ortamında yaşadığım gerçek sorunları ve çözümlerimi paylaşıyorum.",
    location: "İzmir, Türkiye",
    isPublic: true,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    featuredBadge: "Sistem Mimarı",
    badgeColor: "from-emerald-500 to-teal-600",
    tags: ["C# / .NET 8", "Go", "Kafka", "Kubernetes", "Redis"],
    projectCount: 15,
    devlogCount: 34,
    certCount: 7,
    category: "Backend",
    isFeatured: true,
    highlightColor: "from-emerald-500/15 via-transparent to-transparent",
  },
  {
    id: "showcase-4",
    displayName: "Deniz Arslan",
    publicSlug: "deniz-mobile",
    title: "Mobile & Cross-Platform Engineer",
    bio: "Offline-first veri senkronizasyonu, native bileşen entegrasyonları ve mobil performans profillemesi hakkında öğrendiklerimi detaylı devlog'larımda paylaşıyorum.",
    location: "Antalya, Türkiye",
    isPublic: true,
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
    featuredBadge: "Mobil Uzmanı",
    badgeColor: "from-amber-500 to-orange-600",
    tags: ["Flutter", "React Native", "Kotlin", "Swift", "Firebase"],
    projectCount: 9,
    devlogCount: 15,
    certCount: 4,
    category: "Mobile",
    isFeatured: true,
    highlightColor: "from-amber-500/15 via-transparent to-transparent",
  },
  {
    id: "showcase-5",
    displayName: "Kerem Şahin",
    publicSlug: "kerem-devops",
    title: "DevOps & Platform Engineer",
    bio: "CI/CD pipeline optimizasyonu, Infrastructure as Code ve zero-downtime deployment stratejileri üzerine gerçek dünya deneyimlerimi aktarıyorum. GitOps ve Kubernetes devlog'larım en çok okunan içeriklerim.",
    location: "İstanbul, Türkiye",
    isPublic: true,
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
    featuredBadge: "Platform Mühendisi",
    badgeColor: "from-cyan-500 to-blue-600",
    tags: ["Docker", "Kubernetes", "Terraform", "GitHub Actions", "AWS"],
    projectCount: 11,
    devlogCount: 22,
    certCount: 6,
    category: "DevOps",
    isFeatured: true,
    highlightColor: "from-cyan-500/15 via-transparent to-transparent",
  },
];

/* ─── Yardımcı Bileşenler ────────────────────────────────── */
function StatBubble({ icon: Icon, value, label, color }: {
  icon: React.ElementType; value: number; label: string; color: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className={`w-3 h-3 ${color} shrink-0`} />
      <span className="font-bold text-white text-xs">{value}</span>
      <span className="text-slate-400 text-[10px]">{label}</span>
    </div>
  );
}

function CategoryBadge({ category }: { category?: Category }) {
  const map: Record<Category, { label: string; cls: string }> = {
    "Full-Stack": { label: "Full-Stack", cls: "bg-indigo-950/80 border-indigo-500/40 text-indigo-300" },
    "Frontend":  { label: "Frontend",  cls: "bg-pink-950/80 border-pink-500/40 text-pink-300" },
    "Backend":   { label: "Backend",   cls: "bg-emerald-950/80 border-emerald-500/40 text-emerald-300" },
    "Mobile":    { label: "Mobile",    cls: "bg-amber-950/80 border-amber-500/40 text-amber-300" },
    "DevOps":    { label: "DevOps",    cls: "bg-cyan-950/80 border-cyan-500/40 text-cyan-300" },
  };
  if (!category) return null;
  const cfg = map[category];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-bold tracking-wide ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

/* ─── Vitrin Kartı (büyük, öne çıkan) ─────────────────────── */
function FeaturedCard({ p }: { p: ShowcaseProfile }) {
  return (
    <div className="group relative bg-slate-900/90 border border-slate-800 hover:border-indigo-500/60 rounded-3xl p-6 shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col gap-5 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${p.highlightColor ?? "from-indigo-500/10"} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl`} />

      {/* Üst: Avatar + Ad + Rozet */}
      <div className="flex items-start gap-4 relative z-10">
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/30 overflow-hidden">
            {p.avatarUrl ? (
              <img src={p.avatarUrl} alt={p.displayName} className="w-full h-full object-cover rounded-[14px]"
                onError={(e) => { (e.target as HTMLElement).style.display = "none"; }} />
            ) : (
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-extrabold text-2xl text-white">
                {p.displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full" />
        </div>

        <div className="flex-1 overflow-hidden space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base text-white group-hover:text-indigo-200 transition truncate">{p.displayName}</h3>
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>
          {p.title && <p className="text-xs font-semibold text-indigo-400 truncate">{p.title}</p>}
          {p.location && (
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
              <span className="truncate">{p.location}</span>
            </div>
          )}
        </div>

        {p.featuredBadge && (
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r ${p.badgeColor ?? "from-indigo-500 to-purple-600"} shadow-md shrink-0`}>
            <Star className="w-3 h-3 text-white" />
            <span className="text-[10px] font-bold text-white hidden sm:inline">{p.featuredBadge}</span>
          </div>
        )}
      </div>

      {/* Bio */}
      {p.bio && <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 relative z-10">{p.bio}</p>}

      {/* Kategorı + Teknoloji */}
      <div className="flex flex-wrap gap-1.5 relative z-10">
        <CategoryBadge category={p.category} />
        {p.tags?.slice(0, 4).map((tag) => (
          <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-300">{tag}</span>
        ))}
      </div>

      {/* İstatistikler */}
      <div className="flex items-center gap-4 border-t border-slate-800/80 pt-4 relative z-10">
        <StatBubble icon={Code2}    value={p.projectCount ?? 4}  label="Proje"     color="text-indigo-400" />
        <StatBubble icon={BookOpen} value={p.devlogCount  ?? 8}  label="Devlog"    color="text-purple-400" />
        <StatBubble icon={Award}    value={p.certCount    ?? 2}  label="Sertifika" color="text-amber-400"  />
      </div>

      {/* CTA */}
      <Link
        to={`/p/${p.publicSlug}`}
        className="relative z-10 flex items-center justify-between w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-indigo-500/60 group-hover:bg-indigo-950/50 text-xs font-bold text-indigo-300 transition-all duration-300"
      >
        <span>Portföy & Problem-Çözüm Günlüklerini İncele</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
      </Link>
    </div>
  );
}

/* ─── Topluluk Kartı (kompakt) ─────────────────────────────── */
function CommunityCard({ p }: { p: ShowcaseProfile }) {
  return (
    <div className="group relative bg-slate-900/70 border border-slate-800/80 hover:border-purple-500/50 rounded-2xl p-5 shadow-lg hover:shadow-purple-500/10 transition-all duration-300 flex flex-col gap-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 group-hover:from-purple-500/5 via-transparent to-transparent transition-all duration-500 rounded-2xl pointer-events-none" />

      <div className="flex items-center gap-3 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-500 via-indigo-600 to-blue-500 p-0.5 shadow-md overflow-hidden shrink-0">
          {p.avatarUrl ? (
            <img src={p.avatarUrl} alt={p.displayName} className="w-full h-full object-cover rounded-[10px]"
              onError={(e) => { (e.target as HTMLElement).style.display = "none"; }} />
          ) : (
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-lg text-white">
              {p.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm text-white truncate group-hover:text-purple-200 transition">{p.displayName}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          </div>
          {p.title && <p className="text-[11px] font-medium text-purple-400 truncate">{p.title}</p>}
        </div>
        <CategoryBadge category={p.category} />
      </div>

      {p.bio && <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed relative z-10">{p.bio}</p>}

      <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 relative z-10">
        <div className="flex items-center gap-3">
          <StatBubble icon={Code2}    value={p.projectCount ?? 3} label="Proje"  color="text-indigo-400" />
          <StatBubble icon={BookOpen} value={p.devlogCount  ?? 6} label="Devlog" color="text-purple-400" />
        </div>
        <Link
          to={`/p/${p.publicSlug}`}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-semibold text-indigo-300 group-hover:border-purple-500/50 transition"
        >
          <span>Görüntüle</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

/* ─── Ana Sayfa Bileşeni ────────────────────────────────────── */
export default function ExploreDevelopersPage() {
  const { userProfile } = useAuth();
  const [realProfiles, setRealProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Hepsi");

  useEffect(() => {
    setLoading(true);
    profileApi.getAllPublic()
      .then((data) => setRealProfiles(data))
      .catch(() => setRealProfiles([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["Hepsi", "Full-Stack", "Frontend", "Backend", "Mobile", "DevOps"];

  /* Vitrin profilleri — kendi profilini gizle */
  const showcaseFiltered: ShowcaseProfile[] = FEATURED_SHOWCASE.filter(
    (s) => !userProfile || (s.publicSlug !== userProfile.publicSlug && s.id !== userProfile.id)
  );

  /* Gerçek topluluk üyeleri — kendi profilini ve vitrin profilleriyle çakışmayı gizle */
  const communityProfiles: ShowcaseProfile[] = realProfiles
    .filter(
      (p) =>
        (!userProfile || (p.id !== userProfile.id && p.publicSlug !== userProfile.publicSlug)) &&
        !FEATURED_SHOWCASE.some((s) => s.publicSlug === p.publicSlug)
    )
    .map((p) => ({ ...p, category: "Full-Stack" as Category }));

  const applyFilter = (list: ShowcaseProfile[]): ShowcaseProfile[] =>
    list.filter((p) => {
      const term = searchTerm.toLowerCase();
      const matchSearch =
        !term ||
        p.displayName.toLowerCase().includes(term) ||
        (p.title?.toLowerCase().includes(term) ?? false) ||
        (p.location?.toLowerCase().includes(term) ?? false) ||
        (p.bio?.toLowerCase().includes(term) ?? false) ||
        (p.tags?.some((t) => t.toLowerCase().includes(term)) ?? false);
      const matchCat = activeCategory === "Hepsi" || p.category === activeCategory;
      return matchSearch && matchCat;
    });

  const filteredShowcase  = applyFilter(showcaseFiltered);
  const filteredCommunity = applyFilter(communityProfiles);
  const totalCount = filteredShowcase.length + filteredCommunity.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* ── Hero Banner ── */}
        <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.25)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.18)_0%,transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative z-10 p-7 sm:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              {/* Sol: Başlık */}
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  <span>Örnek Portföy Galerisi & Topluluk Vitrini</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Öne Çıkan{" "}
                  <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Geliştiriciler
                  </span>
                </h1>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Developer Growth Log'da yer alan öne çıkan portföyleri, Problem→Çözüm günlüklerini ve kanıtlanabilir proje süreçlerini inceleyin.
                  İşe alım uzmanları için üye olmadan doğrudan erişilebilir.
                </p>

                <div className="flex items-center gap-6 pt-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse block" />
                    <span><strong className="text-white">{FEATURED_SHOWCASE.length}</strong> Vitrin Profili</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Globe className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Üye olmadan incelenebilir</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                    <span>Sürekli güncelleniyor</span>
                  </div>
                </div>
              </div>

              {/* Sağ: Arama */}
              <div className="w-full lg:w-80 shrink-0">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="showcase-search"
                    type="text"
                    placeholder="İsim, unvan, teknoloji veya şehir..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition shadow-inner"
                  />
                </div>
                {searchTerm && (
                  <p className="text-[11px] text-slate-400 mt-2 text-center">
                    <span className="text-indigo-300 font-bold">{totalCount}</span> sonuç bulundu
                  </p>
                )}
              </div>
            </div>

            {/* Kategori Filtresi */}
            <div className="flex items-center gap-2 mt-6 pt-5 border-t border-slate-800/60 overflow-x-auto pb-1">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-xs text-slate-400 font-medium mr-1 shrink-0">Uzmanlık:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  id={`filter-${cat.toLowerCase().replace(/\s/g, "-")}`}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shrink-0 border ${
                    activeCategory === cat
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 border-transparent text-white shadow-lg shadow-indigo-600/30"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── İçerik ── */}
        {loading ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-10 h-10 mx-auto border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-400 animate-pulse">Vitrin profilleri yükleniyor...</p>
          </div>
        ) : (
          <>
            {/* ── Bölüm 1: Vitrin Profilleri ── */}
            {filteredShowcase.length > 0 && (
              <section className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-bold text-white">Öne Çıkan Vitrin Profilleri</span>
                    <span className="ml-1 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                      {filteredShowcase.length}
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-indigo-500/30 to-transparent" />
                  <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>Örnek Portföy Standartları</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredShowcase.map((p) => (
                    <FeaturedCard key={p.id} p={p} />
                  ))}
                </div>
              </section>
            )}

            {/* ── Bölüm 2: Topluluk Üyeleri ── */}
            {filteredCommunity.length > 0 && (
              <section className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-bold text-white">Topluluk Üyeleri</span>
                    <span className="ml-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
                      {filteredCommunity.length}
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-purple-500/20 to-transparent" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCommunity.map((p) => (
                    <CommunityCard key={p.id} p={p} />
                  ))}
                </div>
              </section>
            )}

            {/* ── Hiç Sonuç Yok ── */}
            {totalCount === 0 && (
              <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-3xl p-16 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto">
                  <Search className="w-7 h-7 text-slate-500" />
                </div>
                <h3 className="text-lg font-bold text-white">Sonuç Bulunamadı</h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">
                  "<strong className="text-slate-200">{searchTerm || activeCategory}</strong>" için uygun profil bulunamadı.
                </p>
                <button
                  onClick={() => { setSearchTerm(""); setActiveCategory("Hepsi"); }}
                  className="mt-2 px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition cursor-pointer"
                >
                  Filtreleri Temizle
                </button>
              </div>
            )}

            {/* ── CTA Kayıt Daveti ── */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/20 p-7 sm:p-10 text-center space-y-4 shadow-xl">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.12)_0%,transparent_70%)] pointer-events-none" />
              <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Kendi Portföyünü Vitrine Taşı</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  Sen de Problem-Çözüm Günlüğünü Oluştur
                </h2>
                <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                  Projelerini ve devlog'larını kayıt altına al. Şirketlerle paylaşmak için üye olmadan görüntülenebilir kamu profil linki al.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Ücretsiz Başla</span>
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-semibold text-sm transition"
                  >
                    <span>Giriş Yap</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
