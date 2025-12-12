# 개발 계획: FR-001 현재 위치 날씨 조회

**날짜:** 2025-12-04  
**문서번호:** dev-20251204-01  
**관련 문서:**
- [FR-001 Feature Spec](../../../docs/specs/features/FR-001.md)
- [US-001 User Story](../../../docs/specs/user-stories/US-001.md)
- [US-002 User Story](../../../docs/specs/user-stories/US-002.md)
- [Design System](../../../docs/design_system.md)
- [Development Guide](../../../docs/DEVELOPMENT_GUIDE.md)
- [OpenWeatherMap API](../../../api_docs/open_weather_api.md)

## 1. 개요

사용자의 현재 위치 또는 선택한 위치의 실시간 날씨 정보를 조회하여 화면에 표시하는 기능을 구현합니다. OpenWeatherMap API를 사용하여 현재 기온, 체감온도, 습도, 날씨 상태, 날씨 아이콘을 가져와 날씨 카드 형태로 표시합니다.

## 2. 상세 요구사항

### 2.1 목표
- OpenWeatherMap Current Weather API 연동
- 위치 정보(위도/경도) 기반 실시간 날씨 조회
- 날씨 정보를 시각적으로 표시하는 UI 컴포넌트 구현
- 로딩, 에러 상태 처리
- 5분 캐시를 통한 불필요한 API 호출 방지

### 2.2 주요 구성 요소

1. **Weather Service Layer**
   - `weatherService.ts`: OpenWeatherMap API 호출 로직
   - `weatherUtils.ts`: API 응답 변환 함수
   - `weatherTypes.ts`: API 응답 타입 정의

2. **React Query Hook**
   - `useWeather.ts`: 날씨 데이터 fetching 및 캐싱 Hook

3. **UI Components**
   - `WeatherDisplay.tsx`: 로딩/에러/데이터 상태 관리 컴포넌트
   - `WeatherCard.tsx`: 날씨 정보 표시 카드 컴포넌트
   - `WeatherIcon.tsx`: 날씨 아이콘 컴포넌트
   - `WeatherSkeleton.tsx`: 로딩 스켈레톤 컴포넌트
   - `WeatherError.tsx`: 에러 표시 컴포넌트

4. **Error Handling**
   - `types/errors.ts`: 에러 타입 정의

### 2.3 기술 요구사항

#### 개발 환경
- Node.js 20.19.0 이상
- TypeScript 5.8.0 이상 (strict mode)
- React 18.3.1 이상
- Vite 6.0.0 이상

#### 핵심 라이브러리
- `@tanstack/react-query`: 5.74.0 이상 (서버 상태 관리)
- `axios`: 1.7.9 이상 (API 클라이언트)
- `zustand`: 5.0.0 이상 (클라이언트 상태 관리)
- `tailwindcss`: 3.4.17 이상 (스타일링)

#### API
- OpenWeatherMap Current Weather API
- 엔드포인트: `https://api.openweathermap.org/data/2.5/weather`
- 인증: API Key (query parameter)

#### 코드 품질
- ESLint 검증 통과
- TypeScript strict 모드 통과
- 테스트 커버리지 80% 이상
- Prettier 포맷팅 적용

### 2.4 파일 구조

```
app/src/
├── types/
│   ├── weather.ts              # (기존) 날씨 타입 정의
│   └── errors.ts               # (신규) 에러 타입 정의
├── services/
│   └── weather/
│       ├── index.ts            # Public exports
│       ├── weatherService.ts   # API 호출 서비스
│       ├── weatherTypes.ts     # API 응답 타입
│       └── weatherUtils.ts     # 응답 변환 유틸리티
├── hooks/
│   └── useWeather.ts           # 날씨 조회 Hook
├── components/
│   └── weather/
│       ├── index.ts            # Public exports
│       ├── WeatherDisplay.tsx  # 상태 관리 컴포넌트
│       ├── WeatherCard.tsx     # 날씨 카드 UI
│       ├── WeatherIcon.tsx     # 날씨 아이콘
│       ├── WeatherSkeleton.tsx # 로딩 스켈레톤
│       └── WeatherError.tsx    # 에러 표시
└── stores/
    └── weatherStore.ts         # (기존 확장) Zustand 스토어
```

## 3. 구현 세부사항

### 3.1 에러 타입 정의

