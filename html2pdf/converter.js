const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

/**
 * HTML을 PDF로 변환 (배경색 완벽 유지)
 * @param {Object} options 변환 옵션
 * @param {string} options.input - HTML 파일 경로 또는 HTML 문자열
 * @param {string} options.output - 출력 PDF 파일 경로 (선택)
 * @param {string} options.format - 페이지 크기 (A4, Letter 등)
 * @param {boolean} options.landscape - 가로 모드 여부
 * @param {string} options.margin - 여백 (예: '10mm')
 * @returns {Promise<Buffer>} PDF 버퍼
 */
async function convertHtmlToPdf(options = {}) {
  const {
    input,
    output,
    format = 'A4',
    landscape = false,
    margin = '10mm',
    scale = 1,
    displayHeaderFooter = false,
    headerTemplate = '',
    footerTemplate = ''
  } = options;

  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // HTML 파일인지 URL인지 HTML 문자열인지 판단
    if (input.startsWith('http://') || input.startsWith('https://')) {
      // URL인 경우
      await page.goto(input, { waitUntil: 'networkidle0' });
    } else if (fs.existsSync(input)) {
      // 파일 경로인 경우
      const absolutePath = path.resolve(input);
      const htmlContent = fs.readFileSync(absolutePath, 'utf8');
      
      // 파일의 디렉토리를 base URL로 설정하여 상대 경로 리소스 로드
      const baseUrl = `file://${path.dirname(absolutePath)}/`;
      await page.goto(baseUrl, { waitUntil: 'networkidle0' });
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    } else {
      // HTML 문자열인 경우
      await page.setContent(input, { waitUntil: 'networkidle0' });
    }

    // 페이지가 완전히 로드될 때까지 대기
    await page.evaluate(() => {
      return new Promise((resolve) => {
        if (document.readyState === 'complete') {
          resolve();
        } else {
          window.addEventListener('load', resolve);
        }
      });
    });

    // 이미지 및 폰트 로딩 대기
    await page.evaluate(async () => {
      const images = Array.from(document.images);
      await Promise.all(images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }));
    });

    // PDF 생성 옵션 - 배경색 유지가 핵심!
    const pdfOptions = {
      format,
      landscape,
      printBackground: true,  // 🔑 배경색 유지의 핵심 옵션!
      margin: {
        top: margin,
        right: margin,
        bottom: margin,
        left: margin
      },
      scale,
      displayHeaderFooter,
      headerTemplate,
      footerTemplate,
      preferCSSPageSize: true  // CSS에서 지정한 페이지 크기 우선
    };

    const pdfBuffer = await page.pdf(pdfOptions);

    // 출력 파일이 지정된 경우 저장
    if (output) {
      fs.writeFileSync(output, pdfBuffer);
      console.log(`✅ PDF 저장 완료: ${output}`);
    }

    return pdfBuffer;

  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * 여러 HTML 파일을 PDF로 일괄 변환
 * @param {string[]} inputFiles - HTML 파일 경로 배열
 * @param {string} outputDir - 출력 디렉토리
 * @param {Object} options - 변환 옵션
 */
async function batchConvert(inputFiles, outputDir, options = {}) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const results = [];

  for (const inputFile of inputFiles) {
    const baseName = path.basename(inputFile, path.extname(inputFile));
    const outputFile = path.join(outputDir, `${baseName}.pdf`);

    try {
      await convertHtmlToPdf({
        ...options,
        input: inputFile,
        output: outputFile
      });
      results.push({ input: inputFile, output: outputFile, success: true });
    } catch (error) {
      results.push({ input: inputFile, error: error.message, success: false });
      console.error(`❌ 변환 실패: ${inputFile} - ${error.message}`);
    }
  }

  return results;
}

module.exports = { convertHtmlToPdf, batchConvert };

