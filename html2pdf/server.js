const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { convertHtmlToPdf } = require('./converter');

const app = express();
const PORT = process.env.PORT || 3030;

// 업로드 설정
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB 제한
});

// CORS 허용
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// 미들웨어
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 요청 로깅
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 404 핸들러를 위한 정적 파일 (public 폴더가 없어도 됨)
// app.use(express.static(path.join(__dirname, 'public')));

// 메인 페이지
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// HTML 문자열을 PDF로 변환
app.post('/api/convert', async (req, res) => {
  try {
    const { html, options = {} } = req.body;

    console.log('변환 요청 받음, HTML 길이:', html ? html.length : 0);

    if (!html) {
      return res.status(400).json({ error: 'HTML 내용이 필요합니다.' });
    }

    const pdfBuffer = await convertHtmlToPdf({
      input: html,
      format: options.format || 'A4',
      landscape: options.landscape || false,
      margin: options.margin || '10mm',
      scale: options.scale || 1
    });

    // Buffer인지 확인하고 변환
    const buffer = Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);
    console.log('PDF 생성 완료, 크기:', buffer.length);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="document.pdf"`);
    res.end(buffer);

  } catch (error) {
    console.error('변환 오류:', error.message, error.stack);
    res.status(500).json({ error: error.message });
  }
});

// HTML 파일 업로드 후 PDF로 변환
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '파일이 필요합니다.' });
    }

    const options = {
      format: req.body.format || 'A4',
      landscape: req.body.landscape === 'true',
      margin: req.body.margin || '10mm',
      scale: parseFloat(req.body.scale) || 1
    };

    // 업로드된 HTML 파일 읽기
    const htmlContent = fs.readFileSync(req.file.path, 'utf8');

    const pdfBuffer = await convertHtmlToPdf({
      input: htmlContent,
      ...options
    });

    // 임시 파일 삭제
    fs.unlinkSync(req.file.path);

    const originalName = path.basename(req.file.originalname, path.extname(req.file.originalname));
    
    // Buffer인지 확인하고 변환
    const buffer = Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);
    console.log('업로드 PDF 생성 완료, 크기:', buffer.length);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(originalName)}.pdf"`);
    res.end(buffer);

  } catch (error) {
    console.error('업로드 변환 오류:', error);
    
    // 임시 파일 정리
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: error.message });
  }
});

// URL을 PDF로 변환
app.post('/api/url', async (req, res) => {
  try {
    const { url, options = {} } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL이 필요합니다.' });
    }

    const pdfBuffer = await convertHtmlToPdf({
      input: url,
      format: options.format || 'A4',
      landscape: options.landscape || false,
      margin: options.margin || '10mm',
      scale: options.scale || 1
    });

    const filename = new URL(url).hostname.replace(/\./g, '_');
    
    // Buffer인지 확인하고 변환
    const buffer = Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
    res.end(buffer);

  } catch (error) {
    console.error('URL 변환 오류:', error);
    res.status(500).json({ error: error.message });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   📄 HTML to PDF 변환기                           ║
║   배경색 완벽 유지!                               ║
║                                                   ║
║   🌐 http://localhost:${PORT}                      ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
  `);
});

