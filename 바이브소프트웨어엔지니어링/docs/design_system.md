# 🎨 날씨 맞춤 음식점 추천 서비스 - UI 디자인 시스템 v1.0

## 📋 문서 정보

| 항목 | 내용 |
|------|------|
| **문서명** | UI 디자인 시스템 가이드 |
| **버전** | 1.0 |
| **작성일** | 2024년 12월 4일 |
| **관련 문서** | request_1.md (요구사항 명세서) |

---

## 1. 디자인 철학

### 1.1 핵심 원칙

| 원칙 | 설명 |
|------|------|
| **🌡️ 날씨 반응형** | 현재 날씨에 따라 분위기가 자연스럽게 변화하는 감성적 UI |
| **🍜 따뜻한 친근함** | 음식과 식사의 즐거움을 전달하는 편안한 디자인 |
| **⚡ 빠른 의사결정** | 복잡한 탐색 없이 빠르게 음식점을 선택할 수 있는 직관적 구조 |
| **📱 모바일 우선** | 외출 중 사용을 고려한 모바일 최적화 |

### 1.2 디자인 무드

```
키워드: 따뜻함 · 자연스러움 · 맛있는 · 계절감 · 편안함
```

- 날씨와 음식이 주는 감각적 경험을 시각적으로 표현
- 과하지 않고 절제된 색상 사용으로 음식 사진이 돋보이게
- 부드러운 곡선과 자연스러운 그림자로 친근한 느낌

---

## 2. 컬러 시스템

### 2.1 기본 컬러 팔레트

#### Primary Colors (주요 색상)

| 이름 | HEX | RGB | 용도 |
|------|-----|-----|------|
| **Warm Orange** | `#FF6B35` | 255, 107, 53 | 주요 CTA, 강조 요소 |
| **Warm Orange Light** | `#FF8C5A` | 255, 140, 90 | 호버 상태 |
| **Warm Orange Dark** | `#E55A2B` | 229, 90, 43 | 클릭 상태 |

#### Secondary Colors (보조 색상)

| 이름 | HEX | RGB | 용도 |
|------|-----|-----|------|
| **Deep Brown** | `#5D4037` | 93, 64, 55 | 텍스트, 아이콘 |
| **Cream** | `#FFF8F0` | 255, 248, 240 | 배경 |
| **Soft Beige** | `#F5E6D3` | 245, 230, 211 | 카드 배경 |

#### Neutral Colors (중립 색상)

| 이름 | HEX | 용도 |
|------|-----|------|
| **Gray 900** | `#1A1A1A` | 제목 텍스트 |
| **Gray 700** | `#4A4A4A` | 본문 텍스트 |
| **Gray 500** | `#7A7A7A` | 보조 텍스트 |
| **Gray 300** | `#B0B0B0` | 비활성 상태 |
| **Gray 100** | `#F0F0F0` | 구분선, 배경 |
| **White** | `#FFFFFF` | 카드, 모달 배경 |

#### Semantic Colors (의미 색상)

| 이름 | HEX | 용도 |
|------|-----|------|
| **Success** | `#4CAF50` | 성공, 영업 중 |
| **Warning** | `#FFC107` | 경고, 주의 |
| **Error** | `#F44336` | 오류, 영업 종료 |
| **Info** | `#2196F3` | 정보 |

### 2.2 날씨별 테마 컬러

날씨 상태에 따라 배경 그라데이션과 액센트 색상이 변경됩니다.

#### ☀️ 맑은 날 (Clear)

```css
--weather-gradient: linear-gradient(180deg, #87CEEB 0%, #FFF8DC 100%);
--weather-accent: #FFD700;
--weather-text: #5D4037;
```

#### ☁️ 흐린 날 (Clouds)

```css
--weather-gradient: linear-gradient(180deg, #B0C4DE 0%, #E8E8E8 100%);
--weather-accent: #708090;
--weather-text: #4A4A4A;
```

#### 🌧️ 비 오는 날 (Rain)

```css
--weather-gradient: linear-gradient(180deg, #4A6572 0%, #7B8D93 100%);
--weather-accent: #5C9EAD;
--weather-text: #FFFFFF;
```

#### ❄️ 눈 오는 날 (Snow)

```css
--weather-gradient: linear-gradient(180deg, #E8F4F8 0%, #FFFFFF 100%);
--weather-accent: #A5D8E6;
--weather-text: #4A6572;
```

#### 🌡️ 더운 날 (Hot, 25°C+)

```css
--weather-gradient: linear-gradient(180deg, #FF9A56 0%, #FFCD67 100%);
--weather-accent: #FF6B35;
--weather-text: #5D4037;
```

#### 🥶 추운 날 (Cold, 5°C-)

```css
--weather-gradient: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
--weather-accent: #9B59B6;
--weather-text: #FFFFFF;
```

