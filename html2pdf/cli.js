#!/usr/bin/env node

const { convertHtmlToPdf, batchConvert } = require('./converter');
const path = require('path');
const fs = require('fs');

// 명령줄 인자 파싱
const args = process.argv.slice(2);

function printHelp() {
  console.log(`
📄 HTML to PDF 변환기 (배경색 완벽 유지)

사용법:
  node cli.js <입력파일> [출력파일] [옵션]
  node cli.js --batch <입력폴더> <출력폴더> [옵션]

옵션:
  --format <크기>      페이지 크기 (A4, Letter, Legal 등) [기본: A4]
  --landscape          가로 모드
  --margin <크기>      여백 (예: 10mm, 1in) [기본: 10mm]
  --scale <비율>       스케일 (0.1 ~ 2) [기본: 1]
  --batch              폴더 내 모든 HTML 파일 일괄 변환

예시:
  node cli.js document.html
  node cli.js document.html output.pdf
  node cli.js document.html --format Letter --landscape
  node cli.js --batch ./html_files ./pdf_output
  node cli.js https://example.com webpage.pdf

`);
}

async function main() {
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  // 옵션 파싱
  const options = {
    format: 'A4',
    landscape: false,
    margin: '10mm',
    scale: 1
  };

  let inputPath = null;
  let outputPath = null;
  let batchMode = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '--format':
        options.format = args[++i];
        break;
      case '--landscape':
        options.landscape = true;
        break;
      case '--margin':
        options.margin = args[++i];
        break;
      case '--scale':
        options.scale = parseFloat(args[++i]);
        break;
      case '--batch':
        batchMode = true;
        break;
      default:
        if (!arg.startsWith('--')) {
          if (!inputPath) {
            inputPath = arg;
          } else if (!outputPath) {
            outputPath = arg;
          }
        }
    }
  }

  if (!inputPath) {
    console.error('❌ 입력 파일을 지정해주세요.');
    printHelp();
    process.exit(1);
  }

  try {
    if (batchMode) {
      // 일괄 변환 모드
      if (!outputPath) {
        outputPath = './pdf_output';
      }

      const htmlFiles = fs.readdirSync(inputPath)
        .filter(f => f.endsWith('.html') || f.endsWith('.htm'))
        .map(f => path.join(inputPath, f));

      if (htmlFiles.length === 0) {
        console.error('❌ HTML 파일을 찾을 수 없습니다.');
        process.exit(1);
      }

      console.log(`📁 ${htmlFiles.length}개 파일 변환 시작...`);
      const results = await batchConvert(htmlFiles, outputPath, options);

      const success = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      console.log(`\n✅ 완료: ${success}개 성공, ${failed}개 실패`);
      
    } else {
      // 단일 파일 변환
      if (!outputPath) {
        const baseName = path.basename(inputPath, path.extname(inputPath));
        outputPath = `${baseName}.pdf`;
      }

      console.log(`📄 변환 중: ${inputPath} → ${outputPath}`);
      await convertHtmlToPdf({
        ...options,
        input: inputPath,
        output: outputPath
      });
    }

  } catch (error) {
    console.error(`❌ 오류: ${error.message}`);
    process.exit(1);
  }
}

main();