**파일:** `src/types/errors.ts`

```typescript
/**
 * API 에러 클래스
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public response?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * 위치 에러 클래스
 */
export class GeolocationError extends Error {
  constructor(
    message: string,
    public code: number
  ) {
    super(message);
    this.name = 'GeolocationError';
  }
}

/**
 * 에러 메시지 상수
 */
export const ERROR_MESSAGES = {
  WEATHER: {
    FETCH_FAILED: '날씨 정보를 불러올 수 없습니다',
    LOCATION_NOT_FOUND: '해당 위치의 날씨를 찾을 수 없습니다',
    API_KEY_ERROR: 'API 인증에 실패했습니다',
    RATE_LIMIT: '잠시 후 다시 시도해주세요',
    NETWORK_ERROR: '인터넷 연결을 확인해주세요',
  },
} as const;
```

**구현 요구사항:**
- HTTP 상태 코드별 에러 처리 지원
- 사용자 친화적인 에러 메시지 중앙화
- 에러 타입별 구분 가능한 구조

### 3.2 Weather Service Types

**파일:** `src/services/weather/weatherTypes.ts`

```typescript
/**
 * OpenWeatherMap API 원시 응답 타입
 */
export interface WeatherAPIResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  name: string;
  cod: number;
}
```

**구현 요구사항:**
- OpenWeatherMap API 응답과 1:1 매핑
- 필수 필드 타입 안전성 보장

### 3.3 Weather Service Utilities

**파일:** `src/services/weather/weatherUtils.ts`

```typescript
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
```

**구현 요구사항:**
- 기온은 소수점 없이 반올림 처리
- API 응답의 첫 번째 weather 배열 항목 사용
- 아이콘 URL 생성 시 size 옵션 지원

### 3.4 Weather Service

**파일:** `src/services/weather/weatherService.ts`

```typescript
import axios from 'axios';
import { apiClient } from '@/configs/api';
import { env } from '@/configs/env';
import type { WeatherInfo, Location } from '@/types/weather';
import { ApiError, ERROR_MESSAGES } from '@/types/errors';
import { transformWeatherResponse } from './weatherUtils';
import type { WeatherAPIResponse } from './weatherTypes';

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const weatherService = {
  /**
   * 현재 날씨를 조회합니다.
   * @param location - 위치 정보 (위도/경도)
   * @returns 날씨 정보
   * @throws {ApiError} API 호출 실패 시
   */
  async getCurrentWeather(location: Location): Promise<WeatherInfo> {
    try {
      const response = await apiClient.get<WeatherAPIResponse>(
        `${OPENWEATHER_BASE_URL}/weather`,
        {
          params: {
            lat: location.lat,
            lon: location.lon,
            appid: env.OPENWEATHER_API_KEY,
            units: 'metric',
            lang: 'ko',
          },
        }
      );
      return transformWeatherResponse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status || 500;
        const message = this.getErrorMessage(status);
        throw new ApiError(message, status, error.code, error.response?.data);
      }
      throw error;
    }
  },

  /**
   * HTTP 상태 코드에 따른 에러 메시지를 반환합니다.
   */
  getErrorMessage(status: number): string {
    switch (status) {
      case 401:
        return ERROR_MESSAGES.WEATHER.API_KEY_ERROR;
      case 404:
        return ERROR_MESSAGES.WEATHER.LOCATION_NOT_FOUND;
      case 429:
        return ERROR_MESSAGES.WEATHER.RATE_LIMIT;
      default:
        return ERROR_MESSAGES.WEATHER.FETCH_FAILED;
    }
  },
};
```

**구현 요구사항:**
- Axios를 통한 API 호출
- 환경 변수에서 API 키 로드
- HTTP 상태 코드별 적절한 에러 메시지
- 메트릭 단위(섭씨) 및 한국어 설정

### 3.5 Weather Service Index

**파일:** `src/services/weather/index.ts`

```typescript
export { weatherService } from './weatherService';
export { transformWeatherResponse, getWeatherIconUrl } from './weatherUtils';
export type { WeatherAPIResponse } from './weatherTypes';
```

### 3.6 useWeather Hook