### 2.3 CSS 변수 정의

```css
:root {
  /* Primary */
  --color-primary: #FF6B35;
  --color-primary-light: #FF8C5A;
  --color-primary-dark: #E55A2B;
  
  /* Secondary */
  --color-secondary: #5D4037;
  --color-background: #FFF8F0;
  --color-surface: #FFFFFF;
  --color-surface-variant: #F5E6D3;
  
  /* Text */
  --color-text-primary: #1A1A1A;
  --color-text-secondary: #4A4A4A;
  --color-text-tertiary: #7A7A7A;
  --color-text-disabled: #B0B0B0;
  
  /* Semantic */
  --color-success: #4CAF50;
  --color-warning: #FFC107;
  --color-error: #F44336;
  --color-info: #2196F3;
  
  /* Weather (동적 변경) */
  --weather-gradient: linear-gradient(180deg, #87CEEB 0%, #FFF8DC 100%);
  --weather-accent: #FFD700;
}
```

---

## 3. 타이포그래피

### 3.1 폰트 패밀리

```css
/* 한글 + 영문 조합 */
--font-family-primary: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* 숫자 및 강조용 */
--font-family-display: 'Outfit', 'Pretendard', sans-serif;
```

#### 폰트 선택 이유

| 폰트 | 용도 | 특징 |
|------|------|------|
| **Pretendard** | 본문, UI 전반 | 한글 가독성 우수, 다양한 웨이트 |
| **Outfit** | 숫자, 영문 강조 | 현대적이고 둥근 느낌, 온도/평점 표시에 적합 |

### 3.2 타입 스케일

| 이름 | 크기 (rem) | px 환산 | 웨이트 | 행간 | 용도 |
|------|-----------|---------|--------|------|------|
| **Display** | 2.5 | 40px | 700 | 1.2 | 메인 히어로 텍스트 |
| **H1** | 2 | 32px | 700 | 1.3 | 페이지 제목 |
| **H2** | 1.5 | 24px | 600 | 1.4 | 섹션 제목 |
| **H3** | 1.25 | 20px | 600 | 1.4 | 카드 제목 |
| **H4** | 1.125 | 18px | 600 | 1.5 | 소제목 |
| **Body Large** | 1.125 | 18px | 400 | 1.6 | 강조 본문 |
| **Body** | 1 | 16px | 400 | 1.6 | 기본 본문 |
| **Body Small** | 0.875 | 14px | 400 | 1.5 | 보조 텍스트 |
| **Caption** | 0.75 | 12px | 400 | 1.4 | 캡션, 레이블 |

### 3.3 타이포그래피 스타일 예시

```css
/* Display - 날씨/기온 표시 */
.text-display {
  font-family: var(--font-family-display);
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

/* 음식점 이름 */
.text-restaurant-name {
  font-family: var(--font-family-primary);
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-text-primary);
}

/* 본문 텍스트 */
.text-body {
  font-family: var(--font-family-primary);
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.6;
  color: var(--color-text-secondary);
}
```

---

## 4. 간격 시스템 (Spacing)

### 4.1 기본 단위

기본 단위: **4px** (0.25rem)

| 토큰 | 값 | 사용 예시 |
|------|-----|----------|
| `--space-1` | 4px | 아이콘-텍스트 간격 |
| `--space-2` | 8px | 인라인 요소 간격 |
| `--space-3` | 12px | 작은 요소 내부 패딩 |
| `--space-4` | 16px | 기본 패딩, 카드 내부 |
| `--space-5` | 20px | 섹션 내 요소 간격 |
| `--space-6` | 24px | 카드 간 간격 |
| `--space-8` | 32px | 섹션 간 간격 |
| `--space-10` | 40px | 큰 섹션 간 간격 |
| `--space-12` | 48px | 페이지 섹션 구분 |
| `--space-16` | 64px | 주요 영역 구분 |

### 4.2 CSS 변수

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
}
```

---

## 5. 레이아웃 시스템

### 5.1 반응형 브레이크포인트

| 이름 | 범위 | 대상 기기 |
|------|------|----------|
| **Mobile S** | 320px ~ 374px | 소형 스마트폰 |
| **Mobile** | 375px ~ 767px | 일반 스마트폰 |
| **Tablet** | 768px ~ 1023px | 태블릿 |
| **Desktop** | 1024px ~ 1439px | 노트북, 데스크톱 |
| **Desktop L** | 1440px+ | 대형 모니터 |

### 5.2 CSS 미디어 쿼리

```css
/* Mobile First 접근 */
/* 기본: Mobile (375px~) */

/* Tablet */
@media (min-width: 768px) { }

/* Desktop */
@media (min-width: 1024px) { }

