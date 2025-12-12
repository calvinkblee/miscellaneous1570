/**
 * DocScan Pro - HTML 문서 자동 분석 서비스
 * 전체 기능: 채팅, 유사도, 통계, 다중 뷰, 내보내기
 */

class DocScanPro {
    constructor() {
        this.documents = [];
        this.allTags = new Map(); // tag -> count
        this.collections = new Map(); // collection name -> docs
        this.similarities = new Map(); // doc id -> [{id, score}]
        this.keywords = new Map(); // keyword -> count
        
        this.activeTag = null;
        this.activeCollection = 'all';
        this.searchQuery = '';
        this.currentView = 'card';
        this.sortBy = 'title';
        this.sortOrder = 'asc';
        
        this.chatHistory = [];
        
        this.initElements();
        this.initEventListeners();
        this.loadSettings();
    }

    initElements() {
        // API Key는 서버에서 관리 (더미 요소 생성하지 않음)
        
        // Upload
        this.dropzone = document.getElementById('dropzone');
        this.fileInput = document.getElementById('fileInput');
        this.selectFilesBtn = document.getElementById('selectFiles');
        this.selectFolderBtn = document.getElementById('selectFolder');
        
        // Progress
        this.progressSection = document.getElementById('progressSection');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        
        // Views
        this.cardView = document.getElementById('cardView');
        this.tableView = document.getElementById('tableView');
        this.tableBody = document.getElementById('tableBody');
        this.graphView = document.getElementById('graphView');
        this.graphCanvas = document.getElementById('graphCanvas');
        this.graphLegend = document.getElementById('graphLegend');
        this.timelineView = document.getElementById('timelineView');
        this.timeline = document.getElementById('timeline');
        
        // Sidebar
        this.collectionList = document.getElementById('collectionList');
        this.autoCollections = document.getElementById('autoCollections');
        this.tagCloud = document.getElementById('tagCloud');
        this.totalCount = document.getElementById('totalCount');
        this.favCount = document.getElementById('favCount');
        
        // Top bar
        this.searchInput = document.getElementById('searchInput');
        this.viewBtns = document.querySelectorAll('.view-btn');
        this.statsBtn = document.getElementById('statsBtn');
        this.exportBtn = document.getElementById('exportBtn');
        
        // Stats Panel
        this.statsPanel = document.getElementById('statsPanel');
        this.closeStatsBtn = document.getElementById('closeStats');
        
        // Chat
        this.chatPanel = document.getElementById('chatPanel');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendChatBtn = document.getElementById('sendChat');
        this.toggleChatBtn = document.getElementById('toggleChat');
        this.chatToggleBtn = document.getElementById('chatToggleBtn');
        
        // Theme
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.getElementById('themeIcon');
        this.themeText = document.getElementById('themeText');
        
        // Modals
        this.detailModal = document.getElementById('detailModal');
        this.modalBody = document.getElementById('modalBody');
        this.modalClose = document.getElementById('modalClose');
        
        this.exportModal = document.getElementById('exportModal');
        this.exportModalClose = document.getElementById('exportModalClose');
        
        this.similarModal = document.getElementById('similarModal');
        this.similarModalBody = document.getElementById('similarModalBody');
        this.similarModalClose = document.getElementById('similarModalClose');
        
        // Compare
        this.compareBtn = document.getElementById('compareBtn');
        this.compareModal = document.getElementById('compareModal');
        this.compareModalClose = document.getElementById('compareModalClose');
        this.compareDocSelect = document.getElementById('compareDocSelect');
        this.compareResult = document.getElementById('compareResult');
        this.selectedDocsForCompare = new Set();
    }