**파일:** `src/hooks/useWeather.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { weatherService } from '@/services/weather';
import type { Location, WeatherInfo } from '@/types/weather';

/**
 * 날씨 쿼리 키
 */
export const weatherKeys = {
  all: ['weather'] as const,
  current: (lat: number, lon: number) => [...weatherKeys.all, 'current', lat, lon] as const,
};

interface UseWeatherOptions {
  enabled?: boolean;
}

/**
 * 현재 날씨를 조회하는 Hook
 * @param location - 위치 정보
 * @param options - 옵션
 * @returns 날씨 조회 결과
 */
export const useWeather = (location: Location | null, options?: UseWeatherOptions) => {
  return useQuery<WeatherInfo>({
    queryKey: location ? weatherKeys.current(location.lat, location.lon) : weatherKeys.all,
    queryFn: () => weatherService.getCurrentWeather(location!),
    enabled: !!location && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000,   // 10분 (이전 cacheTime)
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
};
```

**구현 요구사항:**
- location이 null이면 쿼리 비활성화
- 5분 staleTime으로 캐시 활용
- 최대 2회 재시도 (지수 백오프)
- 쿼리 키 팩토리 함수 제공

### 3.7 Weather Store 확장

**파일:** `src/stores/weatherStore.ts`

```typescript
import { create } from 'zustand';
import type { WeatherInfo, Location } from '@/types/weather';

interface WeatherState {
  currentLocation: Location | null;
  currentWeather: WeatherInfo | null;
  setCurrentLocation: (location: Location | null) => void;
  setCurrentWeather: (weather: WeatherInfo | null) => void;
  clearWeather: () => void;
}

export const useWeatherStore = create<WeatherState>((set) => ({
  currentLocation: null,
  currentWeather: null,
  setCurrentLocation: (location) => set({ currentLocation: location }),
  setCurrentWeather: (weather) => set({ currentWeather: weather }),
  clearWeather: () => set({ currentLocation: null, currentWeather: null }),
}));
```

**구현 요구사항:**
- 현재 위치 및 날씨 데이터 저장
- 상태 초기화 함수 제공

### 3.8 WeatherIcon Component

**파일:** `src/components/weather/WeatherIcon.tsx`

```typescript
import { getWeatherIconUrl } from '@/services/weather';

interface WeatherIconProps {
  iconCode: string;
  size?: 'sm' | 'md' | 'lg';
  alt?: string;
  className?: string;
}

const sizeMap = {
  sm: { px: 32, api: '1x' as const },
  md: { px: 48, api: '2x' as const },
  lg: { px: 64, api: '4x' as const },
};

/**
 * 날씨 아이콘 컴포넌트
 */
export const WeatherIcon = ({ 
  iconCode, 
  size = 'md', 
  alt = '날씨 아이콘',
  className = '',
}: WeatherIconProps) => {
  const { px, api } = sizeMap[size];
  const url = getWeatherIconUrl(iconCode, api);

  return (
    <img
      src={url}
      alt={alt}
      width={px}
      height={px}
      className={className}
      loading="lazy"
    />
  );
};
```

**구현 요구사항:**
- 3가지 사이즈 옵션 (sm: 32px, md: 48px, lg: 64px)
- lazy loading 적용
- 접근성을 위한 alt 텍스트

### 3.9 WeatherSkeleton Component

**파일:** `src/components/weather/WeatherSkeleton.tsx`

```typescript
/**
 * 날씨 카드 로딩 스켈레톤 컴포넌트
 */
export const WeatherSkeleton = () => {
  return (
    <div 
      className="w-full max-w-sm rounded-lg bg-white p-6 shadow-card animate-pulse"
      data-testid="weather-skeleton"
    >
      {/* 위치명 */}
      <div className="mb-4 h-5 w-32 rounded bg-gray-200" />
      
      {/* 날씨 아이콘 */}
      <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gray-200" />
      
      {/* 기온 */}
      <div className="mx-auto mb-2 h-10 w-24 rounded bg-gray-200" />
      
      {/* 체감온도 + 상태 */}
      <div className="mx-auto mb-4 h-4 w-40 rounded bg-gray-200" />
      
      {/* 습도, 풍속 */}
      <div className="flex justify-center gap-4">
        <div className="h-4 w-16 rounded bg-gray-200" />
        <div className="h-4 w-16 rounded bg-gray-200" />
      </div>
    </div>
  );
};
```

