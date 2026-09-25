import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

type SubmitUploadButtonProps = {
  loading: boolean;
  readingDuration: boolean;
};

export function SubmitUploadButton({
  loading,
  readingDuration,
}: SubmitUploadButtonProps) {
  return (
    <Button
      type="submit"
      disabled={loading || readingDuration}
      className="w-full rounded-2xl bg-green-400 py-3 font-bold text-black transition hover:bg-green-300 disabled:opacity-50"
    >
      {loading ? (
        <span className="inline-flex items-center justify-center gap-2">
          <Loader2 size={18} className="animate-spin" />
          Uploading...
        </span>
      ) : (
        'Upload Song'
      )}
    </Button>
  );
}