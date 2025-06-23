// 深度废话文学生成器前端逻辑
class NonsenseGenerator {
    constructor() {
        this.currentContent = '';
        this.isGenerating = false;
        this.typewriterSpeed = 50; // 打字速度(ms)

        this.initElements();
        this.bindEvents();
        this.initAnimations();
    }

    initElements() {
        // 输入元素
        this.topicInput = document.getElementById('topicInput');
        this.densitySlider = document.getElementById('densitySlider');
        this.densityValue = document.getElementById('densityValue');
        this.styleRadios = document.querySelectorAll('input[name="style"]');
        this.nestedMode = document.getElementById('nestedMode');

        // 按钮元素
        this.generateBtn = document.getElementById('generateBtn');
        this.exportBtn = document.getElementById('exportBtn');

        // 显示元素
        this.loadingAnimation = document.getElementById('loadingAnimation');
        this.resultArea = document.getElementById('resultArea');
        this.typewriterText = document.getElementById('typewriterText');
        this.wordCount = document.getElementById('wordCount');
        this.achievements = document.getElementById('achievements');
        this.nestedResults = document.getElementById('nestedResults');
        this.nestedContent = document.getElementById('nestedContent');
        this.contentDisplay = document.getElementById('contentDisplay');

        // 音效元素
        this.printSound = document.getElementById('printSound');
        this.pageSound = document.getElementById('pageSound');
    }

