import { useEffect, useState } from 'react';
import { blogApi } from '../../api/blogApi';
import type { BlogPost } from '../../types/blog';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function DevlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await blogApi.getMyPosts();
      setPosts(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Yazılar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu yazıyı silmek istediğinize emin misiniz?')) return;
    try {
      await blogApi.delete(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert('Yazı silinemedi.');
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      const updated = await blogApi.update(post.id, {
        title: post.title,
        contentMarkdown: post.contentMarkdown,
        isPublished: !post.isPublished,
      });
      setPosts((prev) => prev.map((p) => (p.id === post.id ? updated : p)));
    } catch {
      alert('Yayın durumu değiştirilemedi.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-indigo-400" />
              <span>Teknik Günlük & Devlog Yazıları</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Mimari kararlarınızı, karşılaştığınız zorlukları ve teknik deneyimlerinizi yazıya dönüştürün.
            </p>
          </div>

          <Link
            to="/devlog/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition duration-200 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Yazı Oluştur</span>
          </Link>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-slate-500 text-sm animate-pulse">
            Yazılar yükleniyor...
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-indigo-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Henüz yazı yazmadınız</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Teknik kararlarınızı ve öğrendiklerinizi devlog olarak ekleyip CV'nize güç katın.
            </p>
            <Link
              to="/devlog/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>İlk Yazıyı Yaz</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="group bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 rounded-3xl p-6 shadow-xl transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full border ${
                        post.isPublished
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50'
                          : 'bg-amber-950/60 text-amber-400 border-amber-800/50'
                      }`}
                    >
                      {post.isPublished ? '● Yayında' : '○ Taslak'}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">/{post.slug}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition">
                    <Link to={`/devlog/${post.id}/edit`}>{post.title}</Link>
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {post.contentMarkdown.substring(0, 160)}...
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => handleTogglePublish(post)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                      post.isPublished
                        ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                        : 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/40'
                    }`}
                  >
                    {post.isPublished ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Taslağa Çek</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Yayınla</span>
                      </>
                    )}
                  </button>

                  <Link
                    to={`/devlog/${post.id}/edit`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Düzenle</span>
                  </Link>

                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition cursor-pointer"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
