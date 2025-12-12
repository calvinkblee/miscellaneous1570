/**
 * 위치 정보 타입
 */
export interface Location {
  lat: number;
  lon: number;
  name?: string;
}

/**
 * 날씨 상태 타입
 */
export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

/**
 * 현재 날씨 정보 타입
 */
export interface WeatherInfo {
  location: {
    name: string;
    lat: number;
    lon: number;
    country: string;
  };
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    pressure: number;
    visibility: number;
    windSpeed: number;
    windDeg: number;
  };
  weather: WeatherCondition;
  timestamp: number;
  timezone: number;
}

/**
 * 날씨 예보 정보 타입
 */
export interface ForecastInfo {
  location: Location;
  list: ForecastItem[];
}

/**
 * 예보 항목 타입
 */
export interface ForecastItem {
  dt: number;
  dtTxt: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  weather: WeatherCondition;
  pop: number; // 강수 확률
}


