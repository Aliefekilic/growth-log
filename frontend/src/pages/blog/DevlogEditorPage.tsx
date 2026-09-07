import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { blogApi } from '../../api/blogApi';

export default function DevlogEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [contentMarkdown, setContentMarkdown] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  useEffect(() => {
    if (id) {
      blogApi
        .getById(id)
        .then((post) => {
          setTitle(post.title);
          setContentMarkdown(post.contentMarkdown);
          setIsPublished(post.isPublished);
        })
        .catch(() => setError('Yazı bulunamadı.'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !contentMarkdown.trim()) {
      alert('Başlık ve içerik alanları zorunludur.');
      return;
    }

    setSaving(true);
    try {
      if (isEditing && id) {
        await blogApi.update(id, { title, contentMarkdown, isPublished });
      } else {
        await blogApi.create({ title, contentMarkdown, isPublished });
      }
      navigate('/devlog');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 text-slate-100 p-8">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center space-x-2 text-sm text-slate-400 mb-1">
              <Link to="/devlog" className="hover:text-indigo-400 transition">Devlog</Link>
              <span>/</span>
              <span className="text-slate-200">{isEditing ? 'Yazıyı Düzenle' : 'Yeni Yazı'}</span>
            </div>
            <h1 className="text-2xl font-bold text-white">
              {isEditing ? 'Yazıyı Düzenle' : 'Yeni Teknik Yazı Oluştur'}
            </h1>
          </div>

          <button
            onClick={() => navigate('/devlog')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition"
          >
            Vazgeç
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-950/50 border border-red-800/50 text-red-200 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Yazı Başlığı *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn. Neden EF Core Seçtik ve Clean Architecture Mimarisi"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-lg text-white font-medium focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          
          <div className="border border-slate-800 rounded-2xl bg-slate-900/60 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2 bg-slate-900">
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                    activeTab === 'write'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  ✏️ Düzenleyici (Markdown)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                    activeTab === 'preview'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  👁️ Önizleme
                </button>
              </div>

              <span className="text-xs text-slate-500">Markdown Formatı Desteklenmektedir</span>
            </div>

            {activeTab === 'write' ? (
              <textarea
                required
                rows={16}
                value={contentMarkdown}
                onChange={(e) => setContentMarkdown(e.target.value)}
                placeholder="# Giriş&#10;&#10;Bu yazıda projemizde karşılaştığımız mimari kararları ele alıyoruz...&#10;&#10;## Neden EF Core?&#10;- Tip güvenliği&#10;- Migration desteği"
                className="w-full bg-slate-950 p-4 text-slate-200 font-mono text-sm focus:outline-none resize-y min-h-[350px]"
              />
            ) : (
              <div className="p-6 bg-slate-950 min-h-[350px] text-slate-200 prose prose-invert max-w-none">
                {contentMarkdown ? (
                  <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed space-y-3">
                    {contentMarkdown}
                  </div>
                ) : (
                  <p className="text-slate-600 italic">Önizlenecek içerik bulunmuyor.</p>
                )}
              </div>
            )}
          </div>

          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-950 border-slate-700"
              />
              <div>
                <span className="text-sm font-medium text-white">Yayınla (Herkese Açık Yap)</span>
                <p className="text-xs text-slate-400">
                  İşaretlerseniz herkese açık profilinizde görüntülenecektir.
                </p>
              </div>
            </label>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => navigate('/devlog')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition shadow-lg shadow-indigo-600/30 disabled:opacity-50"
              >
                {saving ? 'Kaydediliyor...' : isEditing ? 'Güncelle' : 'Kaydet'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
