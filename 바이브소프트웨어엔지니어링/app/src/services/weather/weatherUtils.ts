import type { WeatherInfo } from '@/types/weather';
import type { WeatherAPIResponse } from './weatherTypes';

/**
 * OpenWeatherMap API 응답을 앱 내부 타입으로 변환합니다.
 * @param data - API 원시 응답
 * @returns 변환된 날씨 정보
 */
export function transformWeatherResponse(data: WeatherAPIResponse): WeatherInfo {
  return {
    location: {
      name: data.name,
      lat: data.coord.lat,
      lon: data.coord.lon,
      country: data.sys.country,
    },
    current: {
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      visibility: data.visibility,
      windSpeed: data.wind.speed,
      windDeg: data.wind.deg,
    },
    weather: {
      id: data.weather[0].id,
      main: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    },
    timestamp: data.dt,
    timezone: data.timezone,
  };
}

/**
 * OpenWeatherMap 아이콘 코드를 이미지 URL로 변환합니다.
 * @param iconCode - 아이콘 코드 (예: "01d")
 * @param size - 아이콘 크기 (1x, 2x, 4x)
 * @returns 아이콘 URL
 */
export function getWeatherIconUrl(iconCode: string, size: '1x' | '2x' | '4x' = '2x'): string {
  const sizeMap = { '1x': '', '2x': '@2x', '4x': '@4x' };
  return `https://openweathermap.org/img/wn/${iconCode}${sizeMap[size]}.png`;
}


