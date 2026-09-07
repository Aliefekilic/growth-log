import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Plus,
  Code2,
  Clock,
  ShieldCheck,
  ArrowRight,
  UserPlus,
  LogIn,
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-950/80 via-slate-900 to-purple-950/60 border border-indigo-500/20 p-8 sm:p-14 text-center shadow-2xl space-y-8">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Developer Growth Log Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
            Yazılım Yolculuğunu{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Kanıtlanabilir Verilere
            </span>{' '}
            Dönüştür
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Projelerini ekle, karşılaştığın teknik problemleri ve çözümleri kayıt altına al. Otomatik oluşturulan teknolojik zaman çizelgen ve kanıtlanabilir başarım profilinle öne çık.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition duration-200"
              >
                <span>Ana Panele Git</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition duration-200"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Ücretsiz Kayıt Ol & Proje Ekle</span>
                </Link>

                <Link
                  to="/login"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 hover:border-indigo-500 text-slate-200 hover:text-white font-semibold text-sm transition duration-200"
                >
                  <LogIn className="w-4 h-4 text-indigo-400" />
                  <span>Giriş Yap</span>
                </Link>
              </>
            )}
          </div>
        </section>

        
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Nasıl Çalışır?</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Geliştirici gelişim günlüğü 3 temel sütun üzerinde inşa edilmiştir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              title="1. Problem → Çözüm Günlüğü"
              description="Her projeniz için karşılaştığınız spesifik teknik zorlukları, denediğiniz yaklaşımları ve nihai çözümü kaydedin."
              icon={Code2}
              badge="Proje Takibi"
            />
            <FeatureCard
              title="2. Otomatik Teknoloji Timeline'ı"
              description="Eklediğiniz teknolojiler ve tarihler temel alınarak ne zaman, hangi teknolojiyi nerede öğrendiğinizin kronolojik ağacı oluşur."
              icon={Clock}
              badge="Analitik & Kanıt"
            />
            <FeatureCard
              title="3. Kamusal Doğrulanabilir Profil"
              description="Sertifikalarınız, GitHub repolarınız ve projelerinizle zenginleştirilmiş /p/slug profilinizi işverenlerle paylaşın."
              icon={ShieldCheck}
              badge="Portföy & Sertifika"
            />
          </div>
        </section>

        
        {!isAuthenticated && (
          <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-950/40 border border-amber-800/40 px-3 py-1 rounded-full">
                🔒 Üyelik Gereksinimi
              </div>
              <h3 className="text-xl font-bold text-white">Kendi Projelerini Yüklemek İster misin?</h3>
              <p className="text-xs text-slate-400 max-w-xl">
                Sitede serbestçe gezinebilir, geliştirici profillerini inceleyebilirsiniz. Ancak kendi projelerinizi eklemek, sertifikalarınızı doğrulatmak ve analitik çizelgenizi oluşturmak için saniyeler içinde kayıt olabilirsiniz.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/register"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Kayıt Ol & Proje Ekle</span>
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon: Icon,
  badge,
}: {
  title: string;
  description: string;
  icon: any;
  badge: string;
}) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 rounded-3xl p-6 shadow-xl space-y-4 transition duration-200 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="p-3 rounded-2xl bg-indigo-950/60 border border-indigo-800/40 text-indigo-400">
            <Icon className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-semibold font-mono px-2.5 py-1 rounded-full bg-slate-950 text-slate-400 border border-slate-800">
            {badge}
          </span>
        </div>

        <h3 className="text-base font-bold text-white">{title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
