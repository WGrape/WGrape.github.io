# WGrape.github.io
WGrape的个人网站，托管于github.io

<img width="2559" height="1351" alt="Image" src="https://github.com/user-attachments/assets/5935b1e3-0047-4bf1-8905-8856ec984083" />

## 本地运行

### 使用 Docker Compose（推荐）

适用于 Apple Silicon (arm64) 和 Intel (amd64) 架构：

```bash
# 启动（首次会自动构建镜像）
docker compose up

# 后台运行
docker compose up -d

# 停止
docker compose down

# 重新构建镜像
docker compose up --build
```

### 使用 Docker 命令

```bash
# 构建镜像
docker build -t wgrape-blog .

# 运行
docker run -p 4000:4000 -v $(pwd):/srv/jekyll wgrape-blog
```

启动后访问：http://localhost:4000

### 常用命令

```bash
# 清理所有容器和镜像
docker compose down --rmi all

# 清理 Jekyll 缓存
docker compose run --rm jekyll bundle exec jekyll clean
```

## 项目结构

```
├── _includes/          # 可复用 HTML 片段（nav、footer、sidebar 等）
├── _layouts/          # 页面布局模板
├── _posts/            # 博客文章（Markdown 格式）
├── _site/             # Jekyll 构建产物（不要手动修改）
├── blog/              # 博客列表页
├── css/               # 样式文件（已删除 less/，只维护 css/）
├── img/               # 图片资源
├── js/                # JavaScript 文件
├── pages/             # 其他页面（开源项目等）
├── about.html          # 关于页
├── index.html         # 首页
├── tags.html          # 标签页
├── 404.html          # 404 页
├── _config.yml        # Jekyll 配置文件
├── Gemfile           # Ruby 依赖
├── Dockerfile        # Docker 镜像配置
└── docker-compose.yml # Docker Compose 配置
```

## 注意事项

- 由于 GitHub Pages 以 UTC 时间为准，凌晨提交新文章时，若文章文件名中的日期是当天，可能不会被识别。解决办法：将文章日期改为昨天，或等当天晚些时候再提交。
- 友情链接中属于站内页面（如博客、关于）请使用相对路径（`/blog/`、`/about/`），不要写完整域名，否则本地预览会跳转到外部。
- `css/hux-blog.css` 为手动维护文件，已删除 `less/` 源码目录，不再使用 Grunt 构建流程。
- Docker 配置使用多架构支持的 ruby 基础镜像，兼容 Apple Silicon 和 Intel 芯片。
