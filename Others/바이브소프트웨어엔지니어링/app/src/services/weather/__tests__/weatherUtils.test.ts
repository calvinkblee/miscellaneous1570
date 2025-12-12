import { transformWeatherResponse, getWeatherIconUrl } from '../weatherUtils';
import type { WeatherAPIResponse } from '../weatherTypes';

describe('weatherUtils', () => {
  describe('transformWeatherResponse', () => {
    const mockApiResponse: WeatherAPIResponse = {
      coord: { lon: 126.9784, lat: 37.5665 },
      weather: [
        { id: 800, main: 'Clear', description: '맑음', icon: '01d' },
      ],
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

    it('API 응답을 WeatherInfo 타입으로 올바르게 변환해야 합니다', () => {
      const result = transformWeatherResponse(mockApiResponse);

      expect(result.location).toEqual({
        name: '서울',
        lat: 37.5665,
        lon: 126.9784,
        country: 'KR',
      });
    });

    it('기온을 반올림하여 소수점 없이 변환해야 합니다', () => {
      const result = transformWeatherResponse(mockApiResponse);

      expect(result.current.temp).toBe(23); // 22.5 -> 23
      expect(result.current.feelsLike).toBe(22); // 21.8 -> 22
    });

    it('현재 날씨 정보를 올바르게 변환해야 합니다', () => {
      const result = transformWeatherResponse(mockApiResponse);

      expect(result.current).toEqual({
        temp: 23,
        feelsLike: 22,
        humidity: 45,
        pressure: 1013,
        visibility: 10000,
        windSpeed: 3.5,
        windDeg: 180,
      });
    });

    it('첫 번째 weather 배열 항목을 사용해야 합니다', () => {
      const result = transformWeatherResponse(mockApiResponse);

      expect(result.weather).toEqual({
        id: 800,
        main: 'Clear',
        description: '맑음',
        icon: '01d',
      });
    });

    it('timestamp와 timezone을 올바르게 반환해야 합니다', () => {
      const result = transformWeatherResponse(mockApiResponse);

      expect(result.timestamp).toBe(1701676800);
      expect(result.timezone).toBe(32400);
    });
  });

  describe('getWeatherIconUrl', () => {
    it('기본 사이즈(2x) 아이콘 URL을 생성해야 합니다', () => {
      const url = getWeatherIconUrl('01d');
      expect(url).toBe('https://openweathermap.org/img/wn/01d@2x.png');
    });

    it('1x 사이즈 아이콘 URL을 생성해야 합니다', () => {
      const url = getWeatherIconUrl('01d', '1x');
      expect(url).toBe('https://openweathermap.org/img/wn/01d.png');
    });

    it('2x 사이즈 아이콘 URL을 생성해야 합니다', () => {
      const url = getWeatherIconUrl('10n', '2x');
      expect(url).toBe('https://openweathermap.org/img/wn/10n@2x.png');
    });

    it('4x 사이즈 아이콘 URL을 생성해야 합니다', () => {
      const url = getWeatherIconUrl('03d', '4x');
      expect(url).toBe('https://openweathermap.org/img/wn/03d@4x.png');
    });
  });
});