/* Desktop Large */
@media (min-width: 1440px) { }
```

### 5.3 컨테이너 너비

| 브레이크포인트 | 최대 너비 | 좌우 패딩 |
|--------------|----------|----------|
| Mobile | 100% | 16px |
| Tablet | 100% | 24px |
| Desktop | 1200px | 32px |
| Desktop L | 1400px | 32px |

```css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

@media (min-width: 768px) {
  .container {
    padding: 0 var(--space-6);
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 var(--space-8);
  }
}
```

### 5.4 그리드 시스템

12컬럼 그리드 기반

```css
.grid {
  display: grid;
  gap: var(--space-4);
}

/* Mobile: 1~2 columns */
.grid-cards {
  grid-template-columns: 1fr;
}

/* Tablet: 2~3 columns */
@media (min-width: 768px) {
  .grid-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);
  }
}

/* Desktop: 3~4 columns */
@media (min-width: 1024px) {
  .grid-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## 6. 공통 컴포넌트 스타일

### 6.1 버튼 (Buttons)

#### 버튼 종류

| 종류 | 용도 | 스타일 |
|------|------|--------|
| **Primary** | 주요 액션 (검색, 확인) | 채워진 배경 + 흰색 텍스트 |
| **Secondary** | 보조 액션 | 테두리 + 색상 텍스트 |
| **Ghost** | 덜 중요한 액션 | 투명 배경 + 색상 텍스트 |
| **Icon** | 아이콘 단독 버튼 | 원형/사각형 아이콘 |

#### 버튼 크기

| 크기 | 높이 | 패딩 | 폰트 크기 |
|------|------|------|----------|
| **Small** | 32px | 12px 16px | 14px |
| **Medium** | 44px | 12px 24px | 16px |
| **Large** | 52px | 14px 32px | 18px |

#### 버튼 스타일 코드

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  border: none;
}

.btn-primary:hover {
  background: var(--color-primary-light);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
}

.btn-primary:active {
  background: var(--color-primary-dark);
  transform: translateY(0);
}

.btn-secondary {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.btn-secondary:hover {
  background: rgba(255, 107, 53, 0.1);
}
```

### 6.2 카드 (Cards)

#### 기본 카드 스타일

```css
.card {
  background: var(--color-surface);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-body {
  padding: var(--space-4);
}

.card-image {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
}
```

### 6.3 입력 필드 (Inputs)

```css
.input {
  width: 100%;
  height: 48px;
  padding: 0 var(--space-4);
  border: 2px solid var(--color-gray-100);
  border-radius: 12px;
  font-size: 1rem;
  background: var(--color-surface);
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.1);
}

.input::placeholder {
  color: var(--color-text-tertiary);
}
```

### 6.4 뱃지 (Badges)

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-open {
  background: rgba(76, 175, 80, 0.15);
  color: var(--color-success);
}

.badge-closed {
  background: rgba(244, 67, 54, 0.15);
  color: var(--color-error);
}

.badge-weather {
  background: rgba(255, 107, 53, 0.15);
  color: var(--color-primary);
}
```

### 6.5 평점 표시 (Rating)

```css
.rating {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
}

.rating-star {
  color: #FFD700;
  font-size: 1rem;
}

.rating-value {
  font-family: var(--font-family-display);
  font-weight: 600;
  color: var(--color-text-primary);
}

.rating-count {
  color: var(--color-text-tertiary);
  font-size: 0.875rem;
}
```

---

## 7. 아이콘 시스템

### 7.1 아이콘 라이브러리

**추천: Lucide Icons** 또는 **Heroicons**

- 일관된 스타일의 아웃라인 아이콘
- 다양한 사이즈 지원
- React 컴포넌트 제공

### 7.2 아이콘 크기

| 용도 | 크기 | 사용 예시 |
|------|------|----------|
| **Small** | 16px | 인라인 텍스트, 뱃지 내부 |
| **Medium** | 20px | 버튼 내부, 리스트 아이템 |
| **Default** | 24px | 내비게이션, 카드 액션 |
| **Large** | 32px | 빈 상태, 강조 아이콘 |
| **XLarge** | 48px | 날씨 아이콘, 히어로 영역 |

### 7.3 날씨 아이콘

OpenWeatherMap 아이콘 또는 커스텀 아이콘 사용

| 날씨 | 아이콘 이름 | 설명 |
|------|-----------|------|
| 맑음 | `sun` | ☀️ |
| 구름 | `cloud` | ☁️ |
| 비 | `cloud-rain` | 🌧️ |
| 눈 | `cloud-snow` | ❄️ |
| 뇌우 | `cloud-lightning` | ⛈️ |
| 안개 | `cloud-fog` | 🌫️ |

---

## 8. 그림자 시스템 (Elevation)

```css
:root {
  /* 그림자 레벨 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.12);
  
  /* 컬러 그림자 (브랜드 강조) */
  --shadow-primary: 0 4px 14px rgba(255, 107, 53, 0.25);
}
```

| 레벨 | 용도 |
|------|------|
| **sm** | 미세한 구분, 인풋 필드 |
| **md** | 카드, 드롭다운 |
| **lg** | 호버 카드, 팝오버 |
| **xl** | 모달, 플로팅 요소 |

---

## 9. 모서리 반경 (Border Radius)

```css
:root {
  --radius-sm: 8px;    /* 버튼, 뱃지, 작은 요소 */
  --radius-md: 12px;   /* 입력 필드, 버튼 */
  --radius-lg: 16px;   /* 카드 */
  --radius-xl: 24px;   /* 모달, 바텀시트 */
  --radius-full: 9999px; /* 원형 (아바타, 칩) */
}
```

---

## 10. 애니메이션 & 인터랙션

### 10.1 트랜지션

```css
:root {
  /* Duration */
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
  
  /* Easing */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### 10.2 기본 인터랙션

| 요소 | 인터랙션 | 설명 |
|------|---------|------|
| **버튼** | Hover: 위로 1px + 그림자 | 클릭 가능함을 표현 |
| **카드** | Hover: 위로 4px + 그림자 증가 | 선택 가능함을 표현 |
| **링크** | Hover: 밑줄 + 색상 변화 | 텍스트 링크 |
| **아이콘 버튼** | Hover: 배경색 추가 | 터치 영역 강조 |

### 10.3 로딩 상태

```css
/* 스켈레톤 로딩 */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-gray-100) 25%,
    var(--color-gray-50) 50%,
    var(--color-gray-100) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* 펄스 애니메이션 (날씨 아이콘용) */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

