import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { projectApi } from '../../api/projectApi';
import { TechTagInput } from '../../components/TechTagInput';
import type { ProjectFormValues, ProjectStatus } from '../../types/project';
import { PROJECT_STATUS_LABELS } from '../../types/project';

const EMPTY_VALUES: ProjectFormValues = {
  title: '',
  summary: '',
  repoUrl: '',
  liveUrl: '',
  status: 'Planning',
  problemStatement: '',
  approachesTried: '',
  finalSolution: '',
  lessonsLearned: '',
  startedAt: new Date().toISOString().slice(0, 10),
  completedAt: '',
  technologyNames: [],
};

export default function ProjectFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { register, handleSubmit, reset, watch, setValue, formState: { isSubmitting } } =
    useForm<ProjectFormValues>({ defaultValues: EMPTY_VALUES });

  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);
  const technologyNames = watch('technologyNames');

  useEffect(() => {
    if (!id) return;
    projectApi
      .getById(id)
      .then((p) =>
        reset({
          title: p.title,
          summary: p.summary,
          repoUrl: p.repoUrl ?? '',
          liveUrl: p.liveUrl ?? '',
          status: p.status,
          problemStatement: p.problemStatement,
          approachesTried: p.approachesTried ?? '',
          finalSolution: p.finalSolution,
          lessonsLearned: p.lessonsLearned ?? '',
          startedAt: p.startedAt.slice(0, 10),
          completedAt: p.completedAt ? p.completedAt.slice(0, 10) : '',
          technologyNames: p.technologies,
        })
      )
      .catch(() => setError('Proje yüklenemedi.'))
      .finally(() => setLoading(false));
  }, [id, reset]);

  const onSubmit = async (values: ProjectFormValues) => {
    setError(null);
    try {
      if (isEdit && id) {
        await projectApi.update(id, values);
      } else {
        await projectApi.create(values);
      }
      navigate('/projects');
    } catch {
      setError('Kaydedilemedi. Zorunlu alanları kontrol et.');
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 text-slate-100 p-8">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{isEdit ? 'Projeyi Düzenle' : 'Yeni Proje'}</h1>
          <Link to="/projects" className="text-sm text-slate-400 hover:text-slate-100">← Projelere dön</Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-slate-900 p-6 rounded-xl border border-slate-800">
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Genel Bilgiler</h2>
            <Field label="Başlık">
              <input className="input" {...register('title', { required: true })} />
            </Field>
            <Field label="Kısa Özet">
              <textarea className="input min-h-20" {...register('summary', { required: true })} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Başlangıç Tarihi">
                <input type="date" className="input" {...register('startedAt', { required: true })} />
              </Field>
              <Field label="Bitiş Tarihi (opsiyonel)">
                <input type="date" className="input" {...register('completedAt')} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Repo URL">
                <input className="input" placeholder="https://github.com/..." {...register('repoUrl')} />
              </Field>
              <Field label="Canlı Link">
                <input className="input" placeholder="https://..." {...register('liveUrl')} />
              </Field>
            </div>
            <Field label="Durum">
              <select className="input" {...register('status')}>
                {(Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[]).map((s) => (
                  <option key={s} value={s}>{PROJECT_STATUS_LABELS[s]}</option>
                ))}
              </select>
            </Field>
            <Field label="Teknolojiler">
              <TechTagInput
                value={technologyNames}
                onChange={(next) => setValue('technologyNames', next)}
              />
            </Field>
          </section>

          <section className="space-y-4 pt-4 border-t border-slate-800">
            <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-wide">
              Problem → Çözüm Günlüğü
            </h2>
            <p className="text-xs text-slate-500 -mt-2">
              Bu proje bir portfolyo satırından farklı kılan tek bölüm burası — GitHub repo
              listesinde asla görünmeyecek bilgi.
            </p>
            <Field label="Karşılaşılan problem">
              <textarea className="input min-h-20" {...register('problemStatement', { required: true })} />
            </Field>
            <Field label="Denenen yaklaşımlar (varsa başarısız olanlar dahil)">
              <textarea className="input min-h-20" {...register('approachesTried')} />
            </Field>
            <Field label="Nihai çözüm ve neden bu seçildi">
              <textarea className="input min-h-20" {...register('finalSolution', { required: true })} />
            </Field>
            <Field label="Bu süreçte öğrenilen/pekişen teknoloji">
              <textarea className="input min-h-20" {...register('lessonsLearned')} />
            </Field>
          </section>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-indigo-600 px-4 py-2 font-medium hover:bg-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Kaydediliyor...' : isEdit ? 'Güncelle' : 'Projeyi Kaydet'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm text-slate-400 mb-1">{label}</label>
      {children}
    </div>
  );
}
