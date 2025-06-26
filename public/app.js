document.addEventListener('DOMContentLoaded', () => {
    let currentLang = 'zh-CN';
    let translations = {};

    const topicInput = document.getElementById('topic');
    const generateBtn = document.getElementById('generateBtn');
    const nestedBtn = document.getElementById('nestedBtn');
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const styleSelect = document.getElementById('style');
    const resultDiv = document.getElementById('result');
    const wordCountSpan = document.getElementById('wordCount');
    const loadingDiv = document.getElementById('loading');
    const achievementsContainer = document.getElementById('achievements');
    const langSwitcher = document.getElementById('language-switcher');

    // 套娃弹窗相关
    const nestedModal = document.getElementById('nestedModal');
    const closeModalBtn = document.getElementById('closeModal');
    const nestedResultsContainer = document.getElementById('nestedResultsContainer');

    let currentContentForExport = '';

    // 初始化
    async function init() {
        const savedLang = localStorage.getItem('lang') || navigator.language || 'zh-CN';
        await loadTranslations();
        // 修正 'zh' 为 'zh-CN' 或其他地区方言
        const supportedLangs = ['zh-CN', 'zh-TW', 'en', 'ja'];
        let langToSet = 'zh-CN';
        if (supportedLangs.includes(savedLang)) {
            langToSet = savedLang;
        } else if (supportedLangs.includes(savedLang.split('-')[0])) {
            langToSet = savedLang.split('-')[0];
        }

        langSwitcher.value = langToSet;
        await switchLanguage(langToSet);

        bindEvents();
    }

    async function loadTranslations() {
        const langs = ['zh-CN', 'zh-TW', 'en', 'ja'];
        for (const lang of langs) {
            try {
                const response = await fetch(`locales/${lang}.json`);
                translations[lang] = await response.json();
            } catch (error) {
                console.error(`Failed to load translation for ${lang}`, error);
                translations[lang] = {}; // Provide empty object as fallback
            }
        }
    }

    async function switchLanguage(lang) {
        localStorage.setItem('lang', lang);
        currentLang = lang;
        updateUI(lang);
    }

    function updateUI(lang) {
        currentLang = lang;
        const elements = document.querySelectorAll('[data-i18n-key]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n-key');
            if (translations[lang] && translations[lang][key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    if (el.type !== 'button') el.placeholder = translations[lang][key];
                } else if (el.tagName === 'OPTION') {
                    el.textContent = translations[lang][key];
                }
                else {
                    el.innerHTML = translations[lang][key];
                }
            }
        });
        document.documentElement.lang = lang;
        document.title = translations[lang]?.title || '深度废话文学生成器';
    }


    function bindEvents() {
        // 语言切换
        langSwitcher.addEventListener('change', (e) => {
            switchLanguage(e.target.value);
        });

        // 密度按钮
        document.querySelectorAll('.density-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.density-btn').forEach(b => b.classList.remove('ring-2', 'ring-red-500'));
                btn.classList.add('ring-2', 'ring-red-500');
            });
        });

        // 生成按钮
        generateBtn.addEventListener('click', handleGeneration);
        nestedBtn.addEventListener('click', handleNestedGeneration);
        exportPdfBtn.addEventListener('click', handleExport);

        // 关闭套娃弹窗
        closeModalBtn.addEventListener('click', () => {
            nestedModal.classList.add('hidden');
        });
    }

    async function handleGeneration() {
        const topic = topicInput.value.trim();
        const density = document.querySelector('.density-btn.ring-2')?.dataset.density || '30';
        const style = styleSelect.value;
        const lang = currentLang;

        if (!topic) {
            alert(translations[currentLang]?.topicPlaceholder || "Please enter a topic.");
            return;
        }

        // 禁用按钮并显示加载状态
        const originalButtonHTML = generateBtn.innerHTML;
        generateBtn.disabled = true;
        generateBtn.innerHTML = `<div class="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-full"></div> ${translations[currentLang].generatingButtonText}`;

        loadingDiv.classList.remove('hidden');
        achievementsContainer.innerHTML = '';
        resultDiv.innerHTML = '';

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, density, style, lang })
            });

            if (!response.ok) throw new Error('Generation failed');

            const data = await response.json();
            currentContentForExport = data.content;
            typewriter(resultDiv, data.content, () => {
                displayAchievements(data.achievements);
            });
            wordCountSpan.textContent = `${translations[currentLang].wordCountLabel}: ${data.wordCount}`;

        } catch (error) {
            console.error(error);
            resultDiv.innerHTML = '<p class="text-red-500">生成失败，请稍后再试。</p>';
        } finally {
            generateBtn.disabled = false;
            generateBtn.innerHTML = originalButtonHTML;
            loadingDiv.classList.add('hidden');
        }
    }

    async function handleNestedGeneration() {
        const topic = topicInput.value.trim();
        const density = document.querySelector('.density-btn.ring-2')?.dataset.density || '30';
        const style = styleSelect.value;
        const lang = currentLang;

        if (!topic) {
            alert(translations[currentLang]?.topicPlaceholder || "Please enter a topic.");
            return;
        }

        const originalButtonHTML = nestedBtn.innerHTML;
        nestedBtn.disabled = true;
        nestedBtn.innerHTML = `<div class="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-gray-800 rounded-full"></div> ${translations[currentLang].generatingButtonText}`;

        try {
            const response = await fetch('/api/nested-generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, density, style, lang })
            });

            if (!response.ok) throw new Error('Nested generation failed');

            const data = await response.json();
            displayNestedResults(data.results);

        } catch (error) {
            console.error(error);
            nestedResultsContainer.innerHTML = '<p class="text-red-500">套娃生成失败，请稍后再试。</p>';
        } finally {
            nestedBtn.disabled = false;
            nestedBtn.innerHTML = originalButtonHTML;
        }
    }

    function displayNestedResults(results) {
        nestedResultsContainer.innerHTML = '';
        results.forEach(result => {
            const roundDiv = document.createElement('div');
            roundDiv.className = 'border-b pb-4 mb-4';

            const renderedContent = marked.parse(result.content);

            roundDiv.innerHTML = `
                <h3 class="text-xl font-bold mb-2">Round ${result.round}</h3>
                <p class="text-sm text-gray-600 mb-2"><strong>Original Topic:</strong> ${result.originalTopic}</p>
                <div class="prose max-w-none">${renderedContent}</div>
                <div class="mt-2 text-sm"><strong>Word Count:</strong> ${result.wordCount}</div>
                <div class="mt-2 flex flex-wrap gap-2">
                    ${result.achievements.map(ach => `<span class="achievement-badge bg-yellow-400 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">${ach}</span>`).join('')}
                </div>
            `;
            nestedResultsContainer.appendChild(roundDiv);
        });
        nestedModal.classList.remove('hidden');
    }

    async function handleExport() {
        if (!currentContentForExport) {
            alert('没有可导出的内容。');
            return;
        }

        const style = styleSelect.value;
        try {
            const response = await fetch('/api/export-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: currentContentForExport, style: style })
            });

            if (!response.ok) throw new Error('Export failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `nonsense-literature-${new Date().toISOString().split('T')[0]}.html`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (error) {
            console.error(error);
            alert('导出失败。');
        }
    }

    function typewriter(element, text, callback) {
        let i = 0;
        element.innerHTML = '';
        const speed = 10;
        //var layout = '';
        element.innerHTML += '<p>';

        function type() {
            if (i < text.length) {
                const char = text.charAt(i);
                const renderedChar = marked.parse(char).trim() === '' ? char : marked.parse(char);
                //element.innerHTML += renderedChar;
                element.innerHTML += renderedChar.charAt(3);//<p>a</p>
                i++;
                setTimeout(type, speed);
                console.log(i);
            } else {
                element.innerHTML += '</p>';
                if (callback) callback();
            }
        }
        type();
    }

    function displayAchievements(achievements) {
        achievementsContainer.innerHTML = '';
        if (achievements && achievements.length > 0) {
            const title = document.createElement('h4');
            title.className = 'text-md font-semibold text-gray-600 w-full mb-2';
            title.textContent = translations[currentLang]?.achievementsTitle || "Achievements Unlocked";
            achievementsContainer.appendChild(title);

            achievements.forEach(ach => {
                const badge = document.createElement('span');
                badge.className = 'achievement-badge bg-yellow-400 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full';
                badge.textContent = ach;
                achievementsContainer.appendChild(badge);
            });
        }
    }

    init();
}); 