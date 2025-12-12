import type { WeatherInfo } from '@/types/weather';
import { WeatherIcon } from './WeatherIcon';

interface WeatherCardProps {
  weather: WeatherInfo;
  className?: string;
}

/**
 * 날씨 정보 카드 컴포넌트
 */
export const WeatherCard = ({ weather, className = '' }: WeatherCardProps) => {
  const { location, current, weather: condition } = weather;

  return (
    <div
      className={`w-full max-w-sm rounded-lg bg-white p-6 shadow-card ${className}`}
      data-testid="weather-card"
    >
      {/* 위치명 */}
      <div className="mb-4 flex items-center justify-center gap-1 text-sm text-gray-600">
        <span>📍</span>
        <span>{location.name}</span>
        {location.country && (
          <span className="text-gray-400">, {location.country}</span>
        )}
      </div>

      {/* 구분선 */}
      <div className="mb-4 border-b border-gray-100" />

      {/* 날씨 아이콘 */}
      <div className="mb-2 flex justify-center">
        <WeatherIcon
          iconCode={condition.icon}
          size="md"
          alt={condition.description}
        />
      </div>

      {/* 기온 */}
      <div className="mb-1 text-center font-display text-4xl font-bold text-gray-900">
        {current.temp}°C
      </div>

      {/* 체감온도 + 상태 */}
      <p className="mb-4 text-center text-sm text-gray-500">
        체감 {current.feelsLike}°C · {condition.description}
      </p>

      {/* 구분선 */}
      <div className="mb-4 border-b border-gray-100" />

      {/* 습도, 풍속 */}
      <div className="flex justify-center gap-6 text-sm text-gray-600">
        <span className="flex items-center gap-1">
          <span>💧</span>
          <span>{current.humidity}%</span>
        </span>
        <span className="flex items-center gap-1">
          <span>🌬️</span>
          <span>{current.windSpeed}m/s</span>
        </span>
      </div>
    </div>
  );
};


