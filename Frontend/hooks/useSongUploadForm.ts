import { useEffect, useState } from 'react';
import { songService } from '@/services/song.service';
import { initialFormData, type SongFormData } from '@/types/form/upload';

type UseSongUploadFormProps = {
  onSuccess?: () => void;
};

export function useSongUploadForm({ onSuccess }: UseSongUploadFormProps) {
  const [formData, setFormData] = useState<SongFormData>(initialFormData);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [readingDuration, setReadingDuration] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setFormData(initialFormData);
    setAudioFile(null);
    setCoverImage(null);
    setCoverPreviewUrl('');
    setUploadProgress(0);
  };

  useEffect(() => {
    return () => {
      if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);
    };
  }, [coverPreviewUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getAudioDuration = (selectedFile: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const audio = document.createElement('audio');
      const objectUrl = URL.createObjectURL(selectedFile);

      audio.preload = 'metadata';

      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(Math.round(audio.duration));
      };

      audio.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Could not read audio duration'));
      };

      audio.src = objectUrl;
    });
  };

  const handleAudioChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    setError(null);

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('audio/')) {
      setError('Please select a valid audio file.');
      return;
    }

    setAudioFile(selectedFile);
    setReadingDuration(true);

    try {
      const duration = await getAudioDuration(selectedFile);

      setFormData((prev) => ({
        ...prev,
        duration: String(duration),
        title: prev.title || selectedFile.name.replace(/\.[^/.]+$/, ''),
      }));
    } catch {
      setError('Audio duration read nahi ho saki. Duration manually enter karo.');
    } finally {
      setReadingDuration(false);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    setError(null);

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);

    setCoverImage(selectedFile);
    setCoverPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const removeCoverImage = () => {
    if (coverPreviewUrl) URL.revokeObjectURL(coverPreviewUrl);

    setCoverImage(null);
    setCoverPreviewUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSuccess(false);

    if (!formData.title.trim()) {
      setError('Song title required hai.');
      return;
    }

    if (!audioFile) {
      setError('Audio file select karo.');
      return;
    }

    if (!formData.duration) {
      setError('Audio duration required hai.');
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      const uploadFormData = new FormData();

      uploadFormData.append('file', audioFile);
      uploadFormData.append('title', formData.title.trim());
      uploadFormData.append('album', formData.album.trim());
      uploadFormData.append('description', formData.description.trim());
      uploadFormData.append('duration', formData.duration);
      uploadFormData.append('path', audioFile.name);

      if (coverImage) uploadFormData.append('coverImage', coverImage);

      await songService.uploadSong(uploadFormData, setUploadProgress);

      setSuccess(true);
      resetForm();
      onSuccess?.();

      setTimeout(() => setSuccess(false), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}