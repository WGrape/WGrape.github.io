---
layout:     post
title:      parseAOF项目讲解之如何快速解析Redis的AOF文件
catalog: true
tags:
- Redis
---

> 文章内容更新请以 [WGrape GitHub博客 : parseAOF项目讲解之如何快速解析Redis的AOF文件](https://github.com/WGrape/Blog/issues/11) 为准

## 目录
- [一、项目介绍](#1)
- [二、架构设计](#2)
- &nbsp;&nbsp;&nbsp; [1、切割文件](#21)
- &nbsp;&nbsp;&nbsp; [2、解析文件](#22)
- &nbsp;&nbsp;&nbsp; [3、合并文件](#23)
- [三、解析原理](#3)

## <span id="1">一、项目介绍</span>

![intro](https://user-images.githubusercontent.com/35942268/144971898-8aabbbbb-9ae5-4c1e-8ba1-b5d8dab1dd8f.png)

[parseAOF](https://github.com/WGrape/parseAOF) 项目是一个用```Go```和```Shell```结合开发的一个快速解析AOF文件的工具，用于实现从```AOF文件```到```命令列表文件```的转换。使用简单，通过以下命令即可使用

```bash
bash ./start.sh /path/appendonly.aof
```

## <span id="2">二、架构设计</span>

![image](https://user-images.githubusercontent.com/35942268/145674949-1459562a-4555-493b-9aea-ed1d7d3f23a4.png)

### <span id="21">1、切割文件</span>

通过```split```命令以字节数先将AOF文件切割成N份

> 虽然```split```命令支持行数、和字节数这两种切割文件的方式，但当行数超过万级以上时，以字节数切割的方式性能效率会明显更高

### <span id="22">2、解析文件</span>

当切割完文件后，会自动启动Go程序，以每个协程处理一个```split file```的方式去解析内容，并生成对应的```parsed file```

> 默认的最大协程数为1024，也就是说只有当```split file```的数量低于1024个时，才能达到每个```split file```都会有一个协程解析处理的情况

### <span id="23">3、合并文件</span>

当Go程序结束时，所有的```split file```都已经被解析完毕，且都生成了对应的```parsed file```，这时会再自动拼接所有的```parsed file```生成一个```merged file```

## <span id="3">三、解析原理</span>

<img width="629" alt="parsed" src="https://user-images.githubusercontent.com/35942268/145675487-21ddd6ca-f90e-4e71-aad3-d43a33c55044.png">

生成```parsed file```文件的原理，是先用```MatchLine()```函数一行一行解析AOF文件内容，最后再通过```TranslateToPlainText()```函数转成纯文本，并写入```parsed file```文件中

```txt
1、如果内容成功匹配 "^\\*\\d$" ，则此行内容是命令开始类型 ```MatchTypeCmdStart```
2、如果内容成功匹配 "^\\$\\d$" ，则此行内容是原生参数类型 ```MatchTypeArgRaw```
```
