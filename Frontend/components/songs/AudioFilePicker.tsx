'use client';

import { Loader2, Music2 } from 'lucide-react';

type AudioFilePickerProps = {
  audioFile: File | null;
  loading: boolean;
  readingDuration: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function AudioFilePicker({
  audioFile,
  loading,
  readingDuration,
  onChange,
}: AudioFilePickerProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white">
        Audio File
      </label>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-black/20 p-5 text-center transition hover:border-green-400/50 hover:bg-green-400/5">
        <Music2 size={30} className="mb-2 text-green-300" />

        <span className="text-sm font-semibold text-white">
          Choose audio file
        </span>

        <span className="mt-1 max-w-full truncate text-xs text-slate-500">
          {audioFile ? audioFile.name : 'MP3, WAV, M4A supported'}
        </span>

        <input
          type="file"
          accept="audio/*"
          onChange={onChange}
          disabled={loading}
          className="hidden"
        />
      </label>

      {readingDuration && (
        <p className="mt-2 flex items-center gap-2 text-sm text-green-300">
          <Loader2 size={15} className="animate-spin" />
          Reading audio duration...
        </p>
      )}
    </div>
  );
}