### 10.4 페이지 전환 애니메이션

```css
/* 페이드 인 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 슬라이드 업 */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 스태거 딜레이 (목록 아이템용) */
.stagger-item:nth-child(1) { animation-delay: 0ms; }
.stagger-item:nth-child(2) { animation-delay: 50ms; }
.stagger-item:nth-child(3) { animation-delay: 100ms; }
.stagger-item:nth-child(4) { animation-delay: 150ms; }
/* ... */
```

---

## 11. 접근성 가이드

### 11.1 컬러 대비

- **일반 텍스트**: 최소 4.5:1 대비율 (WCAG AA)
- **큰 텍스트 (18px+)**: 최소 3:1 대비율
- **UI 컴포넌트**: 최소 3:1 대비율

### 11.2 포커스 상태

```css
/* 키보드 포커스 링 */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* 마우스 클릭 시 포커스 링 숨기기 */
:focus:not(:focus-visible) {
  outline: none;
}
```

### 11.3 터치 타겟

- **최소 터치 영역**: 44px × 44px (iOS/Android 권장)
- 인접한 터치 타겟 간 최소 8px 간격

### 11.4 스크린 리더 지원

```html
<!-- 날씨 정보 읽기 -->
<div aria-label="현재 날씨: 맑음, 기온 22도, 습도 45%">
  ...
</div>

<!-- 평점 정보 -->
<div aria-label="평점 4.5점, 리뷰 128개">
  <span aria-hidden="true">⭐</span>
  <span>4.5</span>
</div>

<!-- 영업 상태 -->
<span class="badge-open" aria-label="현재 영업 중">
  영업 중
</span>
```

---

## 12. 다크 모드 (선택사항)

### 12.1 다크 모드 컬러

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #1A1A1A;
    --color-surface: #2D2D2D;
    --color-surface-variant: #3D3D3D;
    
    --color-text-primary: #FFFFFF;
    --color-text-secondary: #B0B0B0;
    --color-text-tertiary: #7A7A7A;
    
    /* Primary는 유지하되 밝기 조정 */
    --color-primary: #FF8C5A;
  }
}
```

---

## 13. 디자인 토큰 내보내기

### 13.1 Tailwind CSS 설정

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B35',
          light: '#FF8C5A',
          dark: '#E55A2B',
        },
        secondary: '#5D4037',
        cream: '#FFF8F0',
        beige: '#F5E6D3',
      },
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],
        display: ['Outfit', 'Pretendard', 'sans-serif'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.1)',
        'primary': '0 4px 14px rgba(255, 107, 53, 0.25)',
      },
    },
  },
}
```

---

## 14. 체크리스트

### 디자인 구현 시 확인사항

- [ ] 날씨별 테마 컬러가 올바르게 적용되는가?
- [ ] 모바일에서 터치 타겟이 44px 이상인가?
- [ ] 텍스트 대비율이 WCAG AA 기준을 충족하는가?
- [ ] 로딩 상태(스켈레톤)가 표시되는가?
- [ ] 키보드 네비게이션이 가능한가?
- [ ] 에러 상태가 명확히 표시되는가?

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|----------|--------|
| 1.0 | 2024-12-04 | 최초 작성 | - |


