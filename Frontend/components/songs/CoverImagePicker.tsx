'use client';

import Image from 'next/image';
import { ImagePlus, X } from 'lucide-react';

type CoverImagePickerProps = {
  coverPreviewUrl: string;
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
};

export function CoverImagePicker({
  coverPreviewUrl,
  loading,
  onChange,
  onRemove,
}: CoverImagePickerProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white">
        Cover Image Optional
      </label>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-black/20 p-5 text-center transition hover:border-green-400/50 hover:bg-green-400/5">
        <ImagePlus size={28} className="mb-2 text-green-300" />

        <span className="text-sm font-semibold text-white">
          Choose cover image
        </span>

        <span className="mt-1 text-xs text-slate-500">
          PNG, JPG, WEBP recommended
        </span>

        <input
          type="file"
          accept="image/*"
          onChange={onChange}
          disabled={loading}
          className="hidden"
        />
      </label>

      {coverPreviewUrl && (
        <div className="relative mt-4 h-36 w-36 overflow-hidden rounded-3xl border border-white/10 bg-slate-800">
          <Image
            src={coverPreviewUrl}
            alt="Cover preview"
            fill
            className="object-cover"
            unoptimized
          />

          <button
            type="button"
            onClick={onRemove}
            disabled={loading}
            className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white transition hover:bg-red-500"
            aria-label="Remove cover image"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}