**구현 요구사항:**
- WeatherCard와 동일한 레이아웃 구조
- animate-pulse 애니메이션 적용
- data-testid 속성 포함

### 3.10 WeatherError Component

**파일:** `src/components/weather/WeatherError.tsx`

```typescript
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
```

**구현 요구사항:**
- ApiError 인스턴스 처리
- 네트워크 에러 감지
- 재시도 버튼 옵션
- 접근성을 위한 role="alert"

### 3.11 WeatherCard Component

**파일:** `src/components/weather/WeatherCard.tsx`

```typescript
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
```

**구현 요구사항:**
- 디자인 시스템 준수 (shadow-card, rounded-lg)
- 기온은 Display 폰트 (font-display) 사용
- 48px 날씨 아이콘
- 습도, 풍속 정보 표시
- 한국어 날씨 설명 표시

### 3.12 WeatherDisplay Component

**파일:** `src/components/weather/WeatherDisplay.tsx`

```typescript
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
```

**구현 요구사항:**
- location이 없으면 null 반환
- 로딩 중 스켈레톤 표시
- 에러 시 에러 컴포넌트 + 재시도 기능
- 데이터 있으면 WeatherCard 표시

### 3.13 Weather Components Index

**파일:** `src/components/weather/index.ts`

```typescript
export { WeatherDisplay } from './WeatherDisplay';
export { WeatherCard } from './WeatherCard';
export { WeatherIcon } from './WeatherIcon';
export { WeatherSkeleton } from './WeatherSkeleton';
export { WeatherError } from './WeatherError';
```

## 4. 검증 기준

### 4.1 기능 검증
- [ ] 유효한 위치 정보로 날씨 조회 성공
- [ ] 현재 기온이 소수점 없이 표시
- [ ] 체감 온도 표시
- [ ] 날씨 상태가 한국어로 표시
- [ ] 날씨 아이콘이 날씨 상태에 맞게 표시
- [ ] 습도와 풍속 표시
- [ ] 로딩 중 스켈레톤 UI 표시
- [ ] API 오류 시 에러 메시지 표시
- [ ] 에러 시 재시도 버튼 작동
- [ ] 5분 이내 재요청 시 캐시 데이터 사용

### 4.2 테스트 검증
- [ ] weatherService 단위 테스트 작성 및 통과
- [ ] transformWeatherResponse 단위 테스트 작성 및 통과
- [ ] WeatherCard 컴포넌트 테스트 작성 및 통과
- [ ] WeatherDisplay 통합 테스트 작성 및 통과
- [ ] useWeather Hook 테스트 작성 및 통과
- [ ] 단위 테스트 작성 및 통과 (`yarn test`)
- [ ] E2E 테스트 작성 및 통과 (`yarn test:e2e`) - Playwright 설정 후
- [ ] Contract Testing 작성 및 통과 (OpenWeatherMap API Mock)

### 4.3 코드 품질
- [ ] TypeScript 타입 체크 통과 (`yarn type-check`)
- [ ] ESLint 검증 통과 (`yarn lint`)
- [ ] 테스트 커버리지 목표 달성 (80% 이상)
- [ ] 모든 에러 처리 경로 테스트 포함
- [ ] 타입 정의 중복 없음 확인
- [ ] 에러 메시지 일관성 확인 (중앙화된 에러 처리)

## 5. 의존성

### 5.1 기존 모듈
- `types/weather.ts`: 날씨 관련 타입 (Location, WeatherInfo 등)
- `configs/env.ts`: 환경 변수 설정 (OPENWEATHER_API_KEY)
- `configs/api.ts`: Axios 인스턴스

### 5.2 외부 라이브러리
- `@tanstack/react-query`: 서버 상태 관리, 캐싱
- `axios`: HTTP 클라이언트
- `zustand`: 클라이언트 상태 관리

## 6. 예상 산출물

### 6.1 소스 파일
1. `src/types/errors.ts`
2. `src/services/weather/index.ts`
3. `src/services/weather/weatherService.ts`
4. `src/services/weather/weatherTypes.ts`
5. `src/services/weather/weatherUtils.ts`
6. `src/hooks/useWeather.ts`
7. `src/components/weather/index.ts`
8. `src/components/weather/WeatherDisplay.tsx`
9. `src/components/weather/WeatherCard.tsx`
10. `src/components/weather/WeatherIcon.tsx`
11. `src/components/weather/WeatherSkeleton.tsx`
12. `src/components/weather/WeatherError.tsx`
13. `src/stores/weatherStore.ts` (수정)

