# 深度废话文学生成器

> 将无聊话题转化为形式严谨但内容空洞的幽默文本

## 项目简介

深度废话文学生成器是一个基于 Node.js + Express 的全栈网页应用，支持多种文体、废话密度调节、套娃模式、成就系统、PDF导出等功能。前端采用 Tailwind CSS，支持 Markdown 渲染和打印机动画，后端可选接入 DeepSeek LLM。

---

## 主要功能
- 主题输入、废话强度调节、文体选择
- 逐字打印机动画、打印音效、成就系统
- 支持 Markdown 富文本渲染
- 套娃模式（循环生成）
- 彩蛋（如996、优化等）
- PDF导出（仿公文格式）

---

## 依赖环境
- Node.js >= 16
- npm >= 8
- 推荐 Linux/Windows 服务器

---

## 快速部署

### 1. 克隆项目
```bash
git clone https://github.com/your-username/nonsense-literature-generator.git
cd nonsense-literature-generator
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
在项目根目录新建 `.env` 文件，内容如下：
```env
NODE_ENV=production
PORT=3000
# DeepSeek API Key（可选）
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

### 4. 启动服务
```bash
npm start
```

浏览器访问：http://服务器IP:3000

---

## Docker 部署

### 1. 构建镜像
```bash
docker build -t nonsense-generator .
```

### 2. 运行容器
```bash
docker run -d -p 3000:3000 --env-file .env --name nonsense-generator nonsense-generator
```

---

## 目录结构
```
├── public/           # 前端静态资源
│   ├── index.html
│   └── app.js
├── server.js         # Express后端
├── package.json
├── Dockerfile
├── .env.example
├── test.js           # 测试用例
├── demo.js           # 演示脚本
└── README.md
```

---

## 常见问题

**1. 如何设置 DeepSeek API Key？**
- 在 `.env` 文件中添加 `DEEPSEEK_API_KEY=你的key`，重启服务即可。

**2. 端口如何修改？**
- 修改 `.env` 文件中的 `PORT` 变量。

**3. 访问不了网页？**
- 检查服务器防火墙是否放行 3000 端口。
- 检查 Node.js 是否正常运行。

**4. 如何自定义前端样式？**
- 修改 `public/index.html` 和 `public/app.js`，支持 Tailwind CSS。

**5. 如何一键测试？**
```bash
npm test
```

---

## 贡献与反馈
- 欢迎 PR 和 Issue
- 仅供娱乐与学习，生成内容请勿用于正式场合

---

**版权所有 © 2024 深度废话文学研究院** 