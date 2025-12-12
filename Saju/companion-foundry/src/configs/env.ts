const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key];
  if (!value && !defaultValue) {
    console.warn(`Missing environment variable: ${key}`);
    return '';
  }
  return value || defaultValue || '';
};

export const env = {
  OPENWEATHER_API_KEY: getEnvVar('VITE_OPENWEATHER_API_KEY', ''),
  GOOGLE_PLACES_API_KEY: getEnvVar('VITE_GOOGLE_PLACES_API_KEY', ''),
  GOOGLE_MAPS_API_KEY: getEnvVar('VITE_GOOGLE_MAPS_API_KEY', ''),
  API_BASE_URL: getEnvVar('VITE_API_BASE_URL', 'http://localhost:3001'),
} as const;

