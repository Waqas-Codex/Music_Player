type UploadProgressProps = {
  uploadProgress: number;
};

export function UploadProgress({ uploadProgress }: UploadProgressProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
        <span>Uploading...</span>
        <span>{uploadProgress}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-green-400 transition-all"
          style={{ width: `${uploadProgress}%` }}
        />
      </div>
    </div>
  );
}