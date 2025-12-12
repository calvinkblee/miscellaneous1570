import { render, screen, fireEvent } from '@testing-library/react';
import { WeatherError } from '../WeatherError';
import { ApiError, ERROR_MESSAGES } from '@/types/errors';

describe('WeatherError', () => {
  it('에러 메시지를 표시해야 합니다', () => {
    const error = new Error('Test error');
    render(<WeatherError error={error} />);

    expect(screen.getByTestId('weather-error')).toBeInTheDocument();
    expect(screen.getByText(ERROR_MESSAGES.WEATHER.FETCH_FAILED)).toBeInTheDocument();
  });

  it('ApiError의 메시지를 표시해야 합니다', () => {
    const error = new ApiError(ERROR_MESSAGES.WEATHER.API_KEY_ERROR, 401);
    render(<WeatherError error={error} />);

    expect(screen.getByText(ERROR_MESSAGES.WEATHER.API_KEY_ERROR)).toBeInTheDocument();
  });

  it('네트워크 에러를 감지해야 합니다', () => {
    const error = new Error('Network error occurred');
    render(<WeatherError error={error} />);

    expect(screen.getByText(ERROR_MESSAGES.WEATHER.NETWORK_ERROR)).toBeInTheDocument();
  });

  it('재시도 버튼이 onRetry 없을 때 표시되지 않아야 합니다', () => {
    const error = new Error('Test error');
    render(<WeatherError error={error} />);

    expect(screen.queryByText('다시 시도')).not.toBeInTheDocument();
  });

  it('재시도 버튼 클릭 시 onRetry가 호출되어야 합니다', () => {
    const error = new Error('Test error');
    const onRetry = jest.fn();
    render(<WeatherError error={error} onRetry={onRetry} />);

    const retryButton = screen.getByText('다시 시도');
    expect(retryButton).toBeInTheDocument();

    fireEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('role="alert"이 설정되어야 합니다', () => {
    const error = new Error('Test error');
    render(<WeatherError error={error} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('경고 이모지가 표시되어야 합니다', () => {
    const error = new Error('Test error');
    render(<WeatherError error={error} />);

    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });
});


