import { render, screen } from '@testing-library/react';
import { WeatherCard } from '../WeatherCard';
import type { WeatherInfo } from '@/types/weather';

describe('WeatherCard', () => {
  const mockWeather: WeatherInfo = {
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

  it('날씨 카드를 렌더링해야 합니다', () => {
    render(<WeatherCard weather={mockWeather} />);

    expect(screen.getByTestId('weather-card')).toBeInTheDocument();
  });

  it('위치 정보를 표시해야 합니다', () => {
    render(<WeatherCard weather={mockWeather} />);

    expect(screen.getByText('서울')).toBeInTheDocument();
    expect(screen.getByText(', KR')).toBeInTheDocument();
  });

  it('현재 기온을 표시해야 합니다', () => {
    render(<WeatherCard weather={mockWeather} />);

    expect(screen.getByText('23°C')).toBeInTheDocument();
  });

  it('체감 온도와 날씨 상태를 표시해야 합니다', () => {
    render(<WeatherCard weather={mockWeather} />);

    expect(screen.getByText('체감 22°C · 맑음')).toBeInTheDocument();
  });

  it('습도와 풍속을 표시해야 합니다', () => {
    render(<WeatherCard weather={mockWeather} />);

    expect(screen.getByText('45%')).toBeInTheDocument();
    expect(screen.getByText('3.5m/s')).toBeInTheDocument();
  });

  it('날씨 아이콘을 표시해야 합니다', () => {
    render(<WeatherCard weather={mockWeather} />);

    const icon = screen.getByAltText('맑음');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('src', expect.stringContaining('01d'));
  });

  it('className을 전달할 수 있어야 합니다', () => {
    render(<WeatherCard weather={mockWeather} className="custom-class" />);

    expect(screen.getByTestId('weather-card')).toHaveClass('custom-class');
  });

  it('국가 코드가 없을 때도 정상 렌더링해야 합니다', () => {
    const weatherWithoutCountry: WeatherInfo = {
      ...mockWeather,
      location: {
        ...mockWeather.location,
        country: '',
      },
    };

    render(<WeatherCard weather={weatherWithoutCountry} />);

    expect(screen.getByText('서울')).toBeInTheDocument();
    expect(screen.queryByText(', ')).not.toBeInTheDocument();
  });
});


