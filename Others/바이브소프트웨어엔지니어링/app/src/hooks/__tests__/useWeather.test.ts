import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWeather, weatherKeys } from '../useWeather';
import { weatherService } from '@/services/weather';
import type { WeatherInfo, Location } from '@/types/weather';
import React from 'react';

// Mock weatherService
jest.mock('@/services/weather', () => ({
  weatherService: {
    getCurrentWeather: jest.fn(),
  },
}));

describe('useWeather', () => {
  const mockLocation: Location = { lat: 37.5665, lon: 126.9784 };

  const mockWeatherInfo: WeatherInfo = {
    location: {
      name: '서울',
      lat: 37.5665,
      lon: 126.9784,
      country: 'KR',
    },
    current: {
      temp: 23,
      feelsLike: 22,
      humidity: 45,
      pressure: 1013,
      visibility: 10000,
      windSpeed: 3.5,
      windDeg: 180,
    },
    weather: {
      id: 800,
      main: 'Clear',
      description: '맑음',
      icon: '01d',
    },
    timestamp: 1701676800,
    timezone: 32400,
  };

  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    jest.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  describe('weatherKeys', () => {
    it('all 키를 올바르게 생성해야 합니다', () => {
      expect(weatherKeys.all).toEqual(['weather']);
    });

    it('current 키를 위도/경도로 생성해야 합니다', () => {
      expect(weatherKeys.current(37.5665, 126.9784)).toEqual([
        'weather',
        'current',
        37.5665,
        126.9784,
      ]);
    });
  });

  describe('useWeather hook', () => {
    it('location이 null이면 쿼리가 비활성화되어야 합니다', () => {
      const { result } = renderHook(() => useWeather(null), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
      expect(weatherService.getCurrentWeather).not.toHaveBeenCalled();
    });

    it('유효한 location으로 날씨를 조회해야 합니다', async () => {
      (weatherService.getCurrentWeather as jest.Mock).mockResolvedValue(mockWeatherInfo);

      const { result } = renderHook(() => useWeather(mockLocation), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(weatherService.getCurrentWeather).toHaveBeenCalledWith(mockLocation);
      expect(result.current.data).toEqual(mockWeatherInfo);
    });

    it('enabled 옵션이 false면 쿼리가 비활성화되어야 합니다', () => {
      const { result } = renderHook(
        () => useWeather(mockLocation, { enabled: false }),
        { wrapper }
      );

      expect(result.current.isLoading).toBe(false);
      expect(weatherService.getCurrentWeather).not.toHaveBeenCalled();
    });

    it('API 에러 시 에러 상태를 반환해야 합니다', async () => {
      const mockError = new Error('API Error');
      (weatherService.getCurrentWeather as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useWeather(mockLocation), { wrapper });

      // useWeather hook 내부의 retry: 2 설정으로 인해 최대 3번 시도 후 에러 상태가 됨
      // retryDelay는 1초, 2초로 설정되어 있으므로 총 약 3초 대기
      await waitFor(
        () => {
          expect(result.current.isError).toBe(true);
        },
        { timeout: 10000 }
      );

      expect(result.current.error).toBe(mockError);
    });
  });
});

