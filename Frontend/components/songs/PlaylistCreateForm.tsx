"use client";

import { useState } from "react";
import { playlistService } from "@/services/playlist.service";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function PlaylistCreateForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setCoverImage(selectedFile);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!playlistName.trim()) {
      setError("Please enter a playlist name");
      return;
    }

    setLoading(true);

    try {
      let data: FormData | { name: string };

      if (coverImage) {
        const formData = new FormData();
        formData.append("name", playlistName);
        formData.append("coverImage", coverImage);
        data = formData;
      } else {
        data = { name: playlistName };
      }

      await playlistService.createPlaylist(data);

      setSuccess(true);
      setPlaylistName("");
      setCoverImage(null);
      setCoverImagePreview("");

      if (onSuccess) {
        onSuccess();
      }

      // Reset success message after 2 seconds
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to create playlist. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-950/20 p-5 shadow-xl shadow-black/20">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">Quick create</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Create a playlist in one compact step.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-sm text-emerald-200">
          Playlist created successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Playlist name"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          placeholder="Enter a playlist name"
          disabled={loading}
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Cover image (optional)
          </label>
          <div className="rounded-2xl border border-zinc-700 bg-zinc-950/70 p-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImageChange}
              disabled={loading}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white file:mr-3 file:rounded-full file:border-0 file:bg-emerald-500 file:px-3 file:py-1.5 file:text-black file:font-semibold hover:file:bg-emerald-400"
            />
            {coverImagePreview && (
              <div className="mt-3 flex items-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-900/80 p-3">
                <img
                  src={coverImagePreview}
                  alt="Cover preview"
                  className="h-20 w-20 rounded-xl object-cover border border-zinc-700"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCoverImage(null);
                    setCoverImagePreview("");
                  }}
                  className="rounded-full bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-zinc-700"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 py-2.5 text-black hover:bg-emerald-400 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create playlist"}
        </Button>
      </form>
    </div>
  );
}
