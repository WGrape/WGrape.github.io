---
layout:     post
title:      最全面又最浅显易懂的Langchain快速上手教程（上）
header-img: /img/post.png
catalog: true
tags:
- 人工智能
- LLM
- Langchain
---

> 文章内容更新请以 [WGrape GitHub博客 : 最全面又最浅显易懂的Langchain快速上手教程（上）](https://github.com/WGrape/Blog/issues/275) 为准

> 本文原创，著作权归[WGrape](https://github.com/WGrape)所有，未经授权，严禁转载

# 最全面又最浅显易懂的Langchain快速上手教程（上）

## 一. 前言
随着GPT模型的问世，大语言模型（LLM）时代已经来临。LLM的出现，使得人工智能在语言处理方面的能力得到了极大的提升。Langchain作为一个面向后端开发者的框架，旨在帮助开发者快速上手并利用LLM开发出强大的应用程序。本教程将为您提供一份全面的指南，帮助您快速掌握Langchain的使用方法！

## 二. 基础介绍

### 1. 什么是Langchain

Langchain是一个基于大语言模型的应用开发框架，随着社区的快速成长，它现在已不仅仅是一个开发框架，更多的是一个LLM应用的基建工程，提供从开发到上线整个闭环流程的全程支持。

<img width="500" src="https://github.com/WGrape/Blog/assets/35942268/51a09949-6e13-476b-afbe-3edb10ee9633">

所以当提到Langchain的时候，需要知道它起初只是一个比较简单的LLM应用开发框架，只是后来社区成长后，出现了一系列Langchain命名的项目，它们共同组成了现在的[Langchain社区](https://github.com/langchain-ai)。

### 2. Langchain的核心组成


#### (1) 四大部分
Langchain作为一个LLM应用的基建工程，整体是非常庞大的，从底向上主要分为四个部分

- LangChain Lib 库 ：主要包括core/community/experimental等Python库，源码位置 [langchain-ai/langchain/libs/](https://github.com/langchain-ai/langchain/tree/master/libs)
- LangChain Template 模板库 ：主要包括各种可参考和借鉴的LLM生产级别应用，源码位置 [langchain-ai/langchain/templates](https://github.com/langchain-ai/langchain/tree/master/templates)
- LangServe REST服务支持 ：主要用于将LLM应用部署为REST服务，源码位置 [langchain-ai/langserve](https://github.com/langchain-ai/langserve)
- LangSmith 开发者平台 ：主要包括LL应用从开发、测试、部署、运维于一体的Devops平台

<img width="360" src="https://github.com/WGrape/Blog/assets/35942268/0809b494-d04f-4356-ab8f-ec7cedb2e8f3">

#### (2) LangChain Lib结构

LangChain Lib从底向上主要包括LangChain-Core/LangChain-Community/LangChain(本身)三大部分

- LangChain-Core ：LangChain-Core是整个LangChain生态的抽象，比如```LangChain Expression Language（LCEL）``` ```language models```, ```document loaders```, ```embedding models```, ```vectorstores```, ```retrievers```等模块的抽象，源码位置 [langchain-ai/langchain/libs/core](https://github.com/langchain-ai/langchain/tree/master/libs/core)
- LangChain-Community ：LangChain-Community是对Core层抽象的实现，比如对```LangChain Expression Language（LCEL）``` ```language models```, ```document loaders```, ```embedding models```, ```vectorstores```, ```retrievers```等模块抽象的实现，源码位置 [langchain-ai/langchain/libs/community](https://github.com/langchain-ai/langchain/tree/master/libs/community/langchain_community)
- LangChain ：对LangChain-Community部分进行整合和适配，就构成了LangChain这个单一项目。只通过这一个LangChain项目就可以快速构建LLM应用了，它主要由```LLMs and Prompts```, ```Chains```, ```Data Augmented Generation```, ```Agents```, ```Memory```组成。源码位置 [langchain-ai/langchain/libs/langchain](https://github.com/langchain-ai/langchain/tree/master/libs/langchain)

<img width="360" src="https://github.com/WGrape/Blog/assets/35942268/5f83a16e-3695-4030-86ff-673bdef6665f">

#### (3) 其他部分
这里会简单概述下LangChain Template、LangServe和LangSmith模块的应用场景。

- LangSmith ：当一个LLM应用越来越复杂的同时，伴随着的底层实现也越来越复杂。比如越来越多的Chain、Agent等模块之间的调用也更加复杂化，这时Debug的关键性就会显现出来，这就是LangSmith出现的原因。它虽然不是必须使用的产品，但是绝对会帮助并提高工作的效率。

### 3. Langchain Lib中的Langchain

在上文的《LangChain Lib结构》中已介绍了Langchain Lib主要由三层组成，所以了解这个架构设计会对后面的理解非常有帮助。无论官方提供的功能操作有多少，多”混乱“，我们也可以时刻找到正确的方向。

<img width="360" src="https://github.com/WGrape/Blog/assets/35942268/d3a10e32-e81f-47b6-b22d-31b810792963" >

本文会主要讲解Langchain Lib部分，所以后面提到的Langchain单词，需要明确知道它不是指一个庞大的Langchain体系，而是特指Langchain Lib中的Langchain，或者代指整个```Langchain Lib```部分。

为了更简单的理解，甚至可以把Langchain和Langchain Lib作等同的理解，二者在理解上其实没有太大的区别。

### 4. 关于安装

> 可以选择使用一键式多环境管理[sparrow](https://github.com/WGrape/sparrow)服务中已经集成的```Langchain```环境

#### (1) 安装Langchain

使用如下命令即可快速安装Langchain。通过```python -m site```命令查看langchain的安装目录，就会发现它就是上面提到Langchain源码 [langchain-ai/langchain/libs/langchain](https://github.com/langchain-ai/langchain/tree/master/libs/langchain)。

```bash
pip install langchain
```

<img width="800" alt="image" src="https://github.com/WGrape/Blog/assets/35942268/5cd38dd8-5251-4cd0-9761-e284ec68c875">

所以在官网中可以看到，使用下面源码安装的方式也可以同样成功安装Langchain。

![image](https://github.com/WGrape/Blog/assets/35942268/a53a83fe-43b0-46e8-b471-09f72a25b9ac)

#### (2) 安装Langchain-Community

从上文《LangChain Lib结构》可知Langchain是对Langchain-Community的整合和适配。所以在安装完Langchain后，会自动安装langchain-community，如果需要单独安装，使用下面命令即可

```bash
pip install langchain-community
```

#### (3) 安装Langchain-Core

从上文《LangChain Lib结构》可知Langchain-Community是对Langchain-Core中抽象的具体实现。所以在安装完Langchain后，会自动安装langchain-core，如果需要单独安装，使用下面命令即可

```bash
pip install langchain-core
```

#### (4) 安装Langchain Lib的其他部分

截止2024年2月份，可以看到在Lib中有新增的一些模块

- [experimental](https://github.com/langchain-ai/langchain/tree/master/libs/experimental) ：实验模块，使用```pip install langchain-experimental```命令安装
- [cli](https://github.com/langchain-ai/langchain/tree/master/libs/cli) ：命令行模块，使用```pip install langchain-cli```命令安装

![image](https://github.com/WGrape/Blog/assets/35942268/a9d59606-f9d1-4c17-b553-eb3c3d32cb6c)

#### (5) 安装LangServe和LangSmith

 LangSmith SDK模块在安装完Langchain后也会自动安装，如果需要单独安装，请使用如下命令

```bash
pip install langsmith
```

 LangServe模块只有在安装完```Langchain CLI```后才会自动安装（注意不是Langchain），如果需要单独安装，请使用如下命令

```bash
# 同时安装客户端和服务端
pip install "langserve[all]"

# 仅安装客户端
pip install "langserve[client]"

# 仅安装服务端
pip install "langserve[server]"
```

#### (6) 安装其他依赖
建议根据如下提示进行安装

```bash
# 必须安装
pip install langchain-openai # LLM大语言模型必须使用
```

### 5. 入门例子

在下面这个例子中，主要分为几个简单的入门例子

- 创建LLM ：使用```langchain_openai```包中的```ChatOpenAI()```创建一个LLM大语言模型对象
- 创建Prompt ：使用```langchain_core```包中的```ChatPromptTemplate```创建一个Prompt对象
- 创建Output_parser ：使用```langchain_core```包中的```StrOutputParser()```创建一个输出处理器
- 使用LCEL语进行链式调用 ：使用或运算符```|```即可自动实现链式调用（基于__ror__魔法函数实现），如```prompt | llm | output_parser```

```python
# ==================== 创建LLM并调用 ====================
from langchain_openai import ChatOpenAI

# 1. 使用系统配置的OPENAI_API_KEY环境变量
llm = ChatOpenAI()

# 2. 传递openai_api_key参数
# llm = ChatOpenAI(openai_api_key="")

print(llm.invoke("1+1=?"))

# ==================== 创建一个复杂的Prompt并使用Chain链式调用 ====================
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are good at math."),
    ("user", "{input}")
])

chain = prompt | llm
print(chain.invoke({"input": "1+1=?"}))

# ==================== 创建一个StrOutputParser输出处理器并加入到Chain中 ====================
from langchain_core.output_parsers import StrOutputParser

output_parser = StrOutputParser()

chain = prompt | llm | output_parser
print(chain.invoke({"input": "1+1=?"}))

```

## 暂时未完...
由于文章篇幅的限制，先告一段落。相信经过上面简单的介绍之后，相信已经可以对Langchain有了初步的理解，下面会着重用最简单的描述、最容易理解的图、最直观的代码来深入讲解Langchain。

暂时未完，请期待下篇。
