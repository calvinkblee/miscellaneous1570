# 🔬 Deep Research Bot

CEO를 위한 AI 기반 딥 리서치 서비스입니다. 등록된 키워드를 기반으로 매일 유튜브, 뉴스, 블로그, 논문, 팟캐스트에서 관련 콘텐츠를 수집하고 AI가 분석하여 공유할 가치가 있는 콘텐츠를 추천합니다.

## ✨ 주요 기능

### 📊 콘텐츠 수집
- **YouTube**: 키워드 관련 영상 검색 및 수집
- **뉴스**: 국내외 IT/AI 뉴스 RSS 피드 모니터링
- **블로그**: 주요 기술 블로그 및 Medium 글 수집
- **논문**: arXiv, Papers With Code에서 최신 연구 논문 수집
- **팟캐스트**: AI/Tech 관련 팟캐스트 에피소드 수집

### 🤖 AI 분석 (OpenAI GPT-4)
1. **요약**: 핵심 내용 3-4문장 요약
2. **인사이트**: 비즈니스/기술적 관점의 핵심 포인트 추출
3. **비즈니스 연관성**: 기업에게 왜 중요한지 분석
4. **공유 가치 점수**: 0-100점으로 슬랙 공유 추천도 평가

### 🏷️ 키워드 관리
- 키워드 추가/수정/삭제
- 키워드별 활성화/비활성화
- 키워드별 개별 리서치 실행

### 📈 대시보드
- 전체 통계 현황
- 소스별 콘텐츠 분포
- 최근 리서치 기록
- 일일 다이제스트

## 🚀 시작하기

### 1. 환경 설정

```bash
cd deep-research-bot

# 가상환경 생성 (권장)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# 필수: OpenAI API Key
OPENAI_API_KEY=your-openai-api-key-here

# 선택: YouTube Data API Key (더 정확한 유튜브 검색)
YOUTUBE_API_KEY=your-youtube-api-key-here

# 앱 설정
APP_HOST=127.0.0.1
APP_PORT=8000
DEBUG=true

# 리서치 설정
DAILY_CONTENT_LIMIT=100
RESEARCH_SCHEDULE_HOUR=9
```

### 3. 실행

```bash
python main.py
```

브라우저에서 http://127.0.0.1:8000 접속

## 📱 사용 방법

### 키워드 등록
1. 상단 메뉴에서 "키워드" 클릭
2. "+ 키워드 추가" 버튼 클릭
3. 키워드명과 설명 입력 후 저장

### 리서치 실행
- **전체 실행**: 우측 상단 "리서치 실행" 버튼
- **개별 실행**: 키워드 페이지에서 각 키워드의 "🔍 리서치" 버튼

### 콘텐츠 확인
1. "콘텐츠" 메뉴에서 수집된 모든 콘텐츠 확인
2. 필터로 소스/언어/점수/키워드별 필터링
3. 상세 페이지에서 AI 분석 결과 확인

### 다이제스트
- "다이제스트" 메뉴에서 오늘의 핵심 요약 확인

## 🔧 API 엔드포인트

### 키워드 관리
- `GET /api/keywords` - 키워드 목록
- `POST /api/keywords` - 키워드 생성
- `PUT /api/keywords/{id}` - 키워드 수정
- `DELETE /api/keywords/{id}` - 키워드 삭제

### 콘텐츠
- `GET /api/contents` - 콘텐츠 목록 (필터/정렬 지원)
- `GET /api/contents/{id}` - 콘텐츠 상세
- `POST /api/contents/{id}/star` - 즐겨찾기 토글
- `POST /api/contents/{id}/share` - 공유 완료 표시

### 리서치
- `POST /api/research/run` - 전체 리서치 실행
- `POST /api/research/keyword/{id}` - 특정 키워드 리서치
- `GET /api/research/logs` - 리서치 로그

### 기타
- `GET /api/stats` - 대시보드 통계
- `GET /api/digest` - 일일 다이제스트

## 📂 프로젝트 구조

```
deep-research-bot/
├── main.py                 # 앱 진입점
├── requirements.txt        # Python 의존성
├── .env                    # 환경 변수 (직접 생성)
├── data/                   # SQLite DB 저장 위치
├── logs/                   # 로그 파일
└── app/
    ├── config.py           # 설정
    ├── api/
    │   └── routes.py       # API 라우트
    ├── models/
    │   └── database.py     # DB 모델
    ├── services/
    │   ├── analyzer.py     # AI 분석
    │   ├── researcher.py   # 리서치 오케스트레이터
    │   └── collectors/     # 소스별 수집기
    │       ├── youtube.py
    │       ├── news.py
    │       ├── blog.py
    │       ├── paper.py
    │       └── podcast.py
    ├── templates/          # Jinja2 HTML 템플릿
    └── static/             # CSS, JS 파일
```

## 🎯 점수 기준

| 점수 | 등급 | 의미 |
|------|------|------|
| 80-100 | 🔥 강력 추천 | 반드시 공유해야 할 획기적인 인사이트 |
| 60-79 | 👍 추천 | 공유할 가치가 있는 유용한 정보 |
| 40-59 | 📌 참고 | 선택적으로 공유 가능한 일반 정보 |
| 0-39 | 📎 비추천 | 공유 가치가 낮은 콘텐츠 |

## 🔄 자동 스케줄링

앱 실행 시 매일 지정된 시간(기본 오전 9시)에 자동으로 리서치가 실행됩니다.
`RESEARCH_SCHEDULE_HOUR` 환경 변수로 시간을 변경할 수 있습니다.

## 🛠️ 향후 개선 계획

- [ ] 슬랙 연동 (자동 포스팅)
- [ ] 콘텐츠 내보내기 (CSV, JSON)
- [ ] 이메일 알림
- [ ] 키워드 조합 검색
- [ ] 콘텐츠 중요도 학습

## 📝 라이선스

MIT License

