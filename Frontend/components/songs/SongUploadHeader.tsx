import { UploadCloud } from 'lucide-react';

export function SongUploadHeader() {
  return (
    <div className="mb-6">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-green-300">
        <UploadCloud size={15} />
        New Track
      </div>

      <h2 className="text-2xl font-black tracking-tight text-white">
        Upload Song
      </h2>

      <p className="mt-2 text-sm text-slate-400">
        Add audio, cover image, and metadata for your music library.
      </p>
    </div>
  );
}