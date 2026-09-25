import { CheckCircle2 } from 'lucide-react';

type SongUploadAlertsProps = {
  error: string | null;
  success: boolean;
};

export function SongUploadAlerts({ error, success }: SongUploadAlertsProps) {
  return (
    <>
      {error && (
        <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-950/40 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-green-500/30 bg-green-950/40 p-3 text-sm text-green-200">
          <CheckCircle2 size={18} />
          Song uploaded successfully!
        </div>
      )}
    </>
  );
}