### 6.2 테스트 파일
1. `src/services/weather/__tests__/weatherService.test.ts`
2. `src/services/weather/__tests__/weatherUtils.test.ts`
3. `src/hooks/__tests__/useWeather.test.ts`
4. `src/components/weather/__tests__/WeatherCard.test.tsx`
5. `src/components/weather/__tests__/WeatherDisplay.test.tsx`
6. `src/components/weather/__tests__/WeatherError.test.tsx`

### 6.3 문서
1. `development/20251204/01-FR-001/dev-plan.md` (본 문서)

## 7. 참고사항

### 7.1 스펙 문서 참조
- [FR-001](../../../docs/specs/features/FR-001.md): 현재 위치 날씨 조회 기능 명세
- [design_system.md](../../../docs/design_system.md): UI 디자인 시스템 (컬러, 타이포그래피, 그림자 등)

### 7.2 기존 구현 참조
- `types/weather.ts`: WeatherInfo, Location 타입이 이미 정의됨
- `configs/api.ts`: apiClient 인스턴스 사용
- `configs/env.ts`: OPENWEATHER_API_KEY 환경 변수

### 7.3 주의사항
- API 키는 환경변수로만 관리 (코드에 하드코딩 금지)
- 날씨 아이콘 URL은 HTTPS 사용
- 캐시 무효화 시점 고려 (위치 변경 시)
- 기온 표시 시 반올림 처리 필수
- 디자인 시스템의 날씨별 테마 컬러는 추후 확장 예정

## 8. 구현 순서 (Step 기반 접근)

### Step 1: 기반 인프라 구축 - 에러 타입 및 서비스 레이어

#### Phase 1: 에러 타입 및 서비스 타입 정의 (예상: 30분)
1. 에러 타입 정의 (`src/types/errors.ts`)
2. API 응답 타입 정의 (`src/services/weather/weatherTypes.ts`)
3. 응답 변환 유틸리티 구현 (`src/services/weather/weatherUtils.ts`)

**검증 기준:**
- [ ] 에러 타입이 정의되고 에러 메시지 상수가 포함됨
- [ ] WeatherAPIResponse 타입이 OpenWeatherMap 스펙과 일치
- [ ] transformWeatherResponse 함수가 올바르게 변환
- [ ] TypeScript 타입 체크 통과
- [ ] ESLint 검증 통과

#### Phase 2: Weather Service 구현 (예상: 45분)
1. Weather Service 구현 (`src/services/weather/weatherService.ts`)
2. Service Index 파일 생성 (`src/services/weather/index.ts`)
3. 단위 테스트 작성 (`src/services/weather/__tests__/weatherService.test.ts`)
4. 유틸 테스트 작성 (`src/services/weather/__tests__/weatherUtils.test.ts`)

**검증 기준:**
- [ ] getCurrentWeather 함수가 API를 올바르게 호출
- [ ] 에러 상황에서 ApiError를 throw
- [ ] HTTP 상태 코드별 적절한 메시지 반환
- [ ] TypeScript 타입 체크 통과
- [ ] ESLint 검증 통과
- [ ] 단위 테스트 작성 및 통과

**Step 1 완료 기준:**
- [ ] 에러 타입 정의 완료
- [ ] Weather Service 구현 및 export 완료
- [ ] 서비스 단위 테스트 통과
- [ ] **필수 검증 항목 (모든 Step 공통)**
  - [ ] TypeScript 타입 체크 통과 (`yarn type-check`)
  - [ ] ESLint 검증 통과 (`yarn lint`)
  - [ ] 단위 테스트 작성 및 통과 (`yarn test`)
  - [ ] 테스트 커버리지 확인 (목표: 80% 이상, 핵심 로직은 100%)
  - [ ] 에러 처리 경로 테스트 포함 확인
  - [ ] 타입 정의 중복 확인 (중복 없음)
  - [ ] 에러 메시지 일관성 확인 (중앙화된 에러 처리 사용)

---

### Step 2: React 통합 - Hook 및 Store

