// 深度废话文学生成器演示脚本
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function demo() {
    console.log('🎪 深度废话文学生成器演示\n');
    console.log('='.repeat(50));

    // 演示1：基础生成
    console.log('\n📝 演示1：基础废话生成');
    console.log('主题：提升团队协同效率');
    console.log('密度：5级（重度）');
    console.log('文体：领导讲话\n');

    try {
        const response1 = await axios.post(`${BASE_URL}/api/generate`, {
            topic: '提升团队协同效率',
            density: 5,
            style: '领导讲话'
        });

        console.log('生成结果：');
        console.log(response1.data.content);
        console.log(`\n字数：${response1.data.wordCount}`);
        console.log(`成就：${response1.data.achievements.join(', ')}`);

    } catch (error) {
        console.error('演示1失败:', error.message);
    }

    console.log('\n' + '='.repeat(50));

    // 演示2：套娃模式
    console.log('\n🎭 演示2：套娃模式生成');
    console.log('主题：敏捷开发');
    console.log('密度：4级');
    console.log('文体：产品说明\n');

    try {
        const response2 = await axios.post(`${BASE_URL}/api/nested-generate`, {
            topic: '敏捷开发',
            density: 4,
            style: '产品说明'
        });

        console.log('套娃模式结果：');
        response2.data.results.forEach((result, index) => {
            console.log(`\n第${result.round}轮：`);
            console.log(`原始话题：${result.originalTopic}`);
            console.log(`字数：${result.wordCount}`);
            console.log(`成就：${result.achievements.join(', ')}`);
            console.log('内容预览：' + result.content.substring(0, 100) + '...');
        });

    } catch (error) {
        console.error('演示2失败:', error.message);
    }

    console.log('\n' + '='.repeat(50));

    // 演示3：特殊彩蛋
    console.log('\n🥚 演示3：特殊彩蛋测试');
    console.log('主题：996工作制优化方案');
    console.log('密度：3级');
    console.log('文体：学术论文\n');

    try {
        const response3 = await axios.post(`${BASE_URL}/api/generate`, {
            topic: '996工作制优化方案',
            density: 3,
            style: '学术论文'
        });

        console.log('生成结果（包含彩蛋）：');
        console.log(response3.data.content);

        // 检查彩蛋
        if (response3.data.content.includes('劳动法')) {
            console.log('\n✅ 检测到996彩蛋：《劳动法》条款已自动插入');
        }

        if (response3.data.content.includes('删除50%员工')) {
            console.log('✅ 检测到优化彩蛋：特殊注释已添加');
        }

    } catch (error) {
        console.error('演示3失败:', error.message);
    }

    console.log('\n' + '='.repeat(50));

    // 演示4：不同文体对比
    console.log('\n📚 演示4：不同文体风格对比');
    console.log('主题：数字化转型');
    console.log('密度：3级\n');

    const styles = ['学术论文', '领导讲话', '产品说明', '星座运势'];

    for (const style of styles) {
        try {
            console.log(`\n${style}风格：`);
            const response = await axios.post(`${BASE_URL}/api/generate`, {
                topic: '数字化转型',
                density: 3,
                style: style
            });

            console.log('开头部分：');
            const lines = response.data.content.split('\n');
            console.log(lines.slice(0, 3).join('\n'));
            console.log(`字数：${response.data.wordCount}`);

        } catch (error) {
            console.error(`${style}生成失败:`, error.message);
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log('\n🎉 演示完成！');
    console.log('访问 http://localhost:3000 体验完整功能');
    console.log('按 Ctrl+C 停止服务器');
}

// 运行演示
if (require.main === module) {
    demo().catch(error => {
        console.error('演示运行失败:', error);
        process.exit(1);
    });
}

module.exports = { demo }; 