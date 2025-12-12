import type { Location } from '@/types/weather';
import { useWeather } from '@/hooks/useWeather';
import { WeatherCard } from './WeatherCard';
import { WeatherSkeleton } from './WeatherSkeleton';
import { WeatherError } from './WeatherError';

interface WeatherDisplayProps {
  location: Location | null;
  className?: string;
}

/**
 * 날씨 표시 컨테이너 컴포넌트 (로딩/에러/데이터 상태 관리)
 */
export const WeatherDisplay = ({ location, className = '' }: WeatherDisplayProps) => {
  const { data: weather, isLoading, error, refetch } = useWeather(location);

  if (!location) {
    return null;
  }

  if (isLoading) {
    return <WeatherSkeleton />;
  }

  if (error) {
    return <WeatherError error={error} onRetry={() => refetch()} />;
  }

  if (!weather) {
    return null;
  }

  return <WeatherCard weather={weather} className={className} />;
};


