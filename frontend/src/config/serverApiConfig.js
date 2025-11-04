// Helper function to ensure HTTPS in production
const ensureHttps = (url) => {
  if (!url) return url;
  // If we're in production and URL starts with http://, convert to https://
  if (import.meta.env.PROD && url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  return url;
};

// Get backend server URL - prioritize environment variable, fallback to Railway domain, then localhost
const getBackendServer = () => {
  if (import.meta.env.VITE_BACKEND_SERVER) {
    return ensureHttps(import.meta.env.VITE_BACKEND_SERVER);
  }
  if (import.meta.env.PROD) {
    // In production, use the current origin (HTTPS)
    return window.location.origin + '/';
  }
  return 'http://localhost:8888/';
};

const BACKEND_SERVER = getBackendServer();

export const API_BASE_URL =
  import.meta.env.PROD || import.meta.env.VITE_DEV_REMOTE == 'remote'
    ? BACKEND_SERVER + 'api/'
    : 'http://localhost:8888/api/';

export const BASE_URL =
  import.meta.env.PROD || import.meta.env.VITE_DEV_REMOTE
    ? BACKEND_SERVER
    : 'http://localhost:8888/';

export const WEBSITE_URL = import.meta.env.PROD
  ? window.location.origin + '/'
  : 'http://localhost:3000/';

export const DOWNLOAD_BASE_URL =
  import.meta.env.PROD || import.meta.env.VITE_DEV_REMOTE
    ? BACKEND_SERVER + 'download/'
    : 'http://localhost:8888/download/';
export const ACCESS_TOKEN_NAME = 'x-auth-token';

export const FILE_BASE_URL = import.meta.env.VITE_FILE_BASE_URL;

//  console.log(
//    '🚀 Welcome to IDURAR ERP CRM! Did you know that we also offer commercial customization services? Contact us at hello@idurarapp.com for more information.'
//  );
