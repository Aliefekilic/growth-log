import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FolderKanban,
  Award,
  BarChart3,
  BookOpen,
  GitBranch,
  User,
  LogOut,
  Sparkles,
  ExternalLink,
  LogIn,
  UserPlus,
  Compass,
  // Users, // TODO: yeterli kullanıcı sayısına ulaşınca tekrar aktif et
} from 'lucide-react';

export function Navbar() {
  const { isAuthenticated, userProfile: profile, logout } = useAuth();
  const location = useLocation();


  const authNavItems = [
    { label: 'Ana Panel', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Projeler', path: '/projects', icon: FolderKanban },
    { label: 'Analitik', path: '/analytics', icon: BarChart3 },
    // { label: 'Geliştiriciler', path: '/explore', icon: Users }, // TODO: yeterli kullanıcı sayısına ulaşınca tekrar aktif et
    { label: 'Sertifikalar', path: '/certificates', icon: Award },
    { label: 'Devlog', path: '/devlog', icon: BookOpen },
    { label: 'GitHub', path: '/github', icon: GitBranch },
  ];

  const publicNavItems = [
    { label: 'Ana Sayfa', path: '/', icon: Compass },
    // { label: 'Geliştiricileri Keşfet', path: '/explore', icon: Users }, // TODO: yeterli kullanıcı sayısına ulaşınca tekrar aktif et
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
                Growth Log
              </span>
              <span className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase -mt-0.5">
                Developer Engine
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/60">
            {(isAuthenticated ? authNavItems : publicNavItems).map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                (item.path !== '/' && item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User & Auth Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {profile && profile.publicSlug && (
                  <Link
                    to={`/p/${profile.publicSlug}`}
                    target="_blank"
                    className="hidden sm:flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-800/40 px-3 py-1.5 rounded-lg transition"
                    title="Kamuya açık geliştirici profilini gör"
                  >
                    <span>Kamu Profili</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}

                <Link
                  to="/profile"
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    location.pathname === '/profile'
                      ? 'bg-indigo-950/60 border-indigo-500/60 text-white shadow-md shadow-indigo-500/20'
                      : 'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-800'
                  }`}
                  title="Profil Yönetimi"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20 shrink-0 overflow-hidden">
                    {profile?.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover rounded-[6px]"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center font-bold text-xs text-white">
                        {profile?.displayName ? profile.displayName.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                      </div>
                    )}
                  </div>
                  <span className="font-bold text-slate-100">{profile?.displayName || 'Profilim'}</span>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-900/50 hover:bg-red-950/20 transition cursor-pointer"
                  title="Çıkış yap"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
                >
                  <LogIn className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Giriş Yap</span>
                </Link>

                <Link
                  to="/register"
                  className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 transition duration-200"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Ücretsiz Kayıt Ol</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="md:hidden flex items-center justify-around py-2 px-2 bg-slate-900/90 border-t border-slate-800/60 overflow-x-auto">
        {(isAuthenticated ? authNavItems : publicNavItems).map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/' && item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-medium transition ${
                isActive ? 'text-indigo-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
