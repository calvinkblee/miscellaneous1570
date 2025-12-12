import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { WeatherDisplay } from '@/components/weather';
import { useWeatherStore } from '@/stores/weatherStore';
import type { Location } from '@/types/weather';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const { currentLocation, setCurrentLocation } = useWeatherStore();

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('이 브라우저에서는 위치 서비스를 사용할 수 없습니다.');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: Location = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        setCurrentLocation(location);
        setIsLoading(false);
      },
      (error) => {
        console.error('위치 정보를 가져올 수 없습니다:', error);
        alert('위치 정보를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream p-8">
      <div className="flex flex-col items-center gap-8">
        <div className="card max-w-md text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            🍽️ 날씨 맞춤 음식점 추천
          </h1>
          <p className="mb-6 text-gray-600">
            지금 날씨에 딱 맞는 음식점을 찾아보세요!
          </p>
          <div className="flex flex-col gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={handleGetCurrentLocation}
              disabled={isLoading}
            >
              {isLoading ? '위치 확인 중...' : '🌤️ 현재 위치로 시작하기'}
            </Button>
            <Button variant="secondary">📍 위치 직접 입력</Button>
          </div>
        </div>

        {/* 날씨 정보 표시 */}
        <WeatherDisplay location={currentLocation} />
      </div>
    </div>
  );
}

export default App;
