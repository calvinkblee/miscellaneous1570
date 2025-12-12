import { ApiError, ERROR_MESSAGES } from '@/types/errors';

interface WeatherErrorProps {
  error: Error;
  onRetry?: () => void;
}

/**
 * 날씨 에러 표시 컴포넌트
 */
export const WeatherError = ({ error, onRetry }: WeatherErrorProps) => {
  const getMessage = (): string => {
    if (error instanceof ApiError) {
      return error.message;
    }
    if (error.message.includes('network') || error.message.includes('Network')) {
      return ERROR_MESSAGES.WEATHER.NETWORK_ERROR;
    }
    return ERROR_MESSAGES.WEATHER.FETCH_FAILED;
  };

  return (
    <div
      className="w-full max-w-sm rounded-lg bg-red-50 p-6 text-center"
      role="alert"
      data-testid="weather-error"
    >
      <div className="mb-3 text-4xl">⚠️</div>
      <p className="mb-4 text-sm text-red-700">{getMessage()}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          다시 시도
        </button>
      )}
    </div>
  );
};


