// Environment-aware URL configuration for BoB Suite
// Automatically switches between localhost and Vercel based on environment

const isDevelopment =
  import.meta.env.DEV ||
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

const APP_URLS = {
  development: {
    'bulk-bundle': 'http://localhost:5176',
    'single-flow': 'http://localhost:5174',
    'doctor-bob': 'http://localhost:5175',
    'doctor-bob-bulk': 'http://localhost:5180',
  },
  production: {
    'bulk-bundle': 'https://bob-bundle-manager.vercel.app',
    'single-flow': 'https://bob-single-flow.vercel.app',
    'doctor-bob': 'https://bob-doctor.vercel.app',
    'doctor-bob-bulk': 'https://bob-doctor-bulk.vercel.app',
  }
};

export const getAppUrl = (appId) => {
  const env = isDevelopment ? 'development' : 'production';
  return APP_URLS[env][appId] || '/';
};

export const getBobSuiteApps = () => {
  const env = isDevelopment ? 'development' : 'production';
  return APP_URLS[env];
};

export { isDevelopment };
