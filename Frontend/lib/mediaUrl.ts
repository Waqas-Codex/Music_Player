const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const BACKEND_URL = API_URL.replace(/\/api\/?$/, '');

export function getMediaUrl(path?: string | null) {
  if (!path) return '';

  if (path.startsWith('http')) return path;

  if (path.startsWith('/')) {
    return `${BACKEND_URL}${path}`;
  }

  return `${BACKEND_URL}/${path}`;
}