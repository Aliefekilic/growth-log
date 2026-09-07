import { useEffect, useState } from 'react';
import { githubApi } from '../../api/githubApi';
import type { GithubAccount } from '../../types/github';
import { Navbar } from '../../components/Navbar';
import {
  GitBranch,
  RefreshCw,
  Unlink,
  Star,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Clock,
  Code2,
} from 'lucide-react';

export default function GithubPage() {
  const [account, setAccount] = useState<GithubAccount | null>(null);
  const [checked, setChecked] = useState(false);
  const [username, setUsername] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    githubApi
      .getMine()
      .then(setAccount)
      .catch(() => setAccount(null))
      .finally(() => setChecked(true));
  };

  useEffect(load, []);

  const handleConnect = async () => {
    setError(null);
    setBusy(true);
    try {
      const acc = await githubApi.connect(username.trim());
      setAccount(acc);
      setUsername('');
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Bağlanamadı. Kullanıcı adını kontrol ediniz.');
    } finally {
      setBusy(false);
    }
  };

  const handleSync = async () => {
    setError(null);
    setBusy(true);
    try {
      setAccount(await githubApi.sync());
    } catch {
      setError('Senkronizasyon başarısız oldu.');
    } finally {
      setBusy(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm('GitHub bağlantısını kaldırmak istediğinizden emin misiniz?')) return;
    await githubApi.disconnect();
    setAccount(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        <div className="pb-6 border-b border-slate-800/80 space-y-1">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <GitBranch className="w-6 h-6 text-indigo-400" />
            <span>GitHub Senkronizasyonu</span>
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
            GitHub kullanıcı adınızı bağladığınızda, açık kaynak public repolarınız (isim, ana dil, yıldız sayısı, son güncelleme) salt-okunur olarak çekilir. Özel repolarınıza asla erişilmez.
          </p>
        </div>

        {!checked && (
          <div className="py-12 text-center text-slate-500 text-sm animate-pulse">
            GitHub bağlantı durumu kontrol ediliyor...
          </div>
        )}

        
        {checked && !account && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 bg-indigo-950/50 border border-indigo-800/50 px-3 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Salt Okunur Public API Bağlantısı</span>
              </div>
              <h2 className="text-lg font-bold text-white">GitHub Hesabını Bağla</h2>
              <p className="text-xs text-slate-400">
                GitHub kullanıcı adınızı yazarak halka açık repolarınızı otomatik olarak profilinize ve kamu portföyünüze aktarabilirsiniz.
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                💡 <strong className="text-slate-200">Güvenlik Notu:</strong> Güvenliğiniz gereği GitHub şifreniz asla istenmez ve saklanmaz. GitHub REST API standartları gereği kullanıcı adınız yeterlidir. Repolarınız senkronize edildikten sonra kamu profilinizde (<code className="text-indigo-300 font-mono">/p/kullanici-adi</code>) <strong className="text-indigo-400">"GitHub Projeleri"</strong> bölümünde otomatik gösterilir.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                className="input flex-1"
                placeholder="ör. octocat"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button
                onClick={handleConnect}
                disabled={busy || !username.trim()}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition cursor-pointer shrink-0"
              >
                {busy ? 'Bağlanıyor...' : 'Bağla & Senkronize Et'}
              </button>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        
        {account && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-white">@{account.githubUsername}</span>
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                    ● Bağlı
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    {account.lastSyncedAt
                      ? `Son senkronizasyon: ${new Date(account.lastSyncedAt).toLocaleString('tr-TR')}`
                      : 'Henüz senkronize edilmedi'}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSync}
                  disabled={busy}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 disabled:opacity-50 transition cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${busy ? 'animate-spin' : ''}`} />
                  <span>{busy ? 'Yenileniyor...' : 'Yeniden Senkronize Et'}</span>
                </button>

                <button
                  onClick={handleDisconnect}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-xl transition cursor-pointer"
                >
                  <Unlink className="w-3.5 h-3.5" />
                  <span>Bağlantıyı Kaldır</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  <span>Çekilen Public Repolar ({account.repositories.length})</span>
                </h2>
              </div>

              {account.repositories.length === 0 ? (
                <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-400">
                  Public repo bulunamadı (fork/arşivlenmiş olanlar hariç tutulmaktadır).
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {account.repositories.map((r) => (
                    <a
                      key={r.htmlUrl}
                      href={r.htmlUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 transition-all duration-200 space-y-2 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-200 group-hover:text-indigo-300 transition">
                          {r.name}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-mono">
                          <Star className="w-3.5 h-3.5 fill-amber-400/20" />
                          {r.starCount}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-900">
                        {r.primaryLanguage ? (
                          <span className="font-mono text-indigo-300 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-800/40">
                            {r.primaryLanguage}
                          </span>
                        ) : (
                          <span />
                        )}
                        <div className="flex items-center gap-1 font-mono">
                          <span>{new Date(r.repoUpdatedAt).toLocaleDateString('tr-TR')}</span>
                          <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition" />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
