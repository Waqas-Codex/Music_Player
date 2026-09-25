export interface SongUploadFormProps {
  onSuccess?: () => void;
}

export type SongFormData = {
  title: string;
  album: string;
  duration: string;
  description: string;
};
 
export const initialFormData: SongFormData = {
  title: '',
  album: '',
  duration: '',
  description: '',
};