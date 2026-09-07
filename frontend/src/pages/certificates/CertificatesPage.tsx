import React, { useEffect, useState } from 'react';
import { certificateApi } from '../../api/certificateApi';
import type { Certificate, CreateCertificateInput } from '../../types/certificate';
import { Navbar } from '../../components/Navbar';
import {
  Award,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Building,
  Key,
  X,
  Save,
} from 'lucide-react';

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateCertificateInput>({
    title: '',
    issuedBy: '',
    issuedAt: new Date().toISOString().substring(0, 10),
    credentialUrl: '',
    credentialId: '',
  });

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const data = await certificateApi.getMyCertificates();
      setCertificates(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Sertifikalar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      issuedBy: '',
      issuedAt: new Date().toISOString().substring(0, 10),
      credentialUrl: '',
      credentialId: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cert: Certificate) => {
    setEditingId(cert.id);
    setFormData({
      title: cert.title,
      issuedBy: cert.issuedBy,
      issuedAt: cert.issuedAt ? cert.issuedAt.substring(0, 10) : '',
      credentialUrl: cert.credentialUrl || '',
      credentialId: cert.credentialId || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu sertifikayı silmek istediğinize emin misiniz?')) return;
    try {
      await certificateApi.delete(id);
      setCertificates((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert('Sertifika silinirken bir hata oluştu.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updated = await certificateApi.update(editingId, formData);
        setCertificates((prev) => prev.map((c) => (c.id === editingId ? updated : c)));
      } else {
        const created = await certificateApi.create(formData);
        setCertificates((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'İşlem gerçekleştirilemedi.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <Award className="w-6 h-6 text-emerald-400" />
              <span>Sertifikalar & Doğrulamalar</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Yetkinliklerinizi ve doğrulanabilir başarım kanıtlarınızı herkese açık profilinizde sergileyin.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition duration-200 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Sertifika Ekle</span>
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Content Grid */}
        {loading ? (
          <div className="py-16 text-center text-slate-500 text-sm animate-pulse">
            Sertifikalar yükleniyor...
          </div>
        ) : certificates.length === 0 ? (
          <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-emerald-400">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Henüz sertifika eklenmedi</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Sertifikalarınızı ekleyerek kamu profilinizde işverenlere doğrulanabilir başarım kanıtı sergileyebilirsiniz.
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>İlk Sertifikayı Ekle</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="group relative bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 rounded-3xl p-6 shadow-xl transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition">
                          {cert.title}
                        </h3>
                        <p className="text-xs font-semibold text-indigo-400 mt-0.5">{cert.issuedBy}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(cert)}
                        className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
                        title="Düzenle"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cert.id)}
                        className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-slate-800 transition cursor-pointer"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{new Date(cert.issuedAt).toLocaleDateString('tr-TR')}</span>
                    </div>

                    {cert.credentialId && (
                      <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300">
                        <Key className="w-3 h-3 text-slate-500" />
                        <span>{cert.credentialId}</span>
                      </div>
                    )}
                  </div>
                </div>

                {cert.credentialUrl && (
                  <div className="pt-2">
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold bg-emerald-950/40 border border-emerald-800/40 px-3.5 py-2 rounded-xl transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Doğrulama Bağlantısı (Credential)</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add / Edit Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <span>{editingId ? 'Sertifikayı Düzenle' : 'Yeni Sertifika Ekle'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Sertifika / Başarım Adı *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="ör. AWS Certified Solutions Architect"
                  className="input"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Veren Kurum / Organizasyon *</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.issuedBy}
                  onChange={(e) => setFormData({ ...formData, issuedBy: e.target.value })}
                  placeholder="ör. Amazon Web Services, Coursera, HackerRank"
                  className="input"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Veriliş Tarihi *</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.issuedAt}
                  onChange={(e) => setFormData({ ...formData, issuedAt: e.target.value })}
                  className="input"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Doğrulama URL'si (Credential Link)</span>
                </label>
                <input
                  type="url"
                  value={formData.credentialUrl}
                  onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                  placeholder="https://coursera.org/verify/..."
                  className="input"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Sertifika Kimliği (Credential ID)</span>
                </label>
                <input
                  type="text"
                  value={formData.credentialId}
                  onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                  placeholder="ör. ABC-123456"
                  className="input"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingId ? 'Güncelle' : 'Kaydet'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
