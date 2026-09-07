import { useEffect, useState } from 'react';
import { technologyApi } from '../api/projectApi';

interface Props {
  value: string[];
  onChange: (next: string[]) => void;
}




export function TechTagInput({ value, onChange }: Props) {
  const [input, setInput] = useState('');
  const [known, setKnown] = useState<string[]>([]);

  useEffect(() => {
    technologyApi.getAll().then(setKnown).catch(() => setKnown([]));
  }, []);

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag) return;
    const exists = value.some((v) => v.toLowerCase() === tag.toLowerCase());
    if (!exists) onChange([...value, tag]);
    setInput('');
  };

  const removeTag = (tag: string) => onChange(value.filter((v) => v !== tag));

  const suggestions = known
    .filter((k) => !value.some((v) => v.toLowerCase() === k.toLowerCase()))
    .filter((k) => input.length > 0 && k.toLowerCase().includes(input.toLowerCase()))
    .slice(0, 6);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 px-3 py-1 text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-indigo-300 hover:text-white"
              aria-label={`${tag} etiketini kaldır`}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <input
        className="input"
        placeholder="Teknoloji yaz, Enter'a bas (ör. React, ASP.NET Core)"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(input);
          }
        }}
      />

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {suggestions.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => addTag(s)}
              className="text-xs rounded-full border border-slate-700 px-2 py-1 text-slate-400 hover:border-indigo-500 hover:text-indigo-300"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
