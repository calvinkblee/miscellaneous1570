import axios from 'axios';
import { env } from './env';

/**
 * Axios 인스턴스 생성
 */
export const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // 개발 환경에서 요청 로깅
    if (env.IS_DEVELOPMENT) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 에러 로깅
    if (env.IS_DEVELOPMENT) {
      console.error('[API Error]', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);


