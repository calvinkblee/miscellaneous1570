/**
 * API 에러 클래스
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public response?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * 위치 에러 클래스
 */
export class GeolocationError extends Error {
  constructor(
    message: string,
    public code: number
  ) {
    super(message);
    this.name = 'GeolocationError';
  }
}

/**
 * 에러 메시지 상수
 */
export const ERROR_MESSAGES = {
  WEATHER: {
    FETCH_FAILED: '날씨 정보를 불러올 수 없습니다',
    LOCATION_NOT_FOUND: '해당 위치의 날씨를 찾을 수 없습니다',
    API_KEY_ERROR: 'API 인증에 실패했습니다',
    RATE_LIMIT: '잠시 후 다시 시도해주세요',
    NETWORK_ERROR: '인터넷 연결을 확인해주세요',
  },
} as const;