    initEventListeners() {
        // API Key는 서버에서 관리
        
        // Drag & Drop
        this.dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dropzone.classList.add('dragover');
        });
        
        this.dropzone.addEventListener('dragleave', () => {
            this.dropzone.classList.remove('dragover');
        });
        
        this.dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropzone.classList.remove('dragover');
            this.handleDrop(e.dataTransfer);
        });
        
        this.dropzone.addEventListener('click', () => {
            this.fileInput.removeAttribute('webkitdirectory');
            this.fileInput.click();
        });
        
        // File selection buttons
        this.selectFilesBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.fileInput.removeAttribute('webkitdirectory');
            this.fileInput.click();
        });
        
        this.selectFolderBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.fileInput.setAttribute('webkitdirectory', '');
            this.fileInput.click();
        });
        
        this.fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.processFiles(Array.from(e.target.files));
            }
        });
        
        // Search
        this.searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.renderCurrentView();
        });
        
        // View toggle
        this.viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentView = btn.dataset.view;
                this.viewBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.showView(this.currentView);
            });
        });
        
        // Stats
        this.statsBtn.addEventListener('click', () => this.toggleStats());
        this.closeStatsBtn.addEventListener('click', () => this.toggleStats());
        
        // Compare
        this.compareBtn.addEventListener('click', () => this.showCompareModal());
        this.compareModalClose.addEventListener('click', () => this.closeCompareModal());
        this.compareModal.querySelector('.modal-backdrop').addEventListener('click', () => this.closeCompareModal());
        
        // Export
        this.exportBtn.addEventListener('click', () => this.showExportModal());
        this.exportModalClose.addEventListener('click', () => this.closeExportModal());
        this.exportModal.querySelector('.modal-backdrop').addEventListener('click', () => this.closeExportModal());
        
        document.querySelectorAll('.export-option').forEach(opt => {
            opt.addEventListener('click', () => {
                this.exportTo(opt.dataset.format);
                this.closeExportModal();
            });
        });
        
        // Theme
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Chat
        this.sendChatBtn.addEventListener('click', () => this.sendChatMessage());
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendChatMessage();
            }
        });
        
        this.toggleChatBtn.addEventListener('click', () => this.toggleChatPanel());
        this.chatToggleBtn.addEventListener('click', () => this.toggleChatPanel());
        
        // Collections
        this.collectionList.addEventListener('click', (e) => {
            const item = e.target.closest('.collection-item');
            if (item) {
                this.activeCollection = item.dataset.collection;
                this.activeTag = null;
                this.updateCollectionUI();
                this.renderCurrentView();
            }
        });
        
        // Modals
        this.modalClose.addEventListener('click', () => this.closeDetailModal());
        this.detailModal.querySelector('.modal-backdrop').addEventListener('click', () => this.closeDetailModal());
        
        this.similarModalClose.addEventListener('click', () => this.closeSimilarModal());
        this.similarModal.querySelector('.modal-backdrop').addEventListener('click', () => this.closeSimilarModal());
        
        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeDetailModal();
                this.closeExportModal();
                this.closeSimilarModal();
                this.closeCompareModal();
            }
        });
        
        // Table sort
        document.querySelectorAll('.doc-table th.sortable').forEach(th => {
            th.addEventListener('click', () => {
                const sort = th.dataset.sort;
                if (this.sortBy === sort) {
                    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
                } else {
                    this.sortBy = sort;
                    this.sortOrder = 'asc';
                }
                this.renderTableView();
            });
        });
    }

    // ========================================
    // Settings & Theme
    // ========================================
    
    loadSettings() {
        const theme = localStorage.getItem('docscan_theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
        this.updateThemeUI();
        
        const docs = localStorage.getItem('docscan_documents');
        if (docs) {
            try {
                this.documents = JSON.parse(docs);
                this.rebuildIndexes();
                this.renderCurrentView();
                this.updateSidebar();
            } catch (e) {}
        }
    }
    
    saveSettings() {
        localStorage.setItem('docscan_documents', JSON.stringify(this.documents));
    }
    
    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('docscan_theme', next);
        this.updateThemeUI();
    }
    
    updateThemeUI() {
        const theme = document.documentElement.getAttribute('data-theme');
        this.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        this.themeText.textContent = theme === 'dark' ? '라이트 모드' : '다크 모드';
    }

    // ========================================
    // File Handling
    // ========================================
    
    async handleDrop(dataTransfer) {
        const items = dataTransfer.items;
        const files = [];
        
        const traverseFileTree = async (item, path = '') => {
            return new Promise((resolve) => {
                if (item.isFile) {
                    item.file((file) => {
                        file.relativePath = path + file.name;
                        files.push(file);
                        resolve();
                    });
                } else if (item.isDirectory) {
                    const dirReader = item.createReader();
                    dirReader.readEntries(async (entries) => {
                        for (const entry of entries) {
                            await traverseFileTree(entry, path + item.name + '/');
                        }
                        resolve();
                    });
                }
            });
        };
        
        const promises = [];
        for (const item of items) {
            const entry = item.webkitGetAsEntry();
            if (entry) promises.push(traverseFileTree(entry));
        }
        
        await Promise.all(promises);
        
        const htmlFiles = files.filter(f => 
            f.name.endsWith('.html') || f.name.endsWith('.htm')
        );
        
        if (htmlFiles.length > 0) {
            this.processFiles(htmlFiles);
        } else {
            alert('HTML 파일이 없습니다.');
        }
    }
    
    async processFiles(files) {
        const htmlFiles = files.filter(f => 
            f.name.endsWith('.html') || f.name.endsWith('.htm')
        );
        
        if (htmlFiles.length === 0) {
            alert('HTML 파일이 없습니다.');
            return;
        }

        // API 키는 서버에서 관리

        this.progressSection.hidden = false;
        
        for (let i = 0; i < htmlFiles.length; i++) {
            const file = htmlFiles[i];
            const progress = ((i + 1) / htmlFiles.length) * 100;
            
            this.progressFill.style.width = `${progress}%`;
            this.progressText.textContent = `분석 중... (${i + 1}/${htmlFiles.length}) - ${file.name}`;
            
            try {
                const content = await this.readFileContent(file);
                const parsed = this.parseHTML(content);
                
                const doc = {
                    id: Date.now() + Math.random(),
                    filename: file.relativePath || file.name,
                    rawTitle: parsed.title,
                    rawContent: parsed.textContent,
                    title: parsed.title || '제목 없음',
                    summary: '분석 중...',
                    tags: [],
                    collection: null,
                    favorite: false,
                    createdAt: new Date().toISOString(),
                    analyzing: true
                };
                
                this.documents.push(doc);
                this.renderCurrentView();
                this.updateSidebar();
                
                const analysis = await this.analyzeWithAI(parsed);
                
                doc.title = analysis.title || parsed.title || '제목 없음';
                doc.summary = analysis.summary || '요약을 생성할 수 없습니다.';
                doc.tags = analysis.tags || [];
                doc.collection = analysis.collection || this.guessCollection(doc);
                doc.keywords = analysis.keywords || [];
                doc.ir = analysis.ir || {};
                doc.analyzing = false;
                
                // Update indexes
                this.updateIndexes(doc);
                
                this.renderCurrentView();
                this.updateSidebar();
                this.saveSettings();
                
            } catch (error) {
                console.error(`Error processing ${file.name}:`, error);
                
                const doc = {
                    id: Date.now() + Math.random(),
                    filename: file.relativePath || file.name,
                    title: file.name,
                    summary: `오류: ${error.message}`,
                    tags: ['오류'],
                    collection: '오류',
                    favorite: false,
                    createdAt: new Date().toISOString(),
                    analyzing: false,
                    error: true
                };
                this.documents.push(doc);
                this.renderCurrentView();
            }
        }
        
        // Calculate similarities after all documents processed
        await this.calculateSimilarities();
        
        this.progressSection.hidden = true;
        this.progressFill.style.width = '0%';
        this.updateStats();
    }
    
    readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }
    
    parseHTML(htmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        
        let title = '';
        const titleTag = doc.querySelector('title');
        const h1Tag = doc.querySelector('h1');
        const metaTitle = doc.querySelector('meta[property="og:title"]');
        
        title = titleTag?.textContent?.trim() || 
                h1Tag?.textContent?.trim() || 
                metaTitle?.getAttribute('content')?.trim() || '';
        
        const metaDesc = doc.querySelector('meta[name="description"]');
        const ogDesc = doc.querySelector('meta[property="og:description"]');
        const description = metaDesc?.getAttribute('content') || 
                           ogDesc?.getAttribute('content') || '';
        
        doc.querySelectorAll('script, style, nav, header, footer').forEach(el => el.remove());
        
        const body = doc.body;
        let textContent = body?.textContent || '';
        textContent = textContent.replace(/\s+/g, ' ').trim().slice(0, 5000);
        
        const headings = [];
        doc.querySelectorAll('h1, h2, h3').forEach(h => {
            const text = h.textContent?.trim();
            if (text) headings.push(text);
        });
        
        return { title, description, textContent, headings: headings.slice(0, 10) };
    }
    
    async analyzeWithAI(parsed) {
        const prompt = `다음 HTML 문서의 내용을 분석해주세요.

문서 제목: ${parsed.title || '없음'}
메타 설명: ${parsed.description || '없음'}
주요 제목들: ${parsed.headings.join(', ') || '없음'}

본문 내용:
${parsed.textContent.slice(0, 3000)}

다음 JSON 형식으로만 응답해주세요. 문서에서 명시적으로 언급된 정보만 추출하고, 없으면 null 또는 빈 배열로 남겨주세요:
{
  "title": "문서의 핵심 제목",
  "summary": "문서의 핵심 내용을 2-3문장으로 요약",
  "tags": ["태그1", "태그2", "태그3"],
  "collection": "IR자료/기술문서/마케팅/교육/일반 중 하나",
  "keywords": ["키워드1", "키워드2", "키워드3"],
  "ir": {
    "companyName": "회사명 또는 null",
    "oneLiner": "한 줄 소개/슬로건 또는 null",
    "problem": "해결하려는 문제 또는 null",
    "solution": "제시하는 솔루션 또는 null",
    "products": ["제품1", "서비스1"],
    "targetMarket": "타겟 시장/고객 또는 null",
    "marketSize": "시장규모 언급(TAM/SAM/SOM) 또는 null",
    "businessModel": "수익모델 또는 null",
    "competitors": ["경쟁사1", "경쟁사2"],
    "differentiators": ["차별점1", "차별점2"],
    "team": ["팀원/직책"],
    "financials": "재무정보(매출/성장률 등) 또는 null",
    "fundingAsk": "투자요청금액 또는 null",
    "fundingUse": ["자금사용처1"],
    "milestones": ["마일스톤1"],
    "traction": ["고객사/실적1"]
  }
}

중요: ir 객체는 반드시 포함하되, 문서에 해당 정보가 없으면 null 또는 빈 배열[]로 응답해주세요.`;

        try {
            // 서버 프록시를 통해 API 호출
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: '당신은 문서 분석 전문가입니다. 항상 유효한 JSON으로만 응답하세요.' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.3,
                    max_tokens: 2000
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ API 에러:', errorData);
                throw new Error(errorData.error?.message || errorData.error || 'API 요청 실패');
            }

            const data = await response.json();
            console.log('📨 API 응답 수신');
            const content = data.choices[0].message.content;
            
            console.log('🤖 AI 원본 응답:', content);
            
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const result = JSON.parse(jsonMatch[0]);
                // ir 필드가 없으면 빈 객체로 설정
                if (!result.ir) result.ir = {};
                console.log('✅ AI 분석 결과:', result);
                console.log('📊 IR 정보:', result.ir);
                return result;
            }
            
            throw new Error('유효한 JSON 응답 없음');
            
        } catch (error) {
            console.error('AI Analysis Error:', error);
            return {
                title: parsed.title || '제목 없음',
                summary: parsed.description || parsed.textContent.slice(0, 200) + '...',
                tags: this.extractSimpleTags(parsed),
                collection: this.guessCollection({ title: parsed.title, rawContent: parsed.textContent }),
                keywords: [],
                ir: {}
            };
        }
    }
    
    extractSimpleTags(parsed) {
        const text = (parsed.title + ' ' + parsed.headings.join(' ')).toLowerCase();
        const tags = [];
        
        const keywords = {
            'IR': ['ir', 'investor', '투자', '재무'],
            '교육': ['교육', 'education', '학습', '교과서'],
            '기술': ['tech', '기술', 'ai', 'api', '개발'],
            '비즈니스': ['business', '비즈니스', '사업', '매출'],
            '마케팅': ['marketing', '마케팅', '광고'],
            '디자인': ['design', '디자인', 'ui', 'ux'],
            '엔터테인먼트': ['anime', '아니메', '게임', '영화', '음악']
        };
        
        for (const [tag, words] of Object.entries(keywords)) {
            if (words.some(w => text.includes(w))) tags.push(tag);
        }
        
        return tags.length > 0 ? tags : ['일반'];
    }
    
    guessCollection(doc) {
        const text = ((doc.title || '') + ' ' + (doc.rawContent || '')).toLowerCase();
        
        if (text.includes('ir') || text.includes('investor') || text.includes('투자')) return 'IR자료';
        if (text.includes('교육') || text.includes('학습')) return '교육';
        if (text.includes('api') || text.includes('개발') || text.includes('tech')) return '기술문서';
        if (text.includes('마케팅') || text.includes('marketing')) return '마케팅';
        if (text.includes('anime') || text.includes('게임') || text.includes('영화')) return '엔터테인먼트';
        
        return '일반';
    }

    // ========================================
    // Indexing & Similarity
    // ========================================
    
    rebuildIndexes() {
        this.allTags.clear();
        this.collections.clear();
        this.keywords.clear();
        
        this.documents.forEach(doc => this.updateIndexes(doc));
    }
    
    updateIndexes(doc) {
        // Tags
        doc.tags.forEach(tag => {
            this.allTags.set(tag, (this.allTags.get(tag) || 0) + 1);
        });
        
        // Collections
        const col = doc.collection || '일반';
        if (!this.collections.has(col)) {
            this.collections.set(col, []);
        }
        this.collections.get(col).push(doc.id);
        
        // Keywords
        (doc.keywords || []).forEach(kw => {
            this.keywords.set(kw, (this.keywords.get(kw) || 0) + 1);
        });
    }
    
    async calculateSimilarities() {
        this.similarities.clear();
        
        if (this.documents.length < 2) return;
        
        // Simple TF-IDF-like similarity using tags and keywords
        for (let i = 0; i < this.documents.length; i++) {
            const docA = this.documents[i];
            const similar = [];
            
            for (let j = 0; j < this.documents.length; j++) {
                if (i === j) continue;
                
                const docB = this.documents[j];
                const score = this.calculateSimScore(docA, docB);
                
                if (score > 30) {
                    similar.push({ id: docB.id, score });
                }
            }
            
            similar.sort((a, b) => b.score - a.score);
            this.similarities.set(docA.id, similar.slice(0, 5));
        }
    }
    
    calculateSimScore(docA, docB) {
        let score = 0;
        
        // Tag overlap
        const tagsA = new Set(docA.tags);
        const tagsB = new Set(docB.tags);
        const tagOverlap = [...tagsA].filter(t => tagsB.has(t)).length;
        score += tagOverlap * 20;
        
        // Same collection
        if (docA.collection === docB.collection) {
            score += 25;
        }
        
        // Keyword overlap
        const kwA = new Set(docA.keywords || []);
        const kwB = new Set(docB.keywords || []);
        const kwOverlap = [...kwA].filter(k => kwB.has(k)).length;
        score += kwOverlap * 15;
        
        // Title similarity (simple word overlap)
        const wordsA = new Set(docA.title.toLowerCase().split(/\s+/));
        const wordsB = new Set(docB.title.toLowerCase().split(/\s+/));
        const titleOverlap = [...wordsA].filter(w => wordsB.has(w) && w.length > 2).length;
        score += titleOverlap * 10;
        
        return Math.min(score, 100);
    }

    // ========================================
    // Rendering
    // ========================================
    
    getFilteredDocs() {
        return this.documents.filter(doc => {
            // Collection filter
            if (this.activeCollection === 'favorites' && !doc.favorite) return false;
            if (this.activeCollection !== 'all' && this.activeCollection !== 'favorites') {
                if (doc.collection !== this.activeCollection) return false;
            }
            
            // Tag filter
            if (this.activeTag && !doc.tags.includes(this.activeTag)) return false;
            
            // Search
            if (this.searchQuery) {
                const text = (doc.title + ' ' + doc.summary + ' ' + doc.filename + ' ' + doc.tags.join(' ')).toLowerCase();
                if (!text.includes(this.searchQuery)) return false;
            }
            
            return true;
        });
    }
    
    showView(view) {
        this.cardView.hidden = view !== 'card';
        this.tableView.hidden = view !== 'table';
        this.graphView.hidden = view !== 'graph';
        this.timelineView.hidden = view !== 'timeline';
        
        this.renderCurrentView();
    }
    
    renderCurrentView() {
        switch (this.currentView) {
            case 'card': this.renderCardView(); break;
            case 'table': this.renderTableView(); break;
            case 'graph': this.renderGraphView(); break;
            case 'timeline': this.renderTimelineView(); break;
        }
    }
    
    renderCardView() {
        const docs = this.getFilteredDocs();
        
        if (docs.length === 0) {
            this.cardView.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <p>표시할 문서가 없습니다</p>
                </div>
            `;
            return;
        }
        
        this.cardView.innerHTML = docs.map(doc => {
            const similar = this.similarities.get(doc.id) || [];
            const topSimilar = similar[0];
            
            return `
                <div class="doc-card ${doc.analyzing ? 'loading' : ''} ${doc.favorite ? 'favorite' : ''}" data-id="${doc.id}">
                    <div class="doc-card-header">
                        <span class="doc-icon">${doc.error ? '⚠️' : '📄'}</span>
                        <div>
                            <div class="doc-title">${this.escapeHtml(doc.title)}</div>
                            <div class="doc-filename">${this.escapeHtml(doc.filename)}</div>
                            ${doc.collection ? `<span class="doc-collection">${this.escapeHtml(doc.collection)}</span>` : ''}
                        </div>
                    </div>
                    <div class="doc-summary">${this.escapeHtml(doc.summary)}</div>
                    <div class="doc-footer">
                        <div class="doc-tags">
                            ${doc.tags.slice(0, 3).map(tag => `<span class="tag">#${this.escapeHtml(tag)}</span>`).join('')}
                        </div>
                        ${topSimilar ? `
                            <div class="doc-similarity">
                                <span class="similarity-badge" data-doc="${doc.id}" title="유사 문서 보기">${topSimilar.score}%</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        // Add event listeners
        this.cardView.querySelectorAll('.doc-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.classList.contains('similarity-badge')) {
                    e.stopPropagation();
                    this.showSimilarDocs(e.target.dataset.doc);
                } else {
                    this.showDocumentDetail(card.dataset.id);
                }
            });
        });
    }
    
    renderTableView() {
        const docs = this.getFilteredDocs();
        
        // Sort
        docs.sort((a, b) => {
            let valA = a[this.sortBy] || '';
            let valB = b[this.sortBy] || '';
            
            if (this.sortBy === 'similarity') {
                valA = (this.similarities.get(a.id)?.[0]?.score) || 0;
                valB = (this.similarities.get(b.id)?.[0]?.score) || 0;
            }
            
            if (typeof valA === 'string') {
                return this.sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            return this.sortOrder === 'asc' ? valA - valB : valB - valA;
        });
        
        if (docs.length === 0) {
            this.tableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 40px;">표시할 문서가 없습니다</td>
                </tr>
            `;
            return;
        }
        
        this.tableBody.innerHTML = docs.map(doc => {
            const similar = this.similarities.get(doc.id) || [];
            const topSimilar = similar[0];
            
            return `
                <tr data-id="${doc.id}">
                    <td>
                        <div class="table-title">
                            <span class="doc-icon">${doc.error ? '⚠️' : '📄'}</span>
                            <div>
                                <div>${this.escapeHtml(doc.title)}</div>
                                <div class="doc-filename">${this.escapeHtml(doc.filename)}</div>
                            </div>
                        </div>
                    </td>
                    <td><span class="doc-collection">${this.escapeHtml(doc.collection || '일반')}</span></td>
                    <td>
                        <div class="doc-tags">
                            ${doc.tags.slice(0, 2).map(tag => `<span class="tag">#${this.escapeHtml(tag)}</span>`).join('')}
                        </div>
                    </td>
                    <td>${topSimilar ? `<span class="similarity-badge">${topSimilar.score}%</span>` : '-'}</td>
                    <td>
                        <div class="table-actions">
                            <button class="btn btn-sm btn-secondary view-btn-action" data-id="${doc.id}">상세</button>
                            <button class="btn btn-sm btn-secondary fav-btn" data-id="${doc.id}">${doc.favorite ? '⭐' : '☆'}</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
        
        // Event listeners
        this.tableBody.querySelectorAll('.view-btn-action').forEach(btn => {
            btn.addEventListener('click', () => this.showDocumentDetail(btn.dataset.id));
        });
        
        this.tableBody.querySelectorAll('.fav-btn').forEach(btn => {
            btn.addEventListener('click', () => this.toggleFavorite(btn.dataset.id));
        });
    }
    
    renderGraphView() {
        const docs = this.getFilteredDocs();
        const canvas = this.graphCanvas;
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (docs.length === 0) {
            ctx.fillStyle = '#64748b';
            ctx.font = '16px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('표시할 문서가 없습니다', canvas.width / 2, canvas.height / 2);
            return;
        }
        
        // Position nodes in a circle
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 80;
        
        const nodes = docs.map((doc, i) => {
            const angle = (i / docs.length) * Math.PI * 2 - Math.PI / 2;
            return {
                id: doc.id,
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                title: doc.title.slice(0, 20) + (doc.title.length > 20 ? '...' : ''),
                collection: doc.collection
            };
        });
        
        const nodeMap = new Map(nodes.map(n => [n.id, n]));
        
        // Draw edges (similarity connections)
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        
        docs.forEach(doc => {
            const nodeA = nodeMap.get(doc.id);
            const similar = this.similarities.get(doc.id) || [];
            
            similar.forEach(sim => {
                const nodeB = nodeMap.get(sim.id);
                if (nodeB) {
                    ctx.beginPath();
                    ctx.moveTo(nodeA.x, nodeA.y);
                    ctx.lineTo(nodeB.x, nodeB.y);
                    ctx.globalAlpha = sim.score / 100 * 0.5;
                    ctx.stroke();
                }
            });
        });
        
        ctx.globalAlpha = 1;
        
        // Collection colors
        const colors = {
            'IR자료': '#3b82f6',
            '기술문서': '#8b5cf6',
            '교육': '#10b981',
            '마케팅': '#f59e0b',
            '엔터테인먼트': '#ef4444',
            '일반': '#64748b'
        };
        
        // Draw nodes
        nodes.forEach(node => {
            const color = colors[node.collection] || colors['일반'];
            
            // Node circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, 25, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            
            // Node label
            ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'dark' ? '#f1f5f9' : '#1e293b';
            ctx.font = '11px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(node.title, node.x, node.y + 40);
        });
        
        // Legend
        this.graphLegend.innerHTML = `
            ${Object.entries(colors).map(([name, color]) => `
                <div class="legend-item">
                    <div class="legend-dot" style="background: ${color}"></div>
                    <span>${name}</span>
                </div>
            `).join('')}
        `;
    }
    
    renderTimelineView() {
        const docs = this.getFilteredDocs();
        
        if (docs.length === 0) {
            this.timeline.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📭</div><p>표시할 문서가 없습니다</p></div>`;
            return;
        }
        
        // Group by date
        const groups = new Map();
        docs.forEach(doc => {
            const date = doc.createdAt ? doc.createdAt.split('T')[0] : '날짜 없음';
            if (!groups.has(date)) groups.set(date, []);
            groups.get(date).push(doc);
        });
        
        // Sort dates descending
        const sortedDates = [...groups.keys()].sort().reverse();
        
        this.timeline.innerHTML = sortedDates.map(date => `
            <div class="timeline-group">
                <div class="timeline-date">${date}</div>
                <div class="timeline-items">
                    ${groups.get(date).map(doc => `
                        <div class="timeline-item" data-id="${doc.id}">
                            <div class="timeline-item-title">${this.escapeHtml(doc.title)}</div>
                            <div class="doc-filename">${this.escapeHtml(doc.filename)}</div>
                            <div class="timeline-item-tags">
                                ${doc.tags.slice(0, 3).map(tag => `<span class="tag">#${this.escapeHtml(tag)}</span>`).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
        
        this.timeline.querySelectorAll('.timeline-item').forEach(item => {
            item.addEventListener('click', () => this.showDocumentDetail(item.dataset.id));
        });
    }
    
    // ========================================
    // Sidebar
    // ========================================
    
    updateSidebar() {
        // Total count
        this.totalCount.textContent = this.documents.length;
        this.favCount.textContent = this.documents.filter(d => d.favorite).length;
        
        // Auto collections
        this.autoCollections.innerHTML = [...this.collections.entries()]
            .filter(([name]) => name !== '일반')
            .map(([name, ids]) => `
                <div class="collection-item ${this.activeCollection === name ? 'active' : ''}" data-collection="${name}">
                    <span>📁 ${name}</span>
                    <span class="collection-count">${ids.length}</span>
                </div>
            `).join('');
        
        this.autoCollections.querySelectorAll('.collection-item').forEach(item => {
            item.addEventListener('click', () => {
                this.activeCollection = item.dataset.collection;
                this.activeTag = null;
                this.updateCollectionUI();
                this.renderCurrentView();
            });
        });
        
        // Tag cloud
        const sortedTags = [...this.allTags.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15);
        
        this.tagCloud.innerHTML = sortedTags.map(([tag, count]) => `
            <span class="tag-pill ${this.activeTag === tag ? 'active' : ''}" data-tag="${tag}">#${tag} (${count})</span>
        `).join('');
        
        this.tagCloud.querySelectorAll('.tag-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                this.activeTag = this.activeTag === pill.dataset.tag ? null : pill.dataset.tag;
                this.updateTagUI();
                this.renderCurrentView();
            });
        });
    }
    
    updateCollectionUI() {
        document.querySelectorAll('.collection-item').forEach(item => {
            item.classList.toggle('active', item.dataset.collection === this.activeCollection);
        });
    }
    
    updateTagUI() {
        document.querySelectorAll('.tag-pill').forEach(pill => {
            pill.classList.toggle('active', pill.dataset.tag === this.activeTag);
        });
    }

    // ========================================
    // Stats
    // ========================================
    
    toggleStats() {
        this.statsPanel.hidden = !this.statsPanel.hidden;
        if (!this.statsPanel.hidden) {
            this.updateStats();
        }
    }
    
    updateStats() {
        document.getElementById('statTotal').textContent = this.documents.length;
        document.getElementById('statCollections').textContent = this.collections.size;
        document.getElementById('statTags').textContent = this.allTags.size;
        
        // Count documents with high similarity
        let dupCount = 0;
        this.similarities.forEach(sims => {
            if (sims.some(s => s.score >= 70)) dupCount++;
        });
        document.getElementById('statDuplicates').textContent = dupCount;
        
        // Keyword bars
        const topKeywords = [...this.keywords.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
        const maxCount = topKeywords[0]?.[1] || 1;
        
        document.getElementById('keywordBars').innerHTML = topKeywords.map(([kw, count]) => `
            <div class="keyword-bar">
                <span class="keyword-name">${kw}</span>
                <div class="keyword-fill" style="width: ${(count / maxCount) * 200}px">
                    <span class="keyword-count">${count}</span>
                </div>
            </div>
        `).join('') || '<p style="color: var(--text-light)">데이터 없음</p>';
        
        // Collection chart
        const collectionData = [...this.collections.entries()];
        const totalDocs = this.documents.length || 1;
        const chartColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#64748b'];
        
        document.getElementById('collectionChart').innerHTML = collectionData.map(([name, ids], i) => `
            <div class="chart-segment" style="flex: ${ids.length}; background: ${chartColors[i % chartColors.length]}" title="${name}: ${ids.length}개">
                ${Math.round(ids.length / totalDocs * 100)}%
            </div>
        `).join('') || '<p style="color: var(--text-light)">데이터 없음</p>';
    }

    // ========================================
    // Chat
    // ========================================
    
    toggleChatPanel() {
        this.chatPanel.classList.toggle('collapsed');
        this.chatToggleBtn.hidden = !this.chatPanel.classList.contains('collapsed');
    }
    
    async sendChatMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        this.addChatMessage('user', message);
        this.chatInput.value = '';
        
        // Prepare context from documents
        const docsContext = this.documents.slice(0, 10).map(doc => 
            `[${doc.filename}] ${doc.title}: ${doc.summary}`
        ).join('\n\n');
        
        try {
            this.addChatMessage('assistant', '답변 생성 중...');
            
            // 서버 프록시를 통해 API 호출
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        { 
                            role: 'system', 
                            content: `당신은 문서 분석 어시스턴트입니다. 사용자가 업로드한 문서들을 기반으로 질문에 답변합니다.
                            
답변 시 반드시 어떤 문서를 참조했는지 출처를 명시하세요.

업로드된 문서 요약:
${docsContext || '문서가 없습니다.'}`
                        },
                        ...this.chatHistory.slice(-6),
                        { role: 'user', content: message }
                    ],
                    temperature: 0.5,
                    max_tokens: 800
                })
            });
            
            if (!response.ok) {
                throw new Error('API 요청 실패');
            }
            
            const data = await response.json();
            const answer = data.choices[0].message.content;
            
            // Replace loading message
            this.chatMessages.lastChild.remove();
            this.addChatMessage('assistant', answer);
            
            this.chatHistory.push({ role: 'user', content: message });
            this.chatHistory.push({ role: 'assistant', content: answer });
            
        } catch (error) {
            this.chatMessages.lastChild.remove();
            this.addChatMessage('assistant', `오류가 발생했습니다: ${error.message}`);
        }
    }
    
    addChatMessage(type, content) {
        const div = document.createElement('div');
        div.className = `chat-message ${type}`;
        div.innerHTML = `<p>${this.escapeHtml(content).replace(/\n/g, '<br>')}</p>`;
        this.chatMessages.appendChild(div);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    // ========================================
    // Document Detail & Similar
    // ========================================
    
    showDocumentDetail(id) {
        const doc = this.documents.find(d => String(d.id) === String(id));
        if (!doc) return;
        
        const similar = this.similarities.get(doc.id) || [];
        
        this.modalBody.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
                <div>
                    <h2>${this.escapeHtml(doc.title)}</h2>
                    <div class="doc-filename">${this.escapeHtml(doc.filename)}</div>
                    ${doc.collection ? `<span class="doc-collection">${this.escapeHtml(doc.collection)}</span>` : ''}
                </div>
                <button class="btn btn-secondary" onclick="window.docScan.toggleFavorite('${doc.id}')">${doc.favorite ? '⭐ 즐겨찾기 해제' : '☆ 즐겨찾기'}</button>
            </div>
            
            <h3>📝 요약</h3>
            <p class="doc-summary">${this.escapeHtml(doc.summary)}</p>
            
            <h3>🏷️ 태그</h3>
            <div class="doc-tags">
                ${doc.tags.map(tag => `<span class="tag tag-success">#${this.escapeHtml(tag)}</span>`).join('')}
            </div>
            
            ${doc.keywords?.length ? `
                <h3>🔑 주요 키워드</h3>
                <div class="doc-tags">
                    ${doc.keywords.map(kw => `<span class="tag">${this.escapeHtml(kw)}</span>`).join('')}
                </div>
            ` : ''}
            
            ${similar.length ? `
                <h3>🔗 유사 문서</h3>
                <div class="similar-list">
                    ${similar.slice(0, 3).map(sim => {
                        const simDoc = this.documents.find(d => d.id === sim.id);
                        if (!simDoc) return '';
                        return `
                            <div class="similar-item" onclick="window.docScan.showDocumentDetail('${simDoc.id}')">
                                <div class="similar-score">${sim.score}%</div>
                                <div class="similar-info">
                                    <div class="similar-title">${this.escapeHtml(simDoc.title)}</div>
                                    <div class="similar-match">태그/키워드 유사도 기반</div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            ` : ''}
        `;
        
        this.detailModal.hidden = false;
    }
    
    closeDetailModal() {
        this.detailModal.hidden = true;
    }
    
    showSimilarDocs(id) {
        const doc = this.documents.find(d => String(d.id) === String(id));
        if (!doc) return;
        
        const similar = this.similarities.get(doc.id) || [];
        
        this.similarModalBody.innerHTML = `
            <h2>🔗 유사 문서</h2>
            <p class="modal-desc">"${doc.title}"와 유사한 문서</p>
            
            ${similar.length ? `
                <div class="similar-list">
                    ${similar.map(sim => {
                        const simDoc = this.documents.find(d => d.id === sim.id);
                        if (!simDoc) return '';
                        return `
                            <div class="similar-item" onclick="window.docScan.showDocumentDetail('${simDoc.id}'); window.docScan.closeSimilarModal();">
                                <div class="similar-score">${sim.score}%</div>
                                <div class="similar-info">
                                    <div class="similar-title">${this.escapeHtml(simDoc.title)}</div>
                                    <div class="similar-match">${this.escapeHtml(simDoc.filename)}</div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            ` : '<p>유사한 문서가 없습니다.</p>'}
        `;
        
        this.similarModal.hidden = false;
    }
    
    closeSimilarModal() {
        this.similarModal.hidden = true;
    }
    
    // ========================================
    // Compare (파일 정보 기반 차이점 비교)
    // ========================================
    
    showCompareModal() {
        if (this.documents.length < 2) {
            alert('비교하려면 최소 2개 이상의 문서가 필요합니다.');
            return;
        }
        
        // 문서 선택 체크박스 렌더링
        this.selectedDocsForCompare.clear();
        
        // 기본적으로 처음 2개 선택
        this.documents.slice(0, 2).forEach(doc => {
            this.selectedDocsForCompare.add(String(doc.id));
        });
        
        this.renderCompareDocSelect();
        this.renderCompareResult();
        
        this.compareModal.hidden = false;
    }
    
    closeCompareModal() {
        this.compareModal.hidden = true;
    }
    
    renderCompareDocSelect() {
        this.compareDocSelect.innerHTML = this.documents.map(doc => {
            const isSelected = this.selectedDocsForCompare.has(String(doc.id));
            return `
                <label class="compare-checkbox ${isSelected ? 'selected' : ''}" data-id="${doc.id}">
                    <input type="checkbox" value="${doc.id}" ${isSelected ? 'checked' : ''}>
                    <span>${this.escapeHtml(doc.title.slice(0, 30))}${doc.title.length > 30 ? '...' : ''}</span>
                </label>
            `;
        }).join('');
        
        this.compareDocSelect.querySelectorAll('.compare-checkbox').forEach(label => {
            const checkbox = label.querySelector('input');
            checkbox.addEventListener('change', () => {
                const id = String(checkbox.value);
                if (checkbox.checked) {
                    this.selectedDocsForCompare.add(id);
                    label.classList.add('selected');
                } else {
                    this.selectedDocsForCompare.delete(id);
                    label.classList.remove('selected');
                }
                this.renderCompareResult();
            });
        });
    }
    
    renderCompareResult() {
        const selectedDocs = this.documents.filter(doc => 
            this.selectedDocsForCompare.has(String(doc.id))
        );
        
        if (selectedDocs.length < 2) {
            this.compareResult.innerHTML = '<div class="compare-empty">비교할 문서를 2개 이상 선택해주세요</div>';
            return;
        }
        
        // IR 비교 항목 정의
        const irFields = [
            { key: 'companyName', label: '🏢 회사명', type: 'text' },
            { key: 'oneLiner', label: '💡 핵심 가치', type: 'text' },
            { key: 'problem', label: '❓ 문제 정의', type: 'text' },
            { key: 'solution', label: '✅ 솔루션', type: 'text' },
            { key: 'products', label: '📦 제품/서비스', type: 'list' },
            { key: 'targetMarket', label: '🎯 타겟 시장', type: 'text' },
            { key: 'marketSize', label: '📊 시장 규모', type: 'object' },
            { key: 'businessModel', label: '💰 비즈니스 모델', type: 'text' },
            { key: 'competitors', label: '⚔️ 경쟁사', type: 'list' },
            { key: 'differentiators', label: '🌟 차별점', type: 'list' },
            { key: 'team', label: '👥 팀 구성', type: 'list' },
            { key: 'financials', label: '📈 재무 정보', type: 'object' },
            { key: 'fundingAsk', label: '💵 투자 요청', type: 'text' },
            { key: 'fundingUse', label: '📋 자금 사용처', type: 'list' },
            { key: 'milestones', label: '🚀 마일스톤', type: 'list' },
            { key: 'traction', label: '📌 실적/고객사', type: 'list' }
        ];
        
        // 각 필드별로 값이 다른지 확인
        const differences = [];
        
        this.compareResult.innerHTML = `
            <!-- 기본 정보 헤더 -->
            <div class="compare-section">
                <div class="compare-section-title">📋 문서 기본 정보</div>
                <div class="compare-values">
                    ${selectedDocs.map(doc => `
                        <div class="compare-doc-column">
                            <div class="compare-doc-title">${this.escapeHtml(doc.title)}</div>
                            <div style="font-size: 0.8rem; color: var(--text-light);">${this.escapeHtml(doc.filename)}</div>
                            <div style="margin-top: 8px;">
                                <span class="compare-item common">${this.escapeHtml(doc.collection || '일반')}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- IR 핵심 요소 비교 테이블 -->
            <div class="compare-section">
                <div class="compare-section-title">📊 IR 핵심 요소 비교 <span style="font-weight: normal; font-size: 0.8rem; color: var(--text-light);">(초록=동일, 빨강=차이)</span></div>
                <div class="ir-compare-table">
                    <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                        <thead>
                            <tr style="background: var(--bg-secondary);">
                                <th style="padding: 10px; text-align: left; width: 140px;">항목</th>
                                ${selectedDocs.map(doc => `
                                    <th style="padding: 10px; text-align: left;">${this.escapeHtml(doc.title.slice(0, 20))}${doc.title.length > 20 ? '...' : ''}</th>
                                `).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${irFields.map(field => {
                                const values = selectedDocs.map(doc => {
                                    const ir = doc.ir || {};
                                    return ir[field.key];
                                });
                                
                                const isDifferent = this.areValuesDifferent(values, field.type);
                                if (isDifferent) differences.push(field);
                                
                                return `
                                    <tr style="border-bottom: 1px solid var(--border); ${isDifferent ? 'background: var(--danger-light);' : ''}">
                                        <td style="padding: 10px; font-weight: 600; color: ${isDifferent ? 'var(--danger)' : 'var(--text-secondary)'};">
                                            ${field.label}
                                        </td>
                                        ${values.map(val => `
                                            <td style="padding: 10px;">${this.formatIRValue(val, field.type)}</td>
                                        `).join('')}
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- 태그/키워드 비교 -->
            <div class="compare-section">
                <div class="compare-section-title">🏷️ 태그 & 키워드</div>
                <div class="compare-values">
                    ${selectedDocs.map(doc => {
                        const allTags = selectedDocs.map(d => new Set(d.tags));
                        const commonTags = this.getIntersection(allTags);
                        const uniqueTags = doc.tags.filter(t => !commonTags.has(t));
                        const common = doc.tags.filter(t => commonTags.has(t));
                        
                        return `
                            <div class="compare-doc-column">
                                <div class="compare-doc-title">${this.escapeHtml(doc.title)}</div>
                                <div style="margin-bottom: 8px; font-size: 0.8rem; color: var(--text-light);">태그:</div>
                                <div class="compare-items">
                                    ${uniqueTags.map(tag => `<span class="compare-item unique">#${this.escapeHtml(tag)}</span>`).join('')}
                                    ${common.map(tag => `<span class="compare-item common">#${this.escapeHtml(tag)}</span>`).join('')}
                                    ${doc.tags.length === 0 ? '<span class="compare-item common">없음</span>' : ''}
                                </div>
                                <div style="margin: 8px 0; font-size: 0.8rem; color: var(--text-light);">키워드:</div>
                                <div class="compare-items">
                                    ${(doc.keywords || []).map(kw => `<span class="compare-item common">${this.escapeHtml(kw)}</span>`).join('')}
                                    ${(doc.keywords || []).length === 0 ? '<span class="compare-item common">없음</span>' : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            
            <!-- IR 정보 없는 문서 안내 -->
            ${selectedDocs.some(doc => !doc.ir || Object.keys(doc.ir).length === 0) ? `
                <div class="compare-section" style="background: var(--info-light); border-left: 4px solid var(--info);">
                    <div class="compare-section-title">ℹ️ IR 정보가 없는 문서</div>
                    <p style="margin: 0; font-size: 0.9rem;">
                        일부 문서에 IR 정보가 없습니다. 아래 버튼을 눌러 재분석하세요.
                    </p>
                    <button onclick="app.reanalyzeDocuments([${selectedDocs.filter(d => !d.ir || Object.keys(d.ir).length === 0).map(d => `'${d.id}'`).join(',')}])" 
                            style="margin-top: 10px; padding: 8px 16px; background: var(--primary); color: white; border: none; border-radius: 6px; cursor: pointer;">
                        🔄 선택 문서 재분석
                    </button>
                </div>
            ` : ''}
            
            <!-- 차이점 요약 -->
            <div class="compare-section" style="background: var(--warning-light); border-left: 4px solid var(--warning);">
                <div class="compare-section-title">⚡ 주요 차이점 요약 (${differences.length}개 항목)</div>
                ${differences.length > 0 ? `
                    <ul style="margin: 0; padding-left: 20px; font-size: 0.9rem; line-height: 1.8;">
                        ${differences.map(field => {
                            const values = selectedDocs.map(doc => {
                                const ir = doc.ir || {};
                                return { title: doc.title, value: ir[field.key] };
                            });
                            return `<li><strong>${field.label}</strong>: ${values.map(v => 
                                `${v.title.slice(0, 15)}="${this.formatIRValueShort(v.value, field.type)}"`
                            ).join(' vs ')}</li>`;
                        }).join('')}
                    </ul>
                ` : '<p style="margin: 0; font-size: 0.9rem;">IR 항목에서 차이점이 발견되지 않았습니다. 문서가 유사하거나 IR 정보가 없습니다.</p>'}
            </div>
            
            <!-- 요약 비교 -->
            <div class="compare-section">
                <div class="compare-section-title">📝 요약 전문 비교</div>
                <div class="compare-values">
                    ${selectedDocs.map(doc => `
                        <div class="compare-doc-column">
                            <div class="compare-doc-title">${this.escapeHtml(doc.title)}</div>
                            <div class="compare-text">${this.escapeHtml(doc.summary)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // 값들이 다른지 확인
    areValuesDifferent(values, type) {
        const normalized = values.map(v => this.normalizeValue(v, type));
        const first = normalized[0];
        return !normalized.every(v => v === first);
    }
    
    normalizeValue(val, type) {
        if (!val) return '';
        if (type === 'list' && Array.isArray(val)) return val.sort().join(',');
        if (type === 'object' && typeof val === 'object') return JSON.stringify(val);
        return String(val);
    }
    
    formatIRValue(val, type) {
        if (!val || (Array.isArray(val) && val.length === 0) || 
            (typeof val === 'object' && !Array.isArray(val) && Object.keys(val).length === 0)) {
            return '<span style="color: var(--text-light); font-style: italic;">-</span>';
        }
        
        if (type === 'list' && Array.isArray(val)) {
            return val.map(item => `<span class="compare-item common">${this.escapeHtml(item)}</span>`).join(' ');
        }
        
        if (type === 'object' && typeof val === 'object') {
            return Object.entries(val).map(([k, v]) => 
                `<div><strong>${this.escapeHtml(k)}:</strong> ${this.escapeHtml(v)}</div>`
            ).join('');
        }
        
        return this.escapeHtml(String(val));
    }
    
    formatIRValueShort(val, type) {
        if (!val) return '없음';
        if (type === 'list' && Array.isArray(val)) return val.slice(0, 2).join(', ') + (val.length > 2 ? '...' : '');
        if (type === 'object' && typeof val === 'object') {
            const keys = Object.keys(val);
            return keys.slice(0, 2).map(k => `${k}: ${val[k]}`).join(', ');
        }
        const str = String(val);
        return str.length > 30 ? str.slice(0, 30) + '...' : str;
    }
    
    // 문서 재분석 (IR 정보 추출)
    async reanalyzeDocuments(docIds) {
        const docsToAnalyze = this.documents.filter(doc => 
            docIds.includes(String(doc.id))
        );
        
        if (docsToAnalyze.length === 0) {
            alert('재분석할 문서가 없습니다.');
            return;
        }
        
        // rawContent가 없는 문서 체크
        const docsWithoutContent = docsToAnalyze.filter(doc => !doc.rawContent);
        if (docsWithoutContent.length > 0) {
            alert(`⚠️ ${docsWithoutContent.length}개 문서에 원본 내용이 없습니다.\n기존 문서를 삭제하고 다시 업로드해주세요.`);
            return;
        }
        
        alert(`${docsToAnalyze.length}개 문서를 재분석합니다. 잠시 기다려주세요...`);
        
        for (const doc of docsToAnalyze) {
            try {
                doc.analyzing = true;
                this.renderCurrentView();
                
                const parsed = {
                    title: doc.rawTitle || doc.title,
                    description: '',
                    textContent: doc.rawContent,
                    headings: []
                };
                
                console.log(`재분석 시작: ${doc.title}, 내용 길이: ${parsed.textContent.length}`);
                
                const analysis = await this.analyzeWithAI(parsed);
                
                doc.title = analysis.title || doc.title;
                doc.summary = analysis.summary || doc.summary;
                doc.tags = analysis.tags || doc.tags;
                doc.collection = analysis.collection || doc.collection;
                doc.keywords = analysis.keywords || doc.keywords;
                doc.ir = analysis.ir || {};
                doc.analyzing = false;
                
                console.log(`재분석 완료: ${doc.title}`, doc.ir);
            } catch (error) {
                console.error(`재분석 오류 (${doc.title}):`, error);
                doc.analyzing = false;
                doc.ir = {};
            }
        }
        
        this.rebuildIndexes();
        this.saveSettings();
        this.renderCurrentView();
        this.updateSidebar();
        this.renderCompareResult();
        
        alert('재분석이 완료되었습니다!');
    }
    
    // 교집합 구하기
    getIntersection(sets) {
        if (sets.length === 0) return new Set();
        return sets.reduce((acc, set) => 
            new Set([...acc].filter(x => set.has(x)))
        );
    }
    
    getDifferentTags(docs, commonTags) {
        const results = [];
        docs.forEach(doc => {
            const unique = doc.tags.filter(t => !commonTags.has(t));
            if (unique.length > 0) {
                results.push(`<li><strong>${this.escapeHtml(doc.title)}</strong>에만 있는 태그: ${unique.map(t => `#${t}`).join(', ')}</li>`);
            }
        });
        return results.join('');
    }
    
    getDifferentKeywords(docs, commonKeywords) {
        const results = [];
        docs.forEach(doc => {
            const unique = (doc.keywords || []).filter(k => !commonKeywords.has(k));
            if (unique.length > 0) {
                results.push(`<li><strong>${this.escapeHtml(doc.title)}</strong>에만 있는 키워드: ${unique.join(', ')}</li>`);
            }
        });
        return results.join('');
    }
    
    toggleFavorite(id) {
        const doc = this.documents.find(d => String(d.id) === String(id));
        if (doc) {
            doc.favorite = !doc.favorite;
            this.saveSettings();
            this.renderCurrentView();
            this.updateSidebar();
            
            // Update modal if open
            if (!this.detailModal.hidden) {
                this.showDocumentDetail(id);
            }
        }
    }

    // ========================================
    // Export
    // ========================================
    
    showExportModal() {
        this.exportModal.hidden = false;
    }
    
    closeExportModal() {
        this.exportModal.hidden = true;
    }
    
    exportTo(format) {
        const docs = this.getFilteredDocs();
        
        switch (format) {
            case 'json':
                this.downloadFile(
                    JSON.stringify(docs.map(d => ({
                        filename: d.filename,
                        title: d.title,
                        summary: d.summary,
                        tags: d.tags,
                        collection: d.collection,
                        keywords: d.keywords
                    })), null, 2),
                    'docscan_export.json',
                    'application/json'
                );
                break;
                
            case 'csv':
                const csv = [
                    ['파일명', '제목', '요약', '태그', '컬렉션'].join(','),
                    ...docs.map(d => [
                        `"${d.filename}"`,
                        `"${d.title.replace(/"/g, '""')}"`,
                        `"${d.summary.replace(/"/g, '""')}"`,
                        `"${d.tags.join(', ')}"`,
                        `"${d.collection || ''}"`
                    ].join(','))
                ].join('\n');
                this.downloadFile(csv, 'docscan_export.csv', 'text/csv');
                break;
                
            case 'notion':
                const notionMd = `# DocScan 문서 목록

${docs.map(d => `
## ${d.title}

- **파일**: ${d.filename}
- **컬렉션**: ${d.collection || '일반'}
- **태그**: ${d.tags.map(t => `#${t}`).join(' ')}

${d.summary}

---
`).join('\n')}`;
                this.downloadFile(notionMd, 'docscan_notion.md', 'text/markdown');
                alert('Markdown 파일을 Notion에 Import 하세요:\nSettings > Import > Markdown');
                break;
                
            case 'obsidian':
                const obsidianContent = docs.map(d => `# ${d.title}

**파일**: ${d.filename}
**컬렉션**: [[${d.collection || '일반'}]]
**태그**: ${d.tags.map(t => `#${t}`).join(' ')}

## 요약
${d.summary}

## 관련 문서
${(this.similarities.get(d.id) || []).slice(0, 3).map(sim => {
    const simDoc = this.documents.find(dd => dd.id === sim.id);
    return simDoc ? `- [[${simDoc.title}]] (${sim.score}% 유사)` : '';
}).join('\n')}
`).join('\n---\n\n');
                this.downloadFile(obsidianContent, 'docscan_obsidian.md', 'text/markdown');
                break;
                
            case 'markdown':
                const toc = `# 📚 문서 목차

${[...this.collections.entries()].map(([col, ids]) => `
## ${col}

${ids.map(id => {
    const d = this.documents.find(dd => dd.id === id);
    return d ? `- **${d.title}** - ${d.summary.slice(0, 50)}...` : '';
}).join('\n')}
`).join('\n')}`;
                this.downloadFile(toc, 'docscan_toc.md', 'text/markdown');
                break;
        }
    }
    
    downloadFile(content, filename, type) {
        const blob = new Blob([content], { type: type + ';charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    // ========================================
    // Utility
    // ========================================
    
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.docScan = new DocScanPro();
});
