import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WeatherDisplay } from '../WeatherDisplay';
import { weatherService } from '@/services/weather';
import type { WeatherInfo, Location } from '@/types/weather';
import React from 'react';

// Mock weatherService
jest.mock('@/services/weather', () => ({
  weatherService: {
    getCurrentWeather: jest.fn(),
  },
  getWeatherIconUrl: jest.fn((iconCode: string, size: string) => {
    const sizeMap: Record<string, string> = { '1x': '', '2x': '@2x', '4x': '@4x' };
    return `https://openweathermap.org/img/wn/${iconCode}${sizeMap[size] || '@2x'}.png`;
  }),
}));

// Mock useWeather hook to control retry behavior in tests
jest.mock('@/hooks/useWeather', () => {
  const originalModule = jest.requireActual('@/hooks/useWeather');
  return {
    ...originalModule,
    useWeather: (location: Location | null, options?: { enabled?: boolean }) => {
      const { useQuery } = jest.requireActual('@tanstack/react-query');
      const { weatherService } = jest.requireMock('@/services/weather');
      
      return useQuery({
        queryKey: location 
          ? ['weather', 'current', location.lat, location.lon] 
          : ['weather'],
        queryFn: () => weatherService.getCurrentWeather(location!),
        enabled: !!location && (options?.enabled ?? true),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: false, // 테스트에서는 재시도 비활성화
      });
    },
  };
});

describe('WeatherDisplay', () => {
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

  it('location이 null이면 아무것도 렌더링하지 않아야 합니다', () => {
    const { container } = render(<WeatherDisplay location={null} />, { wrapper });

    expect(container).toBeEmptyDOMElement();
  });

  it('로딩 중에는 스켈레톤을 표시해야 합니다', () => {
    (weatherService.getCurrentWeather as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // 영원히 pending 상태
    );

    render(<WeatherDisplay location={mockLocation} />, { wrapper });

    expect(screen.getByTestId('weather-skeleton')).toBeInTheDocument();
  });

  it('날씨 데이터가 로드되면 WeatherCard를 표시해야 합니다', async () => {
    (weatherService.getCurrentWeather as jest.Mock).mockResolvedValue(mockWeatherInfo);

    render(<WeatherDisplay location={mockLocation} />, { wrapper });

    await waitFor(() => {
      expect(screen.getByTestId('weather-card')).toBeInTheDocument();
    });

    expect(screen.getByText('서울')).toBeInTheDocument();
    expect(screen.getByText('23°C')).toBeInTheDocument();
  });

  it('에러 발생 시 에러 컴포넌트를 표시해야 합니다', async () => {
    const mockError = new Error('API Error');
    (weatherService.getCurrentWeather as jest.Mock).mockRejectedValue(mockError);

    render(<WeatherDisplay location={mockLocation} />, { wrapper });

    await waitFor(
      () => {
        expect(screen.getByTestId('weather-error')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('에러 발생 시 재시도 버튼이 작동해야 합니다', async () => {
    const mockError = new Error('API Error');
    (weatherService.getCurrentWeather as jest.Mock)
      .mockRejectedValueOnce(mockError)
      .mockResolvedValueOnce(mockWeatherInfo);

    render(<WeatherDisplay location={mockLocation} />, { wrapper });

    // 에러 상태 대기
    await waitFor(
      () => {
        expect(screen.getByTestId('weather-error')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // 재시도 버튼 클릭
    const retryButton = screen.getByText('다시 시도');
    fireEvent.click(retryButton);

    // 성공 상태 대기
    await waitFor(() => {
      expect(screen.getByTestId('weather-card')).toBeInTheDocument();
    });

    expect(weatherService.getCurrentWeather).toHaveBeenCalledTimes(2);
  });

  it('className을 전달할 수 있어야 합니다', async () => {
    (weatherService.getCurrentWeather as jest.Mock).mockResolvedValue(mockWeatherInfo);

    render(<WeatherDisplay location={mockLocation} className="custom-class" />, { wrapper });

    await waitFor(() => {
      expect(screen.getByTestId('weather-card')).toHaveClass('custom-class');
    });
  });
});

