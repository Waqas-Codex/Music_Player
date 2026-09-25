'use client';

import { Input } from '@/components/ui/Input';
import type { SongUploadFormProps } from '@/types/form/upload';
import { useSongUploadForm } from '@/hooks/useSongUploadForm';

import { SongUploadHeader } from './SongUploadHeader';
import { SongUploadAlerts } from './SongUploadAlerts';
import { CoverImagePicker } from './CoverImagePicker';
import { AudioFilePicker } from './AudioFilePicker';
import { UploadProgress } from './UploadProgress';
import { SubmitUploadButton } from './SubmitUploadButton';

export function SongUploadForm({ onSuccess }: SongUploadFormProps) {
  const {
    formData,
    audioFile,
    coverPreviewUrl,
    loading,
    readingDuration,
    uploadProgress,
    error,
    success,
    handleInputChange,
    handleAudioChange,
    handleCoverImageChange,
    removeCoverImage,
    handleSubmit,
  } = useSongUploadForm({ onSuccess });

  return (
    <div className="w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-6">
      <SongUploadHeader />

      <SongUploadAlerts error={error} success={success} />

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Song Title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter song title"
          disabled={loading}
        />

        <Input
          label="Album Optional"
          name="album"
          value={formData.album}
          onChange={handleInputChange}
          placeholder="Enter album name"
          disabled={loading}
        />

        <Input
          label="Description Optional"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter song description"
          disabled={loading}
        />

        <Input
          label="Duration seconds"
          name="duration"
          value={formData.duration}
          onChange={handleInputChange}
          placeholder="Auto detected after audio select"
          disabled={loading || readingDuration}
        />

        <CoverImagePicker
          coverPreviewUrl={coverPreviewUrl}
          loading={loading}
          onChange={handleCoverImageChange}
          onRemove={removeCoverImage}
        />

        <AudioFilePicker
          audioFile={audioFile}
          loading={loading}
          readingDuration={readingDuration}
          onChange={handleAudioChange}
        />

        {loading && <UploadProgress uploadProgress={uploadProgress} />}

        <SubmitUploadButton loading={loading} readingDuration={readingDuration} />
      </form>
    </div>
  );
}