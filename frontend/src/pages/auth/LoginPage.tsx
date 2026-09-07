import { useForm } from 'react-hook-form';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { LoginRequest } from '../../types/auth';
import { LogIn, Lock, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginRequest>();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);

  const needAuth = location.state?.needAuth;

  const onSubmit = async (data: LoginRequest) => {
    setServerError(null);
    try {
      await login(data);
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination);
    } catch (err: any) {
      if (!err.response) {
        setServerError('Sunucuya bağlanılamadı. Lütfen backend servisinin (http://localhost:5000) çalıştığından emin olun.');
      } else {
        const msg = err.response?.data?.message || 'E-posta veya şifre hatalı.';
        setServerError(msg);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-4 selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-md space-y-4">
        {needAuth && (
          <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-200 text-xs flex items-start gap-3 shadow-lg">
            <Lock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-white mb-0.5">Kullanıcı Girişi Gerekli</span>
              Proje eklemek, güncellemek veya profil alanınızı yönetmek için lütfen giriş yapın veya kayıt olun.
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-slate-900/90 p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight pt-2">Giriş Yap</h1>
            <p className="text-xs text-slate-400">Developer Growth Log hesabınıza erişin</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">E-posta Adresi</label>
              <input
                type="email"
                placeholder="ornek@geliştirici.dev"
                className="input"
                {...register('email', { required: 'E-posta gerekli' })}
              />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Şifre</label>
              <input
                type="password"
                placeholder="••••••••"
                className="input"
                {...register('password', { required: 'Şifre gerekli' })}
              />
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
            </div>
          </div>

          {serverError && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 py-3 font-semibold text-sm shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>{isSubmitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}</span>
          </button>

          <p className="text-xs text-slate-400 text-center pt-2 border-t border-slate-800">
            Hesabın yok mu?{' '}
            <Link to="/register" className="text-indigo-400 font-semibold hover:underline">
              Ücretsiz Kayıt Ol
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
