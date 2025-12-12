/**
 * 환경 변수를 타입 안전하게 가져오는 헬퍼 함수
 */
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key];
  if (!value && !defaultValue) {
    console.warn(`Missing environment variable: ${key}`);
    return '';
  }
  return value || defaultValue || '';
};

/**
 * 애플리케이션 환경 변수
 */
export const env = {
  OPENWEATHER_API_KEY: getEnvVar('VITE_OPENWEATHER_API_KEY'),
  GOOGLE_PLACES_API_KEY: getEnvVar('VITE_GOOGLE_PLACES_API_KEY'),
  GOOGLE_MAPS_API_KEY: getEnvVar('VITE_GOOGLE_MAPS_API_KEY'),
} as const;