#### Phase 3: useWeather Hook 및 Store 구현 (예상: 30분)
1. useWeather Hook 구현 (`src/hooks/useWeather.ts`)
2. weatherStore 확장 (`src/stores/weatherStore.ts`)
3. Hook 테스트 작성 (`src/hooks/__tests__/useWeather.test.ts`)

**검증 기준:**
- [ ] useWeather Hook이 React Query를 올바르게 사용
- [ ] location이 null일 때 쿼리 비활성화
- [ ] 5분 staleTime 설정 확인
- [ ] weatherStore에 currentLocation, currentWeather 상태 포함
- [ ] TypeScript 타입 체크 통과
- [ ] ESLint 검증 통과
- [ ] 관련 단위 테스트 작성 및 통과

**Step 2 완료 기준:**
- [ ] useWeather Hook 구현 완료
- [ ] weatherStore 확장 완료
- [ ] Hook 테스트 통과
- [ ] **필수 검증 항목 (모든 Step 공통)**
  - [ ] TypeScript 타입 체크 통과 (`yarn type-check`)
  - [ ] ESLint 검증 통과 (`yarn lint`)
  - [ ] 단위 테스트 작성 및 통과 (`yarn test`)
  - [ ] 테스트 커버리지 확인 (목표: 80% 이상)
  - [ ] 상태 관리 구조 확인 (공유 상태는 상위 컴포넌트에서 관리)

---

### Step 3: UI 컴포넌트 구현 - 기본 컴포넌트

#### Phase 4: 기초 UI 컴포넌트 (예상: 45분)
1. WeatherIcon 컴포넌트 구현 (`src/components/weather/WeatherIcon.tsx`)
2. WeatherSkeleton 컴포넌트 구현 (`src/components/weather/WeatherSkeleton.tsx`)
3. WeatherError 컴포넌트 구현 (`src/components/weather/WeatherError.tsx`)

**검증 기준:**
- [ ] WeatherIcon이 3가지 사이즈로 렌더링
- [ ] WeatherSkeleton이 로딩 애니메이션 표시
- [ ] WeatherError가 에러 메시지와 재시도 버튼 표시
- [ ] data-testid 속성 포함
- [ ] TypeScript 타입 체크 통과
- [ ] ESLint 검증 통과

#### Phase 5: WeatherCard 컴포넌트 (예상: 45분)
1. WeatherCard 컴포넌트 구현 (`src/components/weather/WeatherCard.tsx`)
2. WeatherCard 테스트 작성 (`src/components/weather/__tests__/WeatherCard.test.tsx`)
3. WeatherError 테스트 작성 (`src/components/weather/__tests__/WeatherError.test.tsx`)

**검증 기준:**
- [ ] 디자인 시스템 스타일 적용 (shadow-card, rounded-lg)
- [ ] 기온이 Display 폰트로 표시
- [ ] 날씨 아이콘, 기온, 체감온도, 습도, 풍속 표시
- [ ] 한국어 날씨 설명 표시
- [ ] TypeScript 타입 체크 통과
- [ ] ESLint 검증 통과
- [ ] 컴포넌트 테스트 작성 및 통과

**Step 3 완료 기준:**
- [ ] 모든 기초 UI 컴포넌트 구현 완료
- [ ] WeatherCard 디자인 시스템 준수
- [ ] 컴포넌트 테스트 통과
- [ ] **필수 검증 항목 (모든 Step 공통)**
  - [ ] TypeScript 타입 체크 통과 (`yarn type-check`)
  - [ ] ESLint 검증 통과 (`yarn lint`)
  - [ ] 단위 테스트 작성 및 통과 (`yarn test`)
  - [ ] 테스트 커버리지 확인 (목표: 80% 이상)

---

### Step 4: 통합 및 완성 - WeatherDisplay

#### Phase 6: WeatherDisplay 및 통합 (예상: 30분)
1. WeatherDisplay 컴포넌트 구현 (`src/components/weather/WeatherDisplay.tsx`)
2. Components Index 파일 생성 (`src/components/weather/index.ts`)
3. WeatherDisplay 통합 테스트 작성 (`src/components/weather/__tests__/WeatherDisplay.test.tsx`)

**검증 기준:**
- [ ] 로딩/에러/데이터 상태별 올바른 컴포넌트 표시
- [ ] location이 null일 때 null 반환
- [ ] 에러 시 재시도 기능 작동
- [ ] TypeScript 타입 체크 통과
- [ ] ESLint 검증 통과
- [ ] 통합 테스트 작성 및 통과

