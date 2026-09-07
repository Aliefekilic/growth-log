import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogApi } from '../../api/blogApi';
import type { BlogPost } from '../../types/blog';

export default function PublicDevlogPage() {
  const { slug, postSlug } = useParams<{ slug: string; postSlug?: string }>();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;

    if (postSlug) {
      blogApi
        .getPublicPostBySlug(slug, postSlug)
        .then((data) => {
          setSelectedPost(data);
          setError('');
        })
        .catch(() => setError('Yazı bulunamadı.'))
        .finally(() => setLoading(false));
    } else {
      blogApi
        .getPublicPosts(slug)
        .then((data) => {
          setPosts(data);
          setError('');
        })
        .catch(() => setError('Yazılar bulunamadı.'))
        .finally(() => setLoading(false));
    }
  }, [slug, postSlug]);

  if (loading) {
    return <div className="min-h-screen bg-slate-950 text-slate-100 p-8">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <Link to={`/p/${slug}`} className="text-sm text-indigo-400 hover:underline flex items-center gap-1">
            ← Profili Görüntüle (@{slug})
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-red-950/50 border border-red-800/50 text-red-200 rounded-xl text-sm">
            {error}
          </div>
        )}

        {selectedPost ? (
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
            <div>
              <div className="text-xs text-indigo-400 font-medium mb-1">
                {selectedPost.publishedAt
                  ? new Date(selectedPost.publishedAt).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : ''}
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">{selectedPost.title}</h1>
            </div>

            <div className="border-t border-slate-800 pt-6 text-slate-200 whitespace-pre-line leading-relaxed font-sans text-sm space-y-4">
              {selectedPost.contentMarkdown}
            </div>
          </div>
        ) : (
          
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>✍️</span> Devlog & Teknik Yazılar
            </h1>

            {posts.length === 0 ? (
              <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-xl">
                Henüz yayınlanmış bir devlog yazısı bulunmuyor.
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-xl p-5 transition space-y-2"
                  >
                    <div className="text-xs text-slate-500">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString('tr-TR')
                        : ''}
                    </div>
                    <h2 className="text-xl font-bold text-white hover:text-indigo-300 transition">
                      <Link to={`/p/${slug}/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="text-sm text-slate-400 line-clamp-2">
                      {post.contentMarkdown.substring(0, 200)}...
                    </p>
                    <Link
                      to={`/p/${slug}/blog/${post.slug}`}
                      className="inline-block text-xs font-medium text-indigo-400 hover:underline pt-2"
                    >
                      Devamını Oku →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
