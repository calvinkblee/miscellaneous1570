# 📄 HTML to PDF 변환기

HTML 문서를 PDF로 변환할 때 **배경색을 완벽하게 유지**하는 도구입니다.

브라우저에서 인쇄할 때 배경색이 사라지는 문제를 해결합니다!

## ✨ 특징

- 🎨 **배경색 완벽 유지** - `printBackground: true` 옵션으로 모든 배경색 보존
- 🌐 **웹 UI 제공** - 드래그 앤 드롭으로 쉽게 변환
- 💻 **CLI 지원** - 커맨드라인에서 빠르게 변환
- 📁 **일괄 변환** - 폴더 내 모든 HTML 파일 한번에 변환
- 🔗 **URL 지원** - 웹페이지 URL을 직접 PDF로 변환

## 🚀 설치

```bash
cd html2pdf
npm install
```

## 📖 사용법

### 웹 UI 사용 (권장)

```bash
npm start
```

브라우저에서 http://localhost:3030 접속

### CLI 사용

```bash
# 단일 파일 변환
node cli.js document.html

# 출력 파일명 지정
node cli.js document.html output.pdf

# 옵션 지정
node cli.js document.html --format A3 --landscape --margin 20mm

# URL 변환
node cli.js https://example.com webpage.pdf

# 폴더 일괄 변환
node cli.js --batch ./html_files ./pdf_output
```

### CLI 옵션

| 옵션 | 설명 | 기본값 |
|------|------|--------|
| `--format` | 페이지 크기 (A4, A3, Letter 등) | A4 |
| `--landscape` | 가로 모드 | false |
| `--margin` | 여백 (예: 10mm, 1in) | 10mm |
| `--scale` | 스케일 (0.1 ~ 2) | 1 |
| `--batch` | 폴더 일괄 변환 모드 | - |

## 🛠️ 프로그래밍 방식 사용

```javascript
const { convertHtmlToPdf } = require('./converter');

// HTML 문자열 변환
await convertHtmlToPdf({
  input: '<html><body style="background: #3498db;">Hello</body></html>',
  output: 'output.pdf'
});

// HTML 파일 변환
await convertHtmlToPdf({
  input: './document.html',
  output: 'output.pdf',
  format: 'A4',
  landscape: false,
  margin: '10mm'
});

// URL 변환
await convertHtmlToPdf({
  input: 'https://example.com',
  output: 'webpage.pdf'
});
```

## 💡 배경색이 유지되는 이유

Puppeteer의 `printBackground: true` 옵션을 사용합니다:

```javascript
await page.pdf({
  printBackground: true,  // 🔑 핵심 옵션!
  // ... 기타 옵션
});
```

브라우저의 기본 인쇄 설정은 잉크 절약을 위해 배경색을 제거하지만,
이 옵션을 사용하면 화면에 보이는 그대로 PDF가 생성됩니다.

## 📋 요구사항

- Node.js 16.0.0 이상
- Puppeteer가 Chromium을 자동 다운로드합니다 (첫 실행 시)

## 📁 프로젝트 구조

```
html2pdf/
├── package.json      # 의존성 관리
├── converter.js      # 핵심 변환 로직
├── cli.js           # CLI 인터페이스
├── server.js        # 웹 서버
├── index.html       # 웹 UI
└── README.md        # 문서
```

## 🔧 문제 해결

### Puppeteer 설치 오류

```bash
# macOS에서 권한 문제 시
sudo npm install -g puppeteer --unsafe-perm=true
```

### 메모리 부족

대용량 HTML 변환 시 Node.js 메모리 한도 증가:

```bash
NODE_OPTIONS="--max-old-space-size=4096" node cli.js large-file.html
```

