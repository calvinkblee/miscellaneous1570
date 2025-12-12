const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

const PORT = 3000;

// .env.local 파일에서 환경변수 읽기
function loadEnv() {
    try {
        const envPath = path.join(__dirname, '.env.local');
        const content = fs.readFileSync(envPath, 'utf8');
        const lines = content.split('\n');
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const [key, ...valueParts] = trimmed.split('=');
                const value = valueParts.join('=').trim();
                process.env[key.trim()] = value;
            }
        }
        console.log('✅ .env.local 로드 완료');
    } catch (error) {
        console.error('⚠️ .env.local 파일을 찾을 수 없습니다:', error.message);
    }
}

loadEnv();

// MIME 타입
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// 정적 파일 서빙
function serveStatic(req, res) {
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error');
            }
        } else {
            res.writeHead(200, {
                'Content-Type': contentType,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            });
            res.end(content);
        }
    });
}

// OpenAI API 프록시
async function proxyOpenAI(req, res) {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'API 키가 설정되지 않았습니다. .env.local 파일을 확인하세요.' }));
        return;
    }
    
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        const requestData = JSON.parse(body);
        
        const options = {
            hostname: 'api.openai.com',
            path: '/v1/chat/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        };
        
        const proxyReq = https.request(options, (proxyRes) => {
            let data = '';
            proxyRes.on('data', chunk => data += chunk);
            proxyRes.on('end', () => {
                console.log('📥 OpenAI 응답 상태:', proxyRes.statusCode);
                if (proxyRes.statusCode !== 200) {
                    console.error('❌ OpenAI 에러:', data);
                }
                res.writeHead(proxyRes.statusCode, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(data);
            });
        });
        
        proxyReq.on('error', (e) => {
            console.error('Proxy error:', e);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: e.message }));
        });
        
        proxyReq.write(JSON.stringify(requestData));
        proxyReq.end();
    });
}

// 서버 생성
const server = http.createServer((req, res) => {
    // CORS 헤더
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // API 프록시
    if (req.url === '/api/chat' && req.method === 'POST') {
        proxyOpenAI(req, res);
        return;
    }
    
    // 정적 파일
    serveStatic(req, res);
});

server.listen(PORT, () => {
    console.log(`
🚀 DocScan Pro 서버가 시작되었습니다!
📍 http://localhost:${PORT}

💡 .env.local 파일에 API 키를 설정하세요:
   OPENAI_API_KEY=sk-your-api-key-here
`);
});
