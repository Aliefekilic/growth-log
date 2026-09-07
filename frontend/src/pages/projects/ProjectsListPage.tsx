import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { projectApi } from '../../api/projectApi';
import type { Project } from '../../types/project';
import { PROJECT_STATUS_LABELS } from '../../types/project';
import { FolderKanban, Plus, ExternalLink, Trash2, Edit3, GitBranch, Globe } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  Planning: 'bg-slate-800 text-slate-300 border border-slate-700',
  InProgress: 'bg-amber-950/60 text-amber-300 border border-amber-800/50',
  Completed: 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50',
  OnHold: 'bg-slate-800 text-slate-400 border border-slate-700',
  Archived: 'bg-slate-900 text-slate-500 border border-slate-800',
};

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const load = () => {
    projectApi.getMine().then(setProjects).catch(() => setError('Projeler yüklenemedi.'));
  };

  useEffect(load, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu projeyi silmek istediğinize emin misiniz?')) return;
    await projectApi.remove(id);
    load();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <FolderKanban className="w-6 h-6 text-indigo-400" />
              <span>Projelerim</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Problem → Çözüm günlüğü tuttuğunuz tüm projelerinizi buradan yönetebilirsiniz.
            </p>
          </div>

          <button
            onClick={() => navigate('/projects/new')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition duration-200 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Proje Ekle</span>
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs">
            {error}
          </div>
        )}

        {projects === null && !error && (
          <div className="py-12 text-center text-slate-500 text-sm animate-pulse">Projeler yükleniyor...</div>
        )}

        {projects?.length === 0 && (
          <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <FolderKanban className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Henüz proje eklemedin</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              İlk projeni ekleyerek karşılaştığın teknik problemleri ve çözümleri kayıt altına almaya başla.
            </p>
            <button
              onClick={() => navigate('/projects/new')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>İlk Projeni Ekle</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects?.map((p) => (
            <div
              key={p.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between transition-all duration-200"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-white">{p.title}</h2>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.summary}</p>
                  </div>
                  <span
                    className={`shrink-0 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${STATUS_COLORS[p.status]}`}
                  >
                    {PROJECT_STATUS_LABELS[p.status]}
                  </span>
                </div>

                {p.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
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
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs font-semibold">
                <div className="flex items-center gap-3">
                  <Link
                    to={`/projects/${p.id}/edit`}
                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Düzenle</span>
                  </Link>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="flex items-center gap-1 text-red-400 hover:text-red-300 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Sil</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {p.repoUrl && (
                    <a
                      href={p.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-slate-400 hover:text-white transition"
                    >
                      <GitBranch className="w-3.5 h-3.5" />
                      <span>Repo</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  )}
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Canlı</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
