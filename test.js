// 深度废话文学生成器测试用例
const axios = require('axios');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

async function runTests() {
    console.log('🧪 开始运行深度废话文学生成器测试...\n');

    const tests = [
        {
            name: '健康检查测试',
            test: async () => {
                const response = await axios.get(`${BASE_URL}/api/health`);
                return response.status === 200 && response.data.status === 'ok';
            }
        },
        {
            name: '基础生成测试',
            test: async () => {
                const response = await axios.post(`${BASE_URL}/api/generate`, {
                    topic: '提升团队协同效率',
                    density: 3,
                    style: '学术论文'
                });
                return response.status === 200 &&
                    response.data.content &&
                    response.data.wordCount > 0;
            }
        },
        {
            name: '高密度废话测试',
            test: async () => {
                const response = await axios.post(`${BASE_URL}/api/generate`, {
                    topic: '数字化转型',
                    density: 5,
                    style: '领导讲话'
                });
                return response.status === 200 &&
                    response.data.content &&
                    response.data.achievements.length > 0;
            }
        },
        {
            name: '套娃模式测试',
            test: async () => {
                const response = await axios.post(`${BASE_URL}/api/nested-generate`, {
                    topic: '敏捷开发',
                    density: 4,
                    style: '产品说明'
                });
                return response.status === 200 &&
                    response.data.results &&
                    response.data.results.length === 3;
            }
        },
        {
            name: '特殊彩蛋测试 - 996',
            test: async () => {
                const response = await axios.post(`${BASE_URL}/api/generate`, {
                    topic: '996工作制',
                    density: 2,
                    style: '学术论文'
                });
                return response.status === 200 &&
                    response.data.content.includes('劳动法');
            }
        },
        {
            name: '特殊彩蛋测试 - 优化',
            test: async () => {
                const response = await axios.post(`${BASE_URL}/api/generate`, {
                    topic: '团队优化',
                    density: 3,
                    style: '领导讲话'
                });
                return response.status === 200 &&
                    response.data.content.includes('删除50%员工');
            }
        },
        {
            name: 'PDF导出测试',
            test: async () => {
                const response = await axios.post(`${BASE_URL}/api/export-pdf`, {
                    content: '这是一个测试内容',
                    style: '学术论文'
                });
                return response.status === 200 &&
                    response.headers['content-type'].includes('text/html');
            }
        }
    ];

    let passedTests = 0;
    let totalTests = tests.length;

    for (const testCase of tests) {
        try {
            console.log(`📋 运行测试: ${testCase.name}`);
            const result = await testCase.test();

            if (result) {
                console.log(`✅ ${testCase.name} - 通过`);
                passedTests++;
            } else {
                console.log(`❌ ${testCase.name} - 失败`);
            }
        } catch (error) {
            console.log(`❌ ${testCase.name} - 错误: ${error.message}`);
        }
        console.log('');
    }

    console.log(`📊 测试结果: ${passedTests}/${totalTests} 通过`);

    if (passedTests === totalTests) {
        console.log('🎉 所有测试通过！深度废话文学生成器运行正常。');
        process.exit(0);
    } else {
        console.log('⚠️  部分测试失败，请检查应用状态。');
        process.exit(1);
    }
}

// 运行测试
if (require.main === module) {
    runTests().catch(error => {
        console.error('测试运行失败:', error);
        process.exit(1);
    });
}

module.exports = { runTests }; 