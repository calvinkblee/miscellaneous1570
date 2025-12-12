import axios from 'axios';
import { apiClient } from '@/configs/api';
import { env } from '@/configs/env';
import type { WeatherInfo, Location } from '@/types/weather';
import { ApiError, ERROR_MESSAGES } from '@/types/errors';
import { transformWeatherResponse } from './weatherUtils';
import type { WeatherAPIResponse } from './weatherTypes';

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * HTTP 상태 코드에 따른 에러 메시지를 반환합니다.
 */
function getErrorMessage(status: number): string {
  switch (status) {
    case 401:
      return ERROR_MESSAGES.WEATHER.API_KEY_ERROR;
    case 404:
      return ERROR_MESSAGES.WEATHER.LOCATION_NOT_FOUND;
    case 429:
      return ERROR_MESSAGES.WEATHER.RATE_LIMIT;
    default:
      return ERROR_MESSAGES.WEATHER.FETCH_FAILED;
  }
}

export const weatherService = {
  /**
   * 현재 날씨를 조회합니다.
   * @param location - 위치 정보 (위도/경도)
   * @returns 날씨 정보
   * @throws {ApiError} API 호출 실패 시
   */
  async getCurrentWeather(location: Location): Promise<WeatherInfo> {
    try {
      const response = await apiClient.get<WeatherAPIResponse>(
        `${OPENWEATHER_BASE_URL}/weather`,
        {
          params: {
            lat: location.lat,
            lon: location.lon,
            appid: env.OPENWEATHER_API_KEY,
            units: 'metric',
            lang: 'ko',
          },
        }
      );
      return transformWeatherResponse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        const message = getErrorMessage(status);
        throw new ApiError(message, status, error.code, error.response?.data);
      }
      throw error;
    }
  },
};