#### Phase 7: 최종 검증 및 정리 (예상: 30분)
1. 전체 테스트 실행 및 커버리지 확인
2. 타입 체크 및 린트 검증
3. 수동 테스트 (브라우저)
4. 문서 정리

**검증 기준:**
- [ ] 전체 테스트 통과
- [ ] 테스트 커버리지 80% 이상
- [ ] 브라우저에서 정상 작동 확인
- [ ] TypeScript 타입 체크 통과
- [ ] ESLint 검증 통과

**Step 4 완료 기준:**
- [ ] WeatherDisplay 구현 완료
- [ ] 모든 컴포넌트 export 완료
- [ ] 전체 테스트 통과 (80% 이상 커버리지)
- [ ] **필수 검증 항목 (모든 Step 공통)**
  - [ ] TypeScript 타입 체크 통과 (`yarn type-check`)
  - [ ] ESLint 검증 통과 (`yarn lint`)
  - [ ] 단위 테스트 작성 및 통과 (`yarn test`)
  - [ ] 테스트 커버리지 확인 (목표: 80% 이상, 핵심 로직은 100%)
  - [ ] 에러 처리 경로 테스트 포함 확인
  - [ ] 타입 정의 중복 확인 (중복 없음)
  - [ ] 에러 메시지 일관성 확인 (중앙화된 에러 처리 사용)
  - [ ] 상태 관리 구조 확인 (공유 상태는 상위 컴포넌트에서 관리)
- [ ] **E2E 테스트** (Playwright 설정 완료 시)
  - [ ] 날씨 조회 E2E 테스트 작성 (`e2e/weather.spec.ts`)
  - [ ] E2E 테스트 통과 (`yarn test:e2e`)

---

## 9. 예상 소요 시간

### Step 1: 기반 인프라 구축
- Phase 1: 30분
- Phase 2: 45분
- **소계: 약 1시간 15분**

### Step 2: React 통합
- Phase 3: 30분
- **소계: 약 30분**

### Step 3: UI 컴포넌트 구현
- Phase 4: 45분
- Phase 5: 45분
- **소계: 약 1시간 30분**

### Step 4: 통합 및 완성
- Phase 6: 30분
- Phase 7: 30분
- **소계: 약 1시간**

**총 예상 소요 시간: 약 4시간 15분**

## 10. 리스크 및 대응 방안

### 리스크 1: OpenWeatherMap API 응답 구조 변경
- **영향**: 타입 불일치로 런타임 에러 발생 가능
- **대응**: Contract Testing 구현, API 응답 검증 로직 추가

### 리스크 2: API 키 노출
- **영향**: 보안 문제, API 요청 제한 초과
- **대응**: 환경변수 사용, 프로덕션에서는 백엔드 프록시 권장

### 리스크 3: 네트워크 불안정
- **영향**: 사용자 경험 저하
- **대응**: 재시도 로직 구현, 오프라인 상태 감지, 캐시 활용

---

## 11. 최종 완료 검증

### 코드 품질 검증
- [ ] TypeScript 타입 체크 통과 (`yarn type-check`)
- [ ] ESLint 검증 통과 (`yarn lint`)
- [ ] 빌드 성공 (`yarn build`)

### 테스트 검증
- [ ] 단위 테스트 통과 (`yarn test`)
- [ ] 테스트 커버리지 80% 이상 (`yarn test:coverage`)
- [ ] 모든 에러 처리 경로 테스트 포함

### 코드 구조 검증
- [ ] 타입 정의 중복 없음 (types/weather.ts만 사용)
- [ ] 에러 처리 일관성 (types/errors.ts 사용)
- [ ] 상태 관리 구조 적절 (React Query + Zustand)

### 문서화 검증
- [ ] 모든 public 함수에 JSDoc 주석
- [ ] 복잡한 로직에 설명 주석

### 기능 검증
- [ ] 브라우저에서 날씨 조회 정상 작동
- [ ] 로딩 상태 표시 확인
- [ ] 에러 상태 및 재시도 확인
- [ ] 캐시 동작 확인 (5분 이내 재요청 시)

---

**작성자:** AI Assistant  
**최종 수정일:** 2025-12-04


