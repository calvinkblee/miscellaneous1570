import { weatherService } from '../weatherService';
import { apiClient } from '@/configs/api';
import { ApiError, ERROR_MESSAGES } from '@/types/errors';
import type { WeatherAPIResponse } from '../weatherTypes';

// Mock apiClient
jest.mock('@/configs/api', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

// Mock env
jest.mock('@/configs/env', () => ({
  env: {
    OPENWEATHER_API_KEY: 'test-api-key',
  },
}));

describe('weatherService', () => {
  const mockLocation = { lat: 37.5665, lon: 126.9784 };

  const mockApiResponse: WeatherAPIResponse = {
    coord: { lon: 126.9784, lat: 37.5665 },
    weather: [{ id: 800, main: 'Clear', description: '맑음', icon: '01d' }],
    main: {
      temp: 22.5,
      feels_like: 21.8,
      humidity: 45,
      pressure: 1013,
      temp_min: 20,
      temp_max: 25,
    },
    visibility: 10000,
    wind: { speed: 3.5, deg: 180 },
    clouds: { all: 0 },
    dt: 1701676800,
    sys: { country: 'KR', sunrise: 1701640000, sunset: 1701676000 },
    timezone: 32400,
    name: '서울',
    cod: 200,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentWeather', () => {
    it('유효한 위치로 날씨 정보를 조회해야 합니다', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({ data: mockApiResponse });

      const result = await weatherService.getCurrentWeather(mockLocation);

      expect(apiClient.get).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/weather',
        {
          params: {
            lat: 37.5665,
            lon: 126.9784,
            appid: 'test-api-key',
            units: 'metric',
            lang: 'ko',
          },
        }
      );

      expect(result.location.name).toBe('서울');
      expect(result.current.temp).toBe(23);
    });

    it('401 에러 시 API_KEY_ERROR 메시지를 반환해야 합니다', async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 401, data: { message: 'Invalid API key' } },
        code: 'ERR_BAD_REQUEST',
      };
      (apiClient.get as jest.Mock).mockRejectedValue(axiosError);

      // axios.isAxiosError를 직접 모킹
      const axios = jest.requireMock('axios');
      axios.isAxiosError = jest.fn().mockReturnValue(true);

      await expect(weatherService.getCurrentWeather(mockLocation)).rejects.toThrow(
        ApiError
      );

      try {
        await weatherService.getCurrentWeather(mockLocation);
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).message).toBe(ERROR_MESSAGES.WEATHER.API_KEY_ERROR);
        expect((error as ApiError).statusCode).toBe(401);
      }
    });

    it('404 에러 시 LOCATION_NOT_FOUND 메시지를 반환해야 합니다', async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 404, data: { message: 'City not found' } },
        code: 'ERR_BAD_REQUEST',
      };
      (apiClient.get as jest.Mock).mockRejectedValue(axiosError);

      const axios = jest.requireMock('axios');
      axios.isAxiosError = jest.fn().mockReturnValue(true);

      try {
        await weatherService.getCurrentWeather(mockLocation);
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).message).toBe(ERROR_MESSAGES.WEATHER.LOCATION_NOT_FOUND);
        expect((error as ApiError).statusCode).toBe(404);
      }
    });

    it('429 에러 시 RATE_LIMIT 메시지를 반환해야 합니다', async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 429, data: { message: 'Rate limit exceeded' } },
        code: 'ERR_BAD_REQUEST',
      };
      (apiClient.get as jest.Mock).mockRejectedValue(axiosError);

      const axios = jest.requireMock('axios');
      axios.isAxiosError = jest.fn().mockReturnValue(true);

      try {
        await weatherService.getCurrentWeather(mockLocation);
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).message).toBe(ERROR_MESSAGES.WEATHER.RATE_LIMIT);
        expect((error as ApiError).statusCode).toBe(429);
      }
    });

    it('기타 에러 시 FETCH_FAILED 메시지를 반환해야 합니다', async () => {
      const axiosError = {
        isAxiosError: true,
        response: { status: 500, data: { message: 'Server error' } },
        code: 'ERR_BAD_RESPONSE',
      };
      (apiClient.get as jest.Mock).mockRejectedValue(axiosError);

      const axios = jest.requireMock('axios');
      axios.isAxiosError = jest.fn().mockReturnValue(true);

      try {
        await weatherService.getCurrentWeather(mockLocation);
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).message).toBe(ERROR_MESSAGES.WEATHER.FETCH_FAILED);
        expect((error as ApiError).statusCode).toBe(500);
      }
    });

    it('Axios 에러가 아닌 경우 원래 에러를 throw해야 합니다', async () => {
      const genericError = new Error('Unknown error');
      (apiClient.get as jest.Mock).mockRejectedValue(genericError);

      const axios = jest.requireMock('axios');
      axios.isAxiosError = jest.fn().mockReturnValue(false);

      await expect(weatherService.getCurrentWeather(mockLocation)).rejects.toThrow(
        'Unknown error'
      );
    });
  });
});


