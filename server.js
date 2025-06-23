const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 废话词汇库
const nonsenseWords = [
    '赋能', '抓手', '生态', '闭环', '沉淀', '认知盈余', '数字孪生', '区块链思维',
    '元宇宙', '范式迁移', '顶层设计', '价值闭环', '能力边界', '垂直领域',
    '新常态', '去中心化', '重构', '击穿', '颗粒度', '方法论', '框架',
    '路径', '核心', '导向', '思维', '思维模式', '价值', '价值创造',
    '协同', '协同效应', '协同机制', '协同体系', '协同平台', '协同生态'
];

// 同义反复模板
const tautologyTemplates = [
    '本质上就是', '归根结底是', '从根本上看', '从本质上讲', '实际上就是',
    '说白了就是', '简单来说就是', '用通俗的话说就是', '从另一个角度看就是'
];

// 假大空观点模板
const emptyStatements = [
    '在数字宇宙新纪元中重构价值范式',
    '通过去中心化思维击穿传统边界',
    '建立面向未来的生态闭环体系',
    '在认知盈余时代沉淀核心价值',
    '用区块链思维重构协同机制',
    '在元宇宙导向下建立新范式',
    '通过数字孪生技术赋能传统产业',
    '在垂直领域建立价值创造闭环'
];

// 生成废话文本的核心函数
function generateNonsense(topic, density, style) {
    let content = '';
    const wordCount = 500;
    let currentCount = 0;

    // 根据文体选择开头
    const styleOpenings = {
        '学术论文': `# 关于${topic}的研究综述\n\n## 摘要\n本文从理论层面深入探讨${topic}的本质内涵，通过多维度分析揭示其内在逻辑。`,
        '领导讲话': `# 关于${topic}的重要讲话\n\n**同志们：**\n\n今天，我们在这里召开专题会议，重点研究${topic}这一重要课题。`,
        '产品说明': `# ${topic}产品说明书\n\n## 产品概述\n本产品致力于解决${topic}领域的核心痛点，为用户提供全方位解决方案。`,
        '星座运势': `# ${topic}星座运势分析\n\n**亲爱的用户：**\n\n根据最新星象分析，${topic}将在未来周期内呈现新的发展态势。`
    };

    content += styleOpenings[style] || styleOpenings['学术论文'];
    currentCount += content.length;

    // 生成主体内容
    while (currentCount < wordCount) {
        // 随机选择废话生成策略
        const strategy = Math.floor(Math.random() * 4);

        switch (strategy) {
            case 0: // 同义反复
                const tautology = tautologyTemplates[Math.floor(Math.random() * tautologyTemplates.length)];
                const repetition = `${topic}${tautology}${topic}的体现。`;
                content += repetition;
                currentCount += repetition.length;
                break;

            case 1: // 万能术语
                const wordCount = Math.floor(Math.random() * 3) + 1;
                let termSentence = '通过';
                for (let i = 0; i < wordCount; i++) {
                    const word = nonsenseWords[Math.floor(Math.random() * nonsenseWords.length)];
                    termSentence += word + (i < wordCount - 1 ? '、' : '');
                }
                termSentence += `来${topic}。`;
                content += termSentence;
                currentCount += termSentence.length;
                break;

            case 2: // 假大空观点
                const emptyStatement = emptyStatements[Math.floor(Math.random() * emptyStatements.length)];
                content += emptyStatement + '。';
                currentCount += emptyStatement.length + 1;
                break;

            case 3: // 数字列表
                const listCount = Math.floor(Math.random() * 3) + 2;
                content += '\n\n### 具体而言，可以从以下几个方面着手：\n\n';
                for (let i = 1; i <= listCount; i++) {
                    const listItem = `${i}. 在${nonsenseWords[Math.floor(Math.random() * nonsenseWords.length)]}中${topic}。`;
                    content += listItem + '\n';
                    currentCount += listItem.length + 1;
                }
                break;
        }

        // 添加过渡句
        if (Math.random() < 0.3) {
            const transitions = [
                '需要强调的是，', '值得注意的是，', '必须指出的是，', '值得关注的是，',
                '需要进一步说明的是，', '有必要强调的是，', '需要特别注意的是，'
            ];
            const transition = transitions[Math.floor(Math.random() * transitions.length)];
            content += transition;
            currentCount += transition.length;
        }
    }

    // 添加标准结尾
    const endings = {
        '学术论文': '\n\n## 结论\n本研究从多角度分析了' + topic + '的相关问题，但仍存在一定的局限性，需要进一步深入研究。',
        '领导讲话': '\n\n**同志们，**' + topic + '是一项长期而艰巨的任务，需要我们持续努力，不断探索。',
        '产品说明': '\n\n## 总结\n本产品在' + topic + '方面具有显著优势，但仍有改进空间，我们将持续优化。',
        '星座运势': '\n\n## 总结\n关于' + topic + '的运势分析到此结束，具体情况还需结合个人实际情况。'
    };

    content += endings[style] || endings['学术论文'];

    // 特殊彩蛋处理
    if (topic.includes('996')) {
        content += '\n\n> **注：**《劳动法》第三十六条规定：国家实行劳动者每日工作时间不超过八小时、平均每周工作时间不超过四十四小时的工时制度。';
    }

    if (content.includes('优化')) {
        content += '\n\n> **注：**此处应删除50%员工';
    }

    return {
        content: content,
        wordCount: content.length,
        achievements: getAchievements(content)
    };
}

