# WGrape.github.io
WGrape的个人网站，托管于github.io

## 本地运行

使用 Docker 启动本地预览（推荐）：

```bash
# 删除生成的静态页面
rm -rf ./_site

docker run --rm -it \
  -v "$PWD:/srv/jekyll" \
  -p 4000:4000 \
  jekyll/jekyll:4 \
  sh -c "gem install webrick --no-document && jekyll serve --host 0.0.0.0 --incremental"
```

启动后访问：http://localhost:4000

### 常用命令

```bash
# 启动（首次运行会自动安装依赖）
docker run --rm -it -v "$PWD:/srv/jekyll" -p 4000:4000 jekyll/jekyll:4 sh -c "gem install webrick --no-document && jekyll serve --host 0.0.0.0 --incremental"

# 停止：在运行终端按 Ctrl+C

# 重新构建（清除缓存后构建）
docker run --rm -it -v "$PWD:/srv/jekyll" jekyll/jekyll:4 jekyll clean
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
├── about.html          # 关于页
├── index.html         # 首页
├── tags.html          # 标签页
├── 404.html          # 404 页
├── _config.yml        # Jekyll 配置文件
└── Gemfile           # Ruby 依赖
```

## 注意事项

- 由于 GitHub Pages 以 UTC 时间为准，凌晨提交新文章时，若文章文件名中的日期是当天，可能不会被识别。解决办法：将文章日期改为昨天，或等当天晚些时候再提交。
- 友情链接中属于站内页面（如博客、关于）请使用相对路径（`/blog/`、`/about/`），不要写完整域名，否则本地预览会跳转到外部。
- `css/hux-blog.css` 为手动维护文件，已删除 `less/` 源码目录，不再使用 Grunt 构建流程。
