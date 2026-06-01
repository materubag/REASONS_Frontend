import { BACK_URL } from '../config/app-env';

export const resolveBackendUrl = (path?: string | null): string => {
  if (!path) {
    return '';
  }
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  if (path.startsWith('/')) {
    return `${BACK_URL}${path}`;
  }
  return `${BACK_URL}/${path}`;
};
