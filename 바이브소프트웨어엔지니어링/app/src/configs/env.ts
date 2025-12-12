/**
 * 환경 변수를 안전하게 가져옵니다.
 * @param key - 환경 변수 키
 * @param defaultValue - 기본값 (선택)
 * @returns 환경 변수 값
 */
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key];
  if (!value && !defaultValue) {
    console.warn(`Missing environment variable: ${key}`);
    return '';
  }
  return value || defaultValue || '';
};

export const env = {
  OPENWEATHER_API_KEY: getEnvVar('VITE_OPENWEATHER_API_KEY'),
  GOOGLE_PLACES_API_KEY: getEnvVar('VITE_GOOGLE_PLACES_API_KEY'),
  GOOGLE_MAPS_API_KEY: getEnvVar('VITE_GOOGLE_MAPS_API_KEY'),
  API_BASE_URL: getEnvVar('VITE_API_BASE_URL', 'https://api.openweathermap.org'),
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
} as const;


