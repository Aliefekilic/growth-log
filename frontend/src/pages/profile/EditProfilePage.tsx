import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { profileApi } from '../../api/profileApi';
import { useAuth } from '../../context/AuthContext';
import type { Profile, UpdateProfileRequest } from '../../types/profile';
import {
  User,
  MapPin,
  AlignLeft,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
  Image as ImageIcon,
} from 'lucide-react';

export default function EditProfilePage() {
  const { userProfile, refreshProfile } = useAuth();
  const { register, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm<UpdateProfileRequest>();
  const [profile, setProfile] = useState<Profile | null>(userProfile);
  const [loading, setLoading] = useState(!userProfile);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const avatarUrlInput = watch('avatarUrl');

  useEffect(() => {
    if (userProfile) {
      setProfile(userProfile);
      reset(userProfile);
      setLoading(false);
    }
    profileApi
      .getMine()
      .then((data) => {
        setProfile(data);
        reset(data);
      })
      .catch(() => {
        if (!userProfile) setError('Profil bilgileri yüklenemedi.');
      })
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data: UpdateProfileRequest) => {
    setSaved(false);
    setError(null);
    try {
      const updated = await profileApi.updateMine(data);
      setProfile(updated);
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch {
      setError('Profil güncellenirken bir hata oluştu.');
    }
  };

  const handleCopyPublicUrl = () => {
    if (!profile?.publicSlug) return;
    const fullUrl = `${window.location.origin}/p/${profile.publicSlug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <div className="max-w-4xl mx-auto p-8 text-center text-slate-500 animate-pulse">
          Profil yükleniyor...
        </div>
      </div>
    );
  }

  const publicUrl = profile?.publicSlug ? `${window.location.origin}/p/${profile.publicSlug}` : '';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <User className="w-6 h-6 text-indigo-400" />
              <span>Profil Yönetimi</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Geliştirici kimliğinizi ve profil fotoğrafınızı güncelleyin, şirketlerle paylaşacağınız portföy linkinizi alın.
            </p>
          </div>

          {profile && profile.publicSlug && (
            <Link
              to={`/p/${profile.publicSlug}`}
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-950/50 border border-indigo-800/50 text-indigo-300 hover:text-white hover:bg-indigo-900/50 text-xs font-semibold transition shrink-0"
            >
              <span>Portföy Önizleme</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Shareable Link Banner for Companies/Employers */}
        {profile && profile.publicSlug && (
          <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/60 border border-indigo-500/30 rounded-3xl p-6 shadow-xl space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 text-[11px] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Şirketler & İşe Alım Uzmanları İçin Paylaşım Bağlantısı</span>
                </div>
                <h2 className="text-base font-bold text-white">Herkese Açık Portföy Linkiniz</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Bu bağlantıyı CV'nize ekleyebilir veya şirketlere gönderebilirsiniz. Şirket yetkilileri bu adrese girdiklerinde <strong>üye olmadan doğrudan</strong> tüm projelerinizi ve başarım kartlarınızı inceleyebilirler.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <div className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-mono text-indigo-300 truncate">
                {publicUrl}
              </div>

              <button
                type="button"
                onClick={handleCopyPublicUrl}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition cursor-pointer shrink-0 shadow-lg shadow-indigo-600/20"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Bağlantıyı Kopyala</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar & Main Info Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-slate-800/60">
              {/* Profile Avatar Image / Initials */}
              <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-xl shadow-indigo-500/20 shrink-0 overflow-hidden">
                {avatarUrlInput ? (
                  <img
                    src={avatarUrlInput}
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-[22px]"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center font-extrabold text-3xl text-white">
                    {profile?.displayName ? profile.displayName.charAt(0).toUpperCase() : 'D'}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-lg text-white">{profile?.displayName || 'Geliştirici'}</h3>
                <p className="text-xs text-indigo-400 font-mono">
                  /p/{profile?.publicSlug}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Profil Görünürlüğü: {profile?.isPublic ? 'Herkese Açık' : 'Gizli'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField label="Görünen Ad *" icon={User}>
                <input
                  className="input"
                  placeholder="ör. Ali Efe"
                  {...register('displayName', { required: true })}
                />
              </FormField>

              <FormField label="Unvan / Rol" icon={Sparkles}>
                <input
                  className="input"
                  placeholder="ör. Senior Full-Stack Developer"
                  {...register('title')}
                />
              </FormField>
            </div>

            <FormField label="Profil Fotoğrafı URL'si (Avatar Image Link)" icon={ImageIcon}>
              <input
                className="input font-mono text-xs"
                placeholder="https://images.unsplash.com/... veya profil fotoğrafı direkt linki"
                {...register('avatarUrl')}
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Herhangi bir resim direkt bağlantısını (Unsplash, Imgur, GitHub avatar vb.) yapıştırabilirsiniz.
              </p>
            </FormField>

            <FormField label="Hakkımda (Biyografi)" icon={AlignLeft}>
              <textarea
                className="input min-h-[100px] resize-y"
                placeholder="Yazılım tutkunu, deneyimlerin ve ilgi alanların hakkında kısa bir özgeçmiş..."
                {...register('bio')}
              />
            </FormField>
          </div>

          {/* Location Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span>Konum Bilgisi</span>
            </h2>

            <FormField label="Konum" icon={MapPin}>
              <input
                className="input"
                placeholder="ör. İstanbul, Türkiye"
                {...register('location')}
              />
            </FormField>
          </div>

          {/* Visibility Setting */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-white block">Kamuya Açık Profil</span>
              <span className="text-xs text-slate-400 block">
                Etkinleştirildiğinde şirketler ve diğer geliştiriciler profilinizi görebilir.
              </span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" {...register('isPublic')} />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="flex items-center gap-2 p-4 rounded-2xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {saved && (
            <div className="flex items-center gap-2 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Profil değişiklikleri ve profil fotoğrafı başarıyla kaydedildi.</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

function FormField({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-xs font-semibold text-slate-300">
        <Icon className="w-3.5 h-3.5 text-indigo-400" />
        <span>{label}</span>
      </label>
      {children}
    </div>
  );
}
