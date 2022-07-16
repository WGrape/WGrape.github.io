---
layout:     post
title:      实现Jenkins Event分析系统
header-img: /img/post.png
catalog: true
tags:
- Devops
---

> 文章内容更新请以 [WGrape GitHub博客 : 实现Jenkins Event分析系统](https://github.com/WGrape/Blog/issues/222) 为准

# 一、背景
系统上线是至关重要的环节，频繁部署回滚系统，都可能引发严重后果。一个质量优秀的系统，不应该只体现在bug率等可量化的指标上，也应该把它涉及部署上线的操作也作为量化指标，用于更全面的质量分析。

# 二、现状
对于目前Jenkins平台，提供的仅有构建历史、构建详情等信息，从其提供的现有信息中，过于模糊，无法得知类似上线频率、平均每天上线次数等指标。更全面的系统质量分析，目前Jenkins平台不能提供详细的数据、可定制化的操作。

# 三、设计

## (1) 原理
只要能获取到Jenkins数据，就可以做分析。

Jenkins提供了REST API，通过API可以获取到任何系统的构建历史，构建详情等信息。所以，通过这种方式，Jenkins Event分析系统的可行性满足。

## (2) 实现
服务请求Jenkins API获取到相关数据后，把数据发给前端，前端把数据写入缓存中，如果不是强制获取最新数据，系统便会从本地缓存中读Jenkins相关数据。

## (3) 规划
系统除了分析上线情况外，还可以提供深度分析的高定制化功能，并包含任何与Jenkins相关的事件，这些都是可以用于分析的数据，从而丰富和观察系统的各种指标 。

# 四、最终实现

![image](https://user-images.githubusercontent.com/35942268/179367102-73f8e365-bb0e-4aac-ab76-c184ce07c154.png)