    bindEvents() {
        // 密度滑块事件
        this.densitySlider.addEventListener('input', (e) => {
            this.densityValue.textContent = e.target.value;
            this.updateBackgroundDensity(e.target.value);
        });

        // 生成按钮事件
        this.generateBtn.addEventListener('click', () => {
            this.generateNonsense();
        });

        // 导出按钮事件
        this.exportBtn.addEventListener('click', () => {
            this.exportToPDF();
        });

        // 回车键生成
        this.topicInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.generateNonsense();
            }
        });

        // 输入框焦点事件
        this.topicInput.addEventListener('focus', () => {
            this.topicInput.classList.add('ring-2', 'ring-neon-yellow');
        });

        this.topicInput.addEventListener('blur', () => {
            this.topicInput.classList.remove('ring-2', 'ring-neon-yellow');
        });
    }

    initAnimations() {
        // 初始化背景密度
        this.updateBackgroundDensity(this.densitySlider.value);

        // 添加一些初始动画
        this.addFloatingElements();
    }

    updateBackgroundDensity(density) {
        // 移除所有密度类
        this.contentDisplay.classList.remove('density-1', 'density-2', 'density-3', 'density-4', 'density-5');

        // 添加当前密度类
        this.contentDisplay.classList.add(`density-${density}`);
    }

    addFloatingElements() {
        // 添加一些浮动的几何元素作为装饰
        const generationArea = document.querySelector('.generation-area');

        for (let i = 0; i < 5; i++) {
            const element = document.createElement('div');
            element.className = 'absolute w-2 h-2 bg-neon-yellow opacity-20 rounded-full';
            element.style.left = Math.random() * 100 + '%';
            element.style.top = Math.random() * 100 + '%';
            element.style.animationDelay = Math.random() * 3 + 's';
            element.style.animation = 'float 4s ease-in-out infinite';
            generationArea.appendChild(element);
        }
    }

    async generateNonsense() {
        if (this.isGenerating) return;

        const topic = this.topicInput.value.trim();
        const density = parseInt(this.densitySlider.value);
        const style = document.querySelector('input[name="style"]:checked').value;
        const isNested = this.nestedMode.checked;

        if (!topic) {
            this.showNotification('请输入一个话题', 'warning');
            return;
        }

        this.isGenerating = true;
        this.showLoading();

        try {
            if (isNested) {
                await this.generateNestedNonsense(topic, density, style);
            } else {
                await this.generateSingleNonsense(topic, density, style);
            }
        } catch (error) {
            console.error('生成失败:', error);
            this.showNotification('生成失败，请稍后重试', 'error');
        } finally {
            this.isGenerating = false;
            this.hideLoading();
        }
    }

    async generateSingleNonsense(topic, density, style) {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ topic, density, style })
        });

        if (!response.ok) {
            throw new Error('API请求失败');
        }

        const result = await response.json();
        this.currentContent = result.content;

        this.displayResult(result);
        this.enableExport();

        // 播放生成音效
        this.playPrintSound();
    }

    async generateNestedNonsense(topic, density, style) {
        const response = await fetch('/api/nested-generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ topic, density, style })
        });

        if (!response.ok) {
            throw new Error('套娃API请求失败');
        }

        const result = await response.json();
        this.displayNestedResults(result.results);
        this.enableExport();

        // 播放翻页音效
        this.playPageSound();
    }

    displayResult(result) {
        this.hideNestedResults();
        this.resultArea.classList.remove('hidden');

        // 更新字数统计
        this.wordCount.textContent = `字数：${result.wordCount}`;

        // 更新成就
        this.updateAchievements(result.achievements);

        // 开始打字机效果
        this.startTypewriter(result.content);
    }

    displayNestedResults(results) {
        this.resultArea.classList.add('hidden');
        this.nestedResults.classList.remove('hidden');

        this.nestedContent.innerHTML = '';

        results.forEach((result, index) => {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'bg-black bg-opacity-50 p-4 rounded-lg border border-neon-yellow';

            resultDiv.innerHTML = `
                <div class="flex justify-between items-center mb-2">
                    <h4 class="text-neon-yellow font-bold">第${result.round}轮生成</h4>
                    <span class="text-sm text-gray-300">字数：${result.wordCount}</span>
                </div>
                <div class="text-sm text-gray-400 mb-2">原始话题：${result.originalTopic}</div>
                <div class="typewriter-text text-white text-sm">${result.content}</div>
                ${result.achievements.length > 0 ? `
                    <div class="flex space-x-2 mt-2">
                        ${result.achievements.map(achievement =>
                `<span class="achievement-badge px-2 py-1 text-xs rounded">${achievement}</span>`
            ).join('')}
                    </div>
                ` : ''}
            `;

            this.nestedContent.appendChild(resultDiv);
        });
    }

    updateAchievements(achievements) {
        this.achievements.innerHTML = '';

        achievements.forEach(achievement => {
            const badge = document.createElement('span');
            badge.className = 'achievement-badge px-2 py-1 text-xs rounded';
            badge.textContent = achievement;
            this.achievements.appendChild(badge);
        });
    }

    startTypewriter(text) {
        this.typewriterText.textContent = '';
        let index = 0;
        let currentText = '';

        const typeNextChar = () => {
            if (index < text.length) {
                currentText += text[index];
                index++;

                // 播放打字音效
                if (index % 10 === 0) {
                    this.playPrintSound();
                }

                // 渲染Markdown内容
                this.renderMarkdown(currentText);

                setTimeout(typeNextChar, this.typewriterSpeed);
            } else {
                // 打字完成，播放翻页音效
                this.playPageSound();
            }
        };

        typeNextChar();
    }

    renderMarkdown(text) {
        try {
            // 配置marked选项
            marked.setOptions({
                breaks: true, // 支持换行
                gfm: true,    // 支持GitHub风格的Markdown
                sanitize: false // 允许HTML标签
            });

            // 渲染Markdown
            const htmlContent = marked.parse(text);
            this.typewriterText.innerHTML = htmlContent;
        } catch (error) {
            // 如果Markdown解析失败，回退到纯文本
            console.warn('Markdown解析失败，使用纯文本显示:', error);
            this.typewriterText.textContent = text;
        }
    }

    showLoading() {
        this.loadingAnimation.classList.remove('hidden');
        this.resultArea.classList.add('hidden');
        this.nestedResults.classList.add('hidden');
        this.generateBtn.disabled = true;
        this.generateBtn.innerHTML = '<span class="mr-2">⏳</span>生成中...';
    }

    hideLoading() {
        this.loadingAnimation.classList.add('hidden');
        this.generateBtn.disabled = false;
        this.generateBtn.innerHTML = '<span class="mr-2">🎪</span>深度废话';
    }

    hideNestedResults() {
        this.nestedResults.classList.add('hidden');
    }

    enableExport() {
        this.exportBtn.disabled = false;
        this.exportBtn.classList.remove('opacity-50');
    }

    async exportToPDF() {
        if (!this.currentContent) {
            this.showNotification('没有可导出的内容', 'warning');
            return;
        }

        const style = document.querySelector('input[name="style"]:checked').value;

        try {
            const response = await fetch('/api/export-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: this.currentContent, style })
            });

            if (!response.ok) {
                throw new Error('导出失败');
            }

            // 创建下载链接
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `深度废话文学_${style}_${new Date().toISOString().slice(0, 10)}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            this.showNotification('导出成功！', 'success');

        } catch (error) {
            console.error('导出失败:', error);
            this.showNotification('导出失败，请稍后重试', 'error');
        }
    }

    playPrintSound() {
        if (this.printSound) {
            this.printSound.currentTime = 0;
            this.printSound.play().catch(() => {
                // 忽略音频播放错误
            });
        }
    }

    playPageSound() {
        if (this.pageSound) {
            this.pageSound.currentTime = 0;
            this.pageSound.play().catch(() => {
                // 忽略音频播放错误
            });
        }
    }

    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-medium z-50 transform transition-all duration-300 translate-x-full`;

        // 根据类型设置样式
        switch (type) {
            case 'success':
                notification.classList.add('bg-green-500');
                break;
            case 'error':
                notification.classList.add('bg-red-500');
                break;
            case 'warning':
                notification.classList.add('bg-yellow-500');
                break;
            default:
                notification.classList.add('bg-blue-500');
        }

        notification.textContent = message;
        document.body.appendChild(notification);

        // 显示动画
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        // 自动隐藏
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // 特殊彩蛋处理
    handleEasterEggs(topic) {
        if (topic.includes('996')) {
            this.showNotification('检测到996，已自动插入《劳动法》条款', 'info');
        }

        if (topic.includes('优化')) {
            this.showNotification('检测到"优化"关键词，已添加特殊注释', 'info');
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    const generator = new NonsenseGenerator();

    // 添加一些有趣的初始提示
    const topics = [
        '数字化转型',
        '提升团队协同效率',
        '敏捷开发方法论',
        '企业文化建设',
        '产品经理的自我修养',
        '程序员职业规划',
        '项目管理最佳实践',
        '用户体验设计思维'
    ];

    // 随机选择一个话题作为示例
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    document.getElementById('topicInput').placeholder = `请输入一个正经话题，比如'${randomTopic}'`;

    // 添加一些初始动画效果
    setTimeout(() => {
        generator.showNotification('欢迎使用深度废话文学生成器！🎪', 'success');
    }, 1000);

    // 添加键盘快捷键
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            generator.generateNonsense();
        }
    });

    // 添加一些有趣的鼠标悬停效果
    const elements = document.querySelectorAll('.achievement-badge, .briefcase');
    elements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'scale(1.1) rotate(5deg)';
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1) rotate(0deg)';
        });
    });
});

// 添加一些全局的CSS样式增强
const style = document.createElement('style');
style.textContent = `
    .slider::-webkit-slider-thumb {
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #E53E3E;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    
    .slider::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #E53E3E;
        cursor: pointer;
        border: none;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    
    .achievement-badge:hover {
        transform: scale(1.05) rotate(2deg);
        transition: all 0.2s ease;
    }
    
    .typewriter-text::after {
        content: '|';
        animation: blink 1s infinite;
    }
    
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
`;
document.head.appendChild(style); 