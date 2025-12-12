# 개발 가이드

개발 과정에 필요한 공통 규약, 개발 환경, 코드 작성 규칙, 디자인 패턴 등을 기술합니다.

## 목차

1. [개발 환경 설정](#1-개발-환경-설정)
2. [프로젝트 구조](#2-프로젝트-구조)
3. [코드 작성 규칙](#3-코드-작성-규칙)
4. [디자인 패턴](#4-디자인-패턴)
5. [스타일링 규칙](#5-스타일링-규칙)
6. [환경 변수 관리](#6-환경-변수-관리)
7. [Git 워크플로우](#7-git-워크플로우)
8. [테스트 전략](#8-테스트-전략)
9. [API 호출 패턴](#9-api-호출-패턴)
10. [에러 처리](#10-에러-처리)

---

## 1. 개발 환경 설정

### 1.1 필수 요구사항

- **Node.js**: 20.19.0 이상 또는 22.12.0 이상
- **패키지 매니저**: Yarn (권장) 또는 npm/pnpm
- **IDE**: VS Code (권장) 또는 WebStorm
- **브라우저**: 최신 버전의 Chrome, Firefox, Safari, Edge

### 1.2 프로젝트 초기화

```bash
# 의존성 설치
yarn install

# 개발 서버 실행
yarn dev

# 빌드
yarn build

# 프로덕션 빌드 미리보기
yarn preview
```

### 1.3 기술 스택

#### 핵심 프레임워크 및 라이브러리
- **React**: 18.3.1 이상
- **TypeScript**: 5.8.0 이상
- **Vite**: 6.0.0 이상 (빌드 도구)
- **React Router**: 7.5.0 이상 (라우팅)

#### 상태 관리
- **Zustand**: 5.0.0 이상 (클라이언트 상태 관리)
- **React Query (@tanstack/react-query)**: 5.74.0 이상 (서버 상태 관리)

#### 스타일링
- **TailwindCSS**: 3.4.17 이상
- **shadcn/ui**: UI 컴포넌트 라이브러리
- **Radix UI**: 접근성 기반 UI 프리미티브

#### 폼 관리
- **React Hook Form**: 7.53.0 이상
- **Zod**: 3.24.1 이상 (스키마 검증)

#### API 클라이언트
- **Axios**: 1.7.9 이상

#### 테스트
- **Jest**: 29.7.0 이상 (단위 테스트)
- **React Testing Library**: 16.1.0 이상
- **Playwright**: 1.49.0 이상 (E2E 테스트)

#### 코드 품질
- **ESLint**: 9.17.0 이상
- **Prettier**: 3.5.3 이상
- **TypeScript**: 엄격 모드 활성화

### 1.4 VS Code 확장 프로그램 (권장)

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar) (Vue 사용 시)
- Error Lens
- GitLens

### 1.5 VS Code 설정

프로젝트 루트에 `.vscode/settings.json` 파일을 생성하여 팀 공통 설정을 관리합니다:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

---

## 2. 프로젝트 구조

### 2.1 디렉토리 구조

```
src/
├── assets/              # 정적 자산 (이미지, 폰트 등)
├── components/          # React 컴포넌트
│   ├── common/          # 공통 컴포넌트
│   ├── layout/          # 레이아웃 컴포넌트
│   └── ui/              # shadcn/ui 컴포넌트
├── configs/             # 설정 파일
│   ├── env.ts           # 환경 변수 설정
│   └── api.ts           # API 클라이언트 설정
├── hooks/               # 커스텀 React Hooks
├── lib/                 # 유틸리티 함수
│   └── utils.ts         # 공통 유틸리티
├── pages/               # 페이지 컴포넌트
├── routers/             # 라우팅 설정
├── schemas/             # Zod 검증 스키마
├── services/            # API 서비스 레이어
│   ├── weather/         # 날씨 API 서비스
│   └── places/          # Google Places API 서비스
├── stores/              # Zustand 스토어
├── test/                # 테스트 유틸리티 및 설정
│   ├── setup.ts         # 테스트 설정
│   └── utils.tsx        # 테스트 헬퍼 함수
└── types/               # TypeScript 타입 정의
    ├── weather.ts       # 날씨 관련 타입
    └── places.ts        # 장소 관련 타입
```

### 2.2 파일 네이밍 규칙

- **컴포넌트**: PascalCase (예: `WeatherCard.tsx`)
- **유틸리티 함수**: camelCase (예: `formatTemperature.ts`)
- **타입 정의**: camelCase (예: `weatherTypes.ts`)
- **상수**: UPPER_SNAKE_CASE (예: `API_ENDPOINTS.ts`)
- **테스트 파일**: `*.test.ts` 또는 `*.test.tsx` (예: `WeatherCard.test.tsx`)

### 2.3 모듈 구조 규칙

각 기능 모듈은 다음과 같은 구조를 따릅니다:

```
services/weather/
├── index.ts              # Public API (export)
├── weatherService.ts     # 서비스 로직
├── weatherTypes.ts       # 타입 정의
└── weatherUtils.ts       # 유틸리티 함수
```

---

## 3. 코드 작성 규칙

### 3.1 TypeScript 규칙

#### 엄격 모드
- `strict: true` 활성화
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`

#### 타입 정의
- 명시적 타입 선언을 우선하되, 타입 추론이 명확한 경우 생략 가능
- `any` 타입 사용 금지 (불가피한 경우 `unknown` 사용)
- 인터페이스는 객체 타입 정의에 사용
- 타입 별칭은 유니온, 교차 타입 등에 사용

```typescript
// ✅ 좋은 예
interface WeatherInfo {
  location: {
    name: string;
    lat: number;
    lon: number;
  };
  current: {
    temp: number;
    feelsLike: number;
  };
}

// ❌ 나쁜 예
const weather: any = { ... };
```

#### Path Alias 사용
- 절대 경로는 `@/` alias 사용
- 상대 경로는 같은 디렉토리 내에서만 사용

```typescript
// ✅ 좋은 예
import { WeatherCard } from '@/components/common/WeatherCard';
import { formatTemperature } from '@/lib/utils';

// ❌ 나쁜 예
import { WeatherCard } from '../../../components/common/WeatherCard';
```

### 3.2 React 컴포넌트 규칙

#### 함수 컴포넌트 사용
- 클래스 컴포넌트 대신 함수 컴포넌트 사용
- React.FC 타입은 선택적으로 사용 (props 타입을 명시적으로 정의하는 것을 권장)

```typescript
// ✅ 좋은 예
interface WeatherCardProps {
  weather: WeatherInfo;
  onSelect?: (weather: WeatherInfo) => void;
}

export const WeatherCard = ({ weather, onSelect }: WeatherCardProps) => {
  return <div>...</div>;
};

// 또는
export function WeatherCard({ weather, onSelect }: WeatherCardProps) {
  return <div>...</div>;
}
```

#### Props 타입 정의
- Props는 인터페이스로 명시적으로 정의
- Optional props는 `?` 사용

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}
```

#### Hooks 사용 규칙
- 커스텀 Hook은 `use` 접두사 사용
- Hook은 컴포넌트 최상위에서만 호출
- 조건부 Hook 호출 금지

```typescript
// ✅ 좋은 예
export const useWeather = (location: Location) => {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  // ...
  return { weather, isLoading, error };
};

// ❌ 나쁜 예
if (condition) {
  const [state, setState] = useState(); // 조건부 Hook 호출 금지
}
```

#### 메모이제이션
- `React.memo`는 props가 자주 변경되지 않는 경우에만 사용
- `useMemo`는 계산 비용이 큰 경우에만 사용
- `useCallback`은 자식 컴포넌트에 함수를 전달할 때 사용

```typescript
// ✅ 좋은 예
const MemoizedCard = React.memo(WeatherCard);

const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

const handleClick = useCallback(() => {
  onClick(id);
}, [id, onClick]);
```

### 3.3 네이밍 규칙

#### 변수 및 함수
- camelCase 사용
- 의미 있는 이름 사용
- 약어 사용 최소화

```typescript
// ✅ 좋은 예
const currentTemperature = 25;
const fetchWeatherData = async () => { ... };
const isWeatherLoading = true;

// ❌ 나쁜 예
const temp = 25;
const getData = async () => { ... };
const loading = true;
```

#### 상수
- UPPER_SNAKE_CASE 사용
- 모듈 상수는 별도 파일로 관리

```typescript
// ✅ 좋은 예
export const API_BASE_URL = 'https://api.openweathermap.org';
export const MAX_RECOMMENDATIONS = 20;
export const DEFAULT_RECOMMENDATIONS = 3;
```

#### 컴포넌트
- PascalCase 사용
- 명확하고 구체적인 이름 사용

```typescript
// ✅ 좋은 예
export const WeatherCard = () => { ... };
export const PlaceRecommendationList = () => { ... };

// ❌ 나쁜 예
export const Card = () => { ... };
export const List = () => { ... };
```

### 3.4 주석 규칙

#### JSDoc 주석
- 공개 API에는 JSDoc 주석 작성
- 복잡한 로직에는 설명 주석 추가

```typescript
/**
 * 날씨 정보를 기반으로 장소를 추천합니다.
 *
 * @param weather - 현재 날씨 정보
 * @param location - 검색 위치 (좌표)
 * @param count - 추천 개수 (기본값: 3)
 * @returns 추천 장소 목록
 */
export async function recommendPlaces(
  weather: WeatherInfo,
  location: Location,
  count: number = 3
): Promise<PlaceInfo[]> {
  // ...
}
```

#### 인라인 주석
- "왜"를 설명하는 주석 작성 ("무엇"을 설명하는 주석은 코드로 표현)
- TODO, FIXME, NOTE 등의 태그 사용

```typescript
// TODO: API 응답 캐싱 구현 필요
// FIXME: 타임존 처리 로직 수정 필요
// NOTE: OpenWeatherMap API는 UTC 시간을 반환합니다
```

### 3.5 코드 포맷팅

#### Prettier 설정
프로젝트 루트의 `.prettierrc` 파일에 정의된 규칙을 따릅니다:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

#### ESLint 규칙
- `@typescript-eslint/no-unused-vars`: 사용하지 않는 변수 에러
- `react-hooks/rules-of-hooks`: Hooks 규칙 준수
- `react-refresh/only-export-components`: 컴포넌트만 export

---

## 4. 디자인 패턴

### 4.1 컴포넌트 구조 패턴

#### Container-Presenter 패턴
- Container: 로직과 상태 관리
- Presenter: UI 렌더링

```typescript
// Container
export const WeatherContainer = () => {
  const { weather, isLoading, error } = useWeather();
  const handleRefresh = () => { ... };

  return (
    <WeatherPresenter
      weather={weather}
      isLoading={isLoading}
      error={error}
      onRefresh={handleRefresh}
    />
  );
};

// Presenter
interface WeatherPresenterProps {
  weather: WeatherInfo | null;
  isLoading: boolean;
  error: Error | null;
  onRefresh: () => void;
}

export const WeatherPresenter = ({
  weather,
  isLoading,
  error,
  onRefresh,
}: WeatherPresenterProps) => {
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!weather) return null;

  return <WeatherCard weather={weather} onRefresh={onRefresh} />;
};
```

#### Compound Components 패턴
- 관련된 컴포넌트를 그룹화하여 사용

```typescript
// 사용 예시
<PlaceCard>
  <PlaceCard.Header>
    <PlaceCard.Title>장소명</PlaceCard.Title>
    <PlaceCard.Rating rating={4.5} />
  </PlaceCard.Header>
  <PlaceCard.Body>
    <PlaceCard.Address>주소</PlaceCard.Address>
    <PlaceCard.Photo src="..." />
  </PlaceCard.Body>
</PlaceCard>
```

### 4.2 상태 관리 패턴

#### 클라이언트 상태 (Zustand)
- UI 상태, 폼 상태, 사용자 설정 등

```typescript
// stores/weatherStore.ts
import { create } from 'zustand';

interface WeatherState {
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location) => void;
}

export const useWeatherStore = create<WeatherState>((set) => ({
  selectedLocation: null,
  setSelectedLocation: (location) => set({ selectedLocation: location }),
}));
```

#### 서버 상태 (React Query)
- API 데이터, 캐싱, 동기화 등

```typescript
// hooks/useWeather.ts
import { useQuery } from '@tanstack/react-query';
import { weatherService } from '@/services/weather';

export const useWeather = (location: Location) => {
  return useQuery({
    queryKey: ['weather', location.lat, location.lon],
    queryFn: () => weatherService.getCurrentWeather(location),
    staleTime: 5 * 60 * 1000, // 5분
    enabled: !!location,
  });
};
```

### 4.3 API 서비스 레이어 패턴

#### 서비스 모듈 구조
각 API는 독립적인 서비스 모듈로 구성:

```typescript
// services/weather/weatherService.ts
import { apiClient } from '@/configs/api';
import type { WeatherInfo, Location } from '@/types/weather';

export const weatherService = {
  async getCurrentWeather(location: Location): Promise<WeatherInfo> {
    const response = await apiClient.get('/weather', {
      params: {
        lat: location.lat,
        lon: location.lon,
      },
    });
    return response.data;
  },

  async getForecast(location: Location): Promise<ForecastInfo> {
    // ...
  },
};
```

### 4.4 에러 바운더리 패턴

```typescript
// components/common/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

---

## 5. 스타일링 규칙

### 5.1 TailwindCSS 사용 규칙

#### 클래스 순서
- Prettier 플러그인(`prettier-plugin-tailwindcss`)이 자동 정렬
- 수동 정렬 시: 레이아웃 → 스타일링 → 인터랙션 순서

```typescript
// ✅ 좋은 예
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg">
  ...
</div>
```

#### 반응형 디자인
- Mobile First 접근 방식
- Breakpoint: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  ...
</div>
```

#### 커스텀 클래스
- 반복되는 스타일은 `@apply` 또는 컴포넌트로 추출

```css
/* ❌ 나쁜 예 - 반복 */
<div className="flex items-center gap-2 p-4 bg-white rounded-lg">
<div className="flex items-center gap-2 p-4 bg-white rounded-lg">

/* ✅ 좋은 예 - 컴포넌트 추출 */
const Card = ({ children, className }) => (
  <div className={cn("flex items-center gap-2 p-4 bg-white rounded-lg", className)}>
    {children}
  </div>
);
```

### 5.2 shadcn/ui 컴포넌트 사용

- shadcn/ui 컴포넌트는 `@/components/ui`에 위치
- 필요에 따라 커스터마이징 가능
- 기본 스타일은 TailwindCSS 변수로 관리

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
```

### 5.3 다크 모드 지원

- TailwindCSS의 `dark:` 접두사 사용
- CSS 변수를 통한 테마 관리

```typescript
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  ...
</div>
```

---

## 6. 환경 변수 관리

### 6.1 환경 변수 파일

프로젝트 루트에 다음 파일들을 생성합니다:

- `.env.development`: 개발 환경 변수
- `.env.production`: 프로덕션 환경 변수

환경 변수 설정 방법은 [환경 변수 설정 가이드](./ENV_TEMPLATE.md)를 참고하세요.

### 6.2 환경 변수 네이밍

Vite는 `VITE_` 접두사를 사용하는 환경 변수만 클라이언트에 노출됩니다:

```env
# .env.development
VITE_OPENWEATHER_API_KEY=your_api_key_here
VITE_GOOGLE_PLACES_API_KEY=your_api_key_here
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 6.3 환경 변수 타입 안전성

`configs/env.ts`에서 환경 변수를 타입 안전하게 관리:

```typescript
// configs/env.ts
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value || defaultValue || '';
};

export const env = {
  OPENWEATHER_API_KEY: getEnvVar('VITE_OPENWEATHER_API_KEY'),
  GOOGLE_PLACES_API_KEY: getEnvVar('VITE_GOOGLE_PLACES_API_KEY'),
  GOOGLE_MAPS_API_KEY: getEnvVar('VITE_GOOGLE_MAPS_API_KEY'),
} as const;
```

### 6.4 보안 주의사항

- `.env` 파일은 `.gitignore`에 포함
- API 키는 절대 코드에 하드코딩하지 않음
- Google Places API는 API 키 제한 설정 필수 (HTTP 리퍼러, 도메인 제한)

---

## 7. Git 워크플로우

### 7.1 브랜치 전략

- `main`: 프로덕션 배포 브랜치
- `develop`: 개발 통합 브랜치
- `feature/*`: 기능 개발 브랜치
- `fix/*`: 버그 수정 브랜치
- `hotfix/*`: 긴급 수정 브랜치

### 7.2 커밋 메시지 규칙

#### Conventional Commits 형식

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Type
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅 (기능 변경 없음)
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드 설정, 패키지 관리 등

#### 예시

```bash
feat(weather): 날씨 정보 조회 기능 추가

- OpenWeatherMap API 연동
- 현재 위치 기반 날씨 조회
- 날씨 카드 컴포넌트 구현

Closes #123
```

### 7.3 Pull Request 규칙

- PR 제목은 커밋 메시지와 동일한 형식
- PR 설명에는 변경 사항, 테스트 방법, 스크린샷 포함
- 최소 1명의 코드 리뷰 필요
- CI/CD 체크 통과 필수

---

## 8. 테스트 전략

### 8.1 테스트 유형

#### 단위 테스트 (Jest + React Testing Library)
- 컴포넌트 렌더링 테스트
- 유틸리티 함수 테스트
- 커스텀 Hook 테스트

```typescript
// components/common/WeatherCard.test.tsx
import { render, screen } from '@testing-library/react';
import { WeatherCard } from './WeatherCard';

describe('WeatherCard', () => {
  it('renders weather information correctly', () => {
    const weather = {
      location: { name: 'Seoul', lat: 37.5665, lon: 126.9780 },
      current: { temp: 25, feelsLike: 27 },
    };

    render(<WeatherCard weather={weather} />);

    expect(screen.getByText('Seoul')).toBeInTheDocument();
    expect(screen.getByText('25°C')).toBeInTheDocument();
  });
});
```

#### 통합 테스트
- 여러 컴포넌트 간 상호작용 테스트
- API 호출 및 상태 관리 통합 테스트

#### E2E 테스트 (Playwright)
- 사용자 시나리오 기반 테스트
- 실제 브라우저 환경에서 테스트

```typescript
// e2e/weather.spec.ts
import { test, expect } from '@playwright/test';

test('사용자가 날씨 정보를 조회할 수 있다', async ({ page }) => {
  await page.goto('/');
  await page.click('button:has-text("현재 위치 사용")');
  await expect(page.locator('[data-testid="weather-card"]')).toBeVisible();
});
```

### 8.2 테스트 커버리지

- 목표 커버리지: 80% 이상
- 핵심 비즈니스 로직: 100% 커버리지 목표

### 8.3 테스트 실행

```bash
# 단위 테스트
yarn test

# Watch 모드
yarn test:watch

# 커버리지 리포트
yarn test --coverage

# E2E 테스트
yarn test:e2e

# E2E 테스트 (헤드 모드)
yarn test:e2e:headed
```

---

## 9. API 호출 패턴

### 9.1 Axios 설정

```typescript
// configs/api.ts
import axios from 'axios';
import { env } from './env';

export const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // API 키 추가 등
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 에러 처리
    return Promise.reject(error);
  }
);
```

### 9.2 React Query 사용 패턴

```typescript
// hooks/useWeather.ts
import { useQuery } from '@tanstack/react-query';
import { weatherService } from '@/services/weather';

export const useWeather = (location: Location | null) => {
  return useQuery({
    queryKey: ['weather', location?.lat, location?.lon],
    queryFn: () => weatherService.getCurrentWeather(location!),
    enabled: !!location,
    staleTime: 5 * 60 * 1000, // 5분
    retry: 2,
  });
};
```

### 9.3 API 서비스 구조

```typescript
// services/weather/index.ts
export { weatherService } from './weatherService';
export type { WeatherInfo, ForecastInfo } from './weatherTypes';

// services/weather/weatherService.ts
import { apiClient } from '@/configs/api';
import { env } from '@/configs/env';
import type { WeatherInfo, Location } from './weatherTypes';

export const weatherService = {
  async getCurrentWeather(location: Location): Promise<WeatherInfo> {
    const response = await apiClient.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          lat: location.lat,
          lon: location.lon,
          appid: env.OPENWEATHER_API_KEY,
          units: 'metric',
          lang: 'kr',
        },
      }
    );
    return transformWeatherResponse(response.data);
  },
};
```

---

## 10. 에러 처리

### 10.1 에러 타입 정의

```typescript
// types/errors.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

### 10.2 에러 처리 패턴

#### API 에러 처리

```typescript
// services/weather/weatherService.ts
import { ApiError } from '@/types/errors';

export const weatherService = {
  async getCurrentWeather(location: Location): Promise<WeatherInfo> {
    try {
      const response = await apiClient.get('/weather', { params: location });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.message,
          error.response?.status || 500,
          error.response?.data
        );
      }
      throw error;
    }
  },
};
```

#### 컴포넌트 에러 처리

```typescript
// components/WeatherDisplay.tsx
export const WeatherDisplay = () => {
  const { data: weather, error, isLoading } = useWeather(location);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!weather) return <EmptyState />;

  return <WeatherCard weather={weather} />;
};
```

### 10.3 에러 바운더리

```typescript
// App.tsx
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </ErrorBoundary>
  );
}
```

---

## 부록

### A. 유용한 명령어

```bash
# 개발 서버 실행
yarn dev

# 빌드
yarn build

# 타입 체크
yarn type-check

# 린트
yarn lint
yarn lint:fix

# 테스트
yarn test
yarn test:watch
yarn test:e2e
```

### B. 참고 문서

- [요구사항 명세서](./req.md)
- [OpenWeatherMap API 문서](./api_docs/open_weather_api.md)
- [Google Places API 문서](./api_docs/google-place-api-text-search.md)
- [React 공식 문서](https://react.dev)
- [TypeScript 공식 문서](https://www.typescriptlang.org)
- [TailwindCSS 공식 문서](https://tailwindcss.com)
- [React Query 공식 문서](https://tanstack.com/query)

### C. 체크리스트

#### 새 기능 개발 시
- [ ] 요구사항 명세서 확인
- [ ] 타입 정의 작성
- [ ] 테스트 작성
- [ ] 문서 업데이트
- [ ] 코드 리뷰 요청

#### PR 제출 전
- [ ] 타입 체크 통과 (`yarn type-check`)
- [ ] 린트 통과 (`yarn lint`)
- [ ] 테스트 통과 (`yarn test`)
- [ ] 빌드 성공 (`yarn build`)
- [ ] 커밋 메시지 규칙 준수

---

**마지막 업데이트**: 2025-12-02
