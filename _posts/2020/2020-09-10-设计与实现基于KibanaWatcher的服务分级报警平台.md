---
layout:     post
title:      设计与实现基于Kibana Watcher的服务分级报警平台
header-img: /img/post.png
catalog: true
tags:
- Devops
- 设计与实现
---

> 文章内容更新请以 [WGrape GitHub博客 : 设计与实现基于Kibana Watcher的服务分级报警平台](https://github.com/WGrape/Blog/issues/220) 为准

### 前言
本文原创，著作权归[WGrape](https://github.com/WGrape)所有，未经授权，严禁转载

# 一、问题背景
由于优先级高的重要接口与低优先级的一般接口混杂在一起，使重要接口无法优先关注，进而出现问题处理不及时、报警不及时或提醒能力弱等报警缺点。久之，无法形成完善的工作制度以保障业务的安全正常运转。

# 二、实现目标
实现由接口分级为基础的整个业务保障的流程闭环

![image](https://user-images.githubusercontent.com/35942268/178906922-235073ea-a770-4c78-9aff-848a1d31aea6.png)

通过接口分级的基础建设，推动个人分级意识和报警能力的增强，进而可以对整个业务做到问题的及时把控，最终实现保障业务安全

# 三、实现思想
应该用什么方式实现 ”接口分级“ 的基础建设，目前主要有如下两种方式，本期使用第一种方式实现，即 「通过设计API Notice平台实现接口分级的基础建设」
1、通过设计并完成API Notice平台
2、通过在项目代码中直接编码的方式

# 四、设计方案
## 1、主要内容
### (1) 分级设计
目前根据业务场景可以分为4个服务重要级别，如果不确定服务级别，可以和产品业务方确认当前需求的重要程度，如果无法确认，一般默认设定为B级服务

| 级别 | 重要程度 | 定义 |
| :-----| ----: | :----: |
| S级 | 最高 | 直接或间接涉及到公司财产、绩效、声誉的服务、或对用户重要且使用率高的服务 |
| A 级 | 高 | 对用户重要但使用率不高的服务 |
| B 级 | 中 | 对用户一般重要的服务 |
| C 级 | 低 | 对用户不重要的服务 |

### (2) 实现过程
1、形成按业务区分的接口容器
2、可以为每一个容器手动添加、自动添加接口
3、容器中的每一个接口都可存储相应的信息，如重要级别等
4、可根据服务优先级、异常数等指标为容器中的接口做排序查看
5、报警方式是定制化的，表现在可使用短信、邮件、电话等不同的提醒方式
6、报警规则是定制化的，表现在可以匹配HTTP状态码，响应码，参数，IP等任何日志信息
7、可以为S、A、B、C四种不同的级别设置不同的报警规则，且自动应用于所有相应等级的接口

## 2、设计总览
API Notice平台的定位如下，即处于用户 和 Watcher之间，让用户先为业务接口做分级，最后对不同级别的接口实现统一监控，用最简单的方式实现统一报警。

![image](https://user-images.githubusercontent.com/35942268/178906884-606bc867-7880-4c5c-96d3-2a2f774873db.png)

## 3、数据源（数据表设计）
在数据库中创建共计api_config（接口容器）、api_alarm_config（接口业务级别的报警配置）两张表，这两张表就是整个平台的数据来源
```sql
CREATE TABLE IF NOT EXISTS `api_config`
(
  `id`           INT(11) UNSIGNED    NOT NULL AUTO_INCREMENT,
  `path`         VARCHAR(128)        NOT NULL DEFAULT '' COMMENT '接口路径(如/service/task/new_task)',
  `name`         VARCHAR(64)         NOT NULL DEFAULT '' COMMENT '接口名称',
  `desc`         VARCHAR(512)        NOT NULL DEFAULT '' COMMENT '接口描述',
  `level`        VARCHAR(2)          NOT NULL DEFAULT '' COMMENT '接口的重要级别(如S,A,B,C)',
  `service`      VARCHAR(64)         NOT NULL DEFAULT '' COMMENT '接口所属服务(如mobile)',
  `status`       TINYINT(1) UNSIGNED NOT NULL DEFAULT 1 COMMENT '状态(如1:存在, 0:不存在)',
  `created_time` INT(11) UNSIGNED    NOT NULL DEFAULT 0 COMMENT '创建时间',
  `updated_time` INT(11) UNSIGNED    NOT NULL DEFAULT 0 COMMENT '更新时间',
 
  UNIQUE INDEX uniq_idx_path (`path`),
  INDEX idx_level (`level`),
  INDEX idx_service (`service`),
  PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8 COMMENT ='接口配置';

CREATE TABLE IF NOT EXISTS `api_alarm_config`
(
  `id`           INT(11) UNSIGNED    NOT NULL AUTO_INCREMENT,
  `service`      varchar(64)         default '' not null comment '分级所属服务',
  `level`        VARCHAR(2)          NOT NULL DEFAULT '' COMMENT '接口的重要级别(如S,A,B,C)',
  `watcher_id`   VARCHAR(256)         NOT NULL DEFAULT '' COMMENT 'watcherID',
  `rule`         TEXT                NULL COMMENT '报警规则',
  `status`       TINYINT(1) UNSIGNED NOT NULL DEFAULT 1 COMMENT '状态(如1:存在, 0:不存在)',
  `created_time` INT(11) UNSIGNED    NOT NULL DEFAULT 0 COMMENT '创建时间',
  `updated_time` INT(11) UNSIGNED    NOT NULL DEFAULT 0 COMMENT '更新时间',
  UNIQUE INDEX uniq_idx_watcher_id (`watcher_id`),
  INDEX idx_level (`level`),
  INDEX idx_service (`service`),
  PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8 COMMENT ='报警配置';
```
## 4、操作平台
开发Web平台，所有操作都在此Web平台进行，主要包括如下
1、自动生成接口，手动添加接口
2、编辑接口的分级类别
3、为S、A、B、C、四种不同的级别添加统一性报警

## 5、报警实现
使用Kibana工具的Watcher监控器实现报警，即创建不同的watcher，通过ES匹配日志，最终实现接口的报警

![image](https://user-images.githubusercontent.com/35942268/178906823-09db8e6e-4813-44f3-ae1e-0246674d6c6e.png)

在使用API创建watcher的过程中，注意watcher账号权限的问题，如果权限低即使创建成功也无法正常报警

## 6、报警与操作平台的接入
通过Watcher监控器的API实现在操作平台的自动创建和编辑，把所有操作都收敛到操作平台端，避免了操作来源分散的问题。如下图可以为不同级别的服务添加统一性的报警规则（使用的是ES匹配语法）。

![image](https://user-images.githubusercontent.com/35942268/178906716-3ab74701-c47d-440e-9b0d-8eee3c00c3fe.png)


## 7、包括哪些分级内容

### 1、接口分级
对业务整个接口系统划分为S、A、B、C四类级别接口

### 2、错误分级
有了接口级别是不够的，有时接口中的某个操作异常会引发大面积故障，这种情况就需要对此异常设置S级别的错误

### 3、报警分级
随着错误级别的不同，采用不同的报警级别，如S级错误可以使用短信、电话等报警方式

## 8、重要结果（实现了统一报警）
通过此平台，最终可以实现 接口分级、错误分级、报警分级 共3种分级内容 。虽然是三种，但底层都是基于 Watcher 实现 ，而 Watcher 基于 ES 查询匹配日志实现 。

所以归根到底 ，目前实现了一种统一报警的方式（ 业务打日志 + API Notice ），通过如下两步骤即可实现
① 业务抛出异常日志
② 在API Notice平台进行接口分级配置

![image](https://user-images.githubusercontent.com/35942268/178906655-e43fcb07-9e57-482e-9738-bdbe89d0ac24.png)


# 五、最终实现
最终实现接口分级的API Notice平台，请见开源项目[API Notice](https://github.com/WGrape/APINotice)，使用方法和效果如下图所示

1、第一步，先添加接口，可以选择手动添加和自动添加，并设置服务级别
2、如果需要对此级别的服务报警规则进行调整，调整即可，不需要再有额外的操作

![image](https://user-images.githubusercontent.com/35942268/178906510-efa0481f-4cdf-405f-b67b-160e09363992.png)