// 获取成就
function getAchievements(content) {
    const achievements = [];

    // 检查重复关键词
    const words = content.split(/[，。！？\s]/);
    const wordCount = {};
    words.forEach(word => {
        if (word.length > 1) {
            wordCount[word] = (wordCount[word] || 0) + 1;
        }
    });

    const repeatedWords = Object.entries(wordCount).filter(([word, count]) => count > 10);
    if (repeatedWords.length > 0) {
        achievements.push('车轱辘话大师🌟');
    }

    // 检查字数
    if (content.length > 1000) {
        achievements.push('当代八股圣手📜');
    }

    // 检查万能术语使用
    const nonsenseCount = nonsenseWords.filter(word => content.includes(word)).length;
    if (nonsenseCount > 15) {
        achievements.push('万能术语大师🎯');
    }

    return achievements;
}

// API路由
app.post('/api/generate', async (req, res) => {
    try {
        const { topic, density, style } = req.body;

        if (!topic || !density || !style) {
            return res.status(400).json({ error: '缺少必要参数' });
        }

        // 调用DeepSeek API（如果配置了的话）
        if (process.env.DEEPSEEK_API_KEY) {
            try {
                const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
                    model: 'deepseek-chat',
                    messages: [{
                        role: 'user',
                        content: `你是一个获得诺贝尔废话文学奖的专家，请针对"${topic}"生成500字${style}风格的文本，严格遵守：
1. 使用同义反复技巧(如:"经济增长本质上是经济体量的增加")
2. 必须包含至少${density}个万能术语("赋能"、"抓手"、"生态"等)
3. 包含3个假大空观点("在数字宇宙新纪元中重构价值范式")
4. 结尾必须总结为"需要进一步研究"`
                    }],
                    max_tokens: 1000,
                    temperature: 0.8
                }, {
                    headers: {
                        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });

                const aiContent = response.data.choices[0].message.content;
                const result = {
                    content: aiContent,
                    wordCount: aiContent.length,
                    achievements: getAchievements(aiContent)
                };

                return res.json(result);
            } catch (error) {
                console.log('DeepSeek API调用失败，使用本地生成器');
            }
        }

        // 使用本地生成器
        const result = generateNonsense(topic, density, style);
        res.json(result);

    } catch (error) {
        console.error('生成错误:', error);
        res.status(500).json({ error: '生成失败，请稍后重试' });
    }
});

// 套娃模式API
app.post('/api/nested-generate', async (req, res) => {
    try {
        const { topic, density, style } = req.body;
        const results = [];

        let currentTopic = topic;
        for (let i = 0; i < 3; i++) {
            const result = generateNonsense(currentTopic, density, style);
            results.push({
                round: i + 1,
                originalTopic: i === 0 ? topic : results[i - 1].content.substring(0, 50) + '...',
                ...result
            });
            currentTopic = result.content.substring(0, 100) + '...';
        }

        res.json({ results });
    } catch (error) {
        console.error('套娃生成错误:', error);
        res.status(500).json({ error: '套娃生成失败' });
    }
});

// 导出PDF API
app.post('/api/export-pdf', async (req, res) => {
    try {
        const { content, style } = req.body;

        // 这里可以集成PDF生成库，暂时返回HTML格式
        const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>深度废话文学 - ${style}</title>
        <style>
          body { font-family: 'SimSun', serif; margin: 40px; }
          .header { text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 30px; }
          .content { line-height: 1.8; text-indent: 2em; }
          .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); 
                      font-size: 48px; color: rgba(255,0,0,0.1); z-index: -1; }
        </style>
      </head>
      <body>
        <div class="watermark">机密文件</div>
        <div class="header">深度废话文学生成报告</div>
        <div class="content">${content.replace(/\n/g, '<br>')}</div>
      </body>
      </html>
    `;

        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Disposition', 'attachment; filename="nonsense-literature.html"');
        res.send(htmlContent);

    } catch (error) {
        console.error('PDF导出错误:', error);
        res.status(500).json({ error: 'PDF导出失败' });
    }
});

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: '深度废话文学生成器运行正常' });
});

// 主页路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 深度废话文学生成器已启动，端口: ${PORT}`);
    console.log(`📝 访问地址: http://localhost:${PORT}`);
}); 