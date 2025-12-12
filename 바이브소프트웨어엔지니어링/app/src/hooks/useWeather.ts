import { useQuery } from '@tanstack/react-query';
import { weatherService } from '@/services/weather';
import type { Location, WeatherInfo } from '@/types/weather';

/**
 * 날씨 쿼리 키
 */
export const weatherKeys = {
  all: ['weather'] as const,
  current: (lat: number, lon: number) => [...weatherKeys.all, 'current', lat, lon] as const,
};

interface UseWeatherOptions {
  enabled?: boolean;
}

/**
 * 현재 날씨를 조회하는 Hook
 * @param location - 위치 정보
 * @param options - 옵션
 * @returns 날씨 조회 결과
 */
export const useWeather = (location: Location | null, options?: UseWeatherOptions) => {
  return useQuery<WeatherInfo>({
    queryKey: location ? weatherKeys.current(location.lat, location.lon) : weatherKeys.all,
    queryFn: () => weatherService.getCurrentWeather(location!),
    enabled: !!location && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분 (이전 cacheTime)
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
};


