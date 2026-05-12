---
layout:     post
title:      一次由Opcache导致线上PHP服务异常的案例分析
header-img: /img/post.png
catalog: true
tags:
- PHP
- 底层研究
- 案例分析
- 经验之谈
---

> 文章内容更新请以 [WGrape GitHub博客 : 一次由Opcache导致线上PHP服务异常的案例分析](https://github.com/WGrape/Blog/issues/225) 为准

### 前言
本文原创，著作权归[WGrape](https://github.com/WGrape)所有，未经授权，严禁转载

# 一、背景
2021-05-13 14:10服务上线后，开始大量出现“Call to undefined method”错误。通过Grafana、查日志都可以有如下发现

![image](https://user-images.githubusercontent.com/35942268/183242871-6d7e4342-4837-46c6-80d4-9e613ff2b7a3.png)

- 错误出现在五台服务器上
- 每台服务器的报错都是持续约3秒钟

# 二、问题梳理

## 1、上线时间线
- 14:10:50 申请上线
- 14:10:57 数据准备完成
- 14:10:57 开始上线
- 14:10:57 通过parallel-rsync同步目录文件到目标服务器
- 14:11:26 第一台服务器同步完成
- 14:11:41 最后一台服务器同步完成
- 14:11:41 上线结束

## 2、服务器1时间线
- 14:11:35 代码至服务器同步完成
- 14:11:36 第一条报错开始
- 14:11:37 最后一条报错结束（持续1秒，共计220条）

## 3、服务器2时间线
- 14:11:35 代码至服务器同步完成
- 14:11:35 第一条报错开始
- 14:11:38 最后一条报错结束（持续3秒，共计237条）

## 4、服务器3时间线
- 14:11:35 代码至服务器同步完成
- 14:11:36 第一条报错开始
- 14:11:40 最后一条报错结束（持续4秒，共计700条）

## 5、服务器4时间线
- 14:11:39 代码至服务器同步完成
- 14:11:45 第一条报错开始
- 14:11:45 最后一条报错结束（持续1秒，共计196条）

## 6、服务器5时间线
- 14:11:28 代码至服务器同步完成
- 14:11:30 第一条报错开始
- 14:11:32 最后一条报错结束（持续2秒，共计399条）

# 三、问题分析

## 1、完整报错信息
报错信息为调用了不存在的方法

```json
{
    "logtime":"2021-05-13 14:11:45",
    "Mode":"fpm-fcgi",
    "Msg":"Call to undefined method app\\xxx\\services\\xxx\\XXXService::doSomething()",
    "Trace":"\/home\/xxx\/xxxxxx\/xxxx.php(68)\n#0 {main}",
    "Uri":"\/xxx.php?xxxxxxxxxxxxxx",
    "Clientip":"xx.xx.xx.xx"
}
```

## 2、问题疑惑
根据打印的调用栈，发现是在```xxx.php```中调用的，从当时的Git提交记录来看，这个```doSomething()```方法是有的，换言之不可能会出现找不到这个方法的问题。

## 3、可能原因
出现问题的可能原因主要有两类，一个是上线问题，另一个是opcache问题

### (1) 上线问题
在上线同步代码到目标机器的时候，调用方的文件代码已经同步过去，但```doSomething()```方法所在的文件还未同步完成

### (2) opcache问题
两个文件均已同步到目标机器，但Zend引擎解析代码时，opcache出现了如下的分布情况

![image](https://user-images.githubusercontent.com/35942268/183243144-56fe45ca-8217-45f4-b027-2de2b0da38d5.png)

## 4、原因分析

### (1) 上线问题
通过查看上线脚本，预估上传项目大概需要时间32秒。上线平台日志显示从上线至所有机器同步完成，使用了30秒时间。

- 问题时间线中，报错都是从文件上传完成后才开始的
- 实际上传30多秒和预计32秒基本一致

从上述两个结论，可以排除上线问题，即代码文件确实已经全部正常同步完成

### (2) opcache问题

#### ① opcache伪代码

```php
$now = time();
if( isOpcached(file) ){
  
    // check opcache code
    if( $now - file.lastUpdatedTime < revalidate_freq ){
      
        // 读opcache
        return getOpcache(file);
    }
}

// 重新解析PHP文件
$result = reParse(file);
writeOpcache(file, $result);
return $result;
```

#### ② Opcache 执行原理

<img src="https://user-images.githubusercontent.com/35942268/183243301-a6627381-37d8-427b-bbd9-6975af4ed267.png" width="500">

#### ③ opcache中文件的上次更新时间参差不齐
由于同步代码文件到服务器上需要30秒，所以在opcache中每个文件的上次更新时间会存在参差不齐的情况

![image](https://user-images.githubusercontent.com/35942268/183243309-eb70aac7-8015-4400-b4e6-490f7ff52b62.png)

#### ④ 结论

由于opcache中每个文件的上次更新时间参差不齐，所以会出现如下情况

- Zend引擎在检查A文件的opcache时，发现缓存已过期，所以会解析新的A文件
- B文件在opcache中的上次更新时间很近，即opcache中B文件的内容还处于有效期内
- Zend引擎会直接读取opcache中的B文件内容，但是这个内容是旧的

理论上会存在上述这种场景，但是需要测试并复现此场景，如果可以复现，则可以确认是opcache中AB文件的上次更新时间不一致，且不需要重新解析B文件

# 四、复现opcache导致PHP错误问题
## 1、测试准备
### (1) opcache配置
opcache配置如下，其中有效期为5秒

<img src="https://user-images.githubusercontent.com/35942268/183243324-ba31a848-278a-47d1-9810-f4039d622889.png" width="800">

### (2) 7个测试脚本

- online.sh ：上线脚本，用于模拟上线操作

```bash
cat TestController.php > /home/TestController.php
cat TestService.php > /home/TestService.php
```

- rollback.sh ：回滚脚本，用于模拟回滚操作

```bash
cat TestControllerOld.php > /home/TestController.php
cat TestServiceOld.php > /home/TestService.php
```

- TestControllerOld.php ：旧的Controller文件，即回滚后的Controller内容（调用getOpcacheStatus1方法）

```php
<?php

class TestController {

    public function test(){
         phpinfo();
    }

    public function test2(int $number){

	// opcache_invalidate(__FILE__, true);
        $opcache = TestService::getInstance()->getOpcacheStatus1();
	      $this->result = [
	        'number' => $number,
	        'opcache' => $opcache,
    	    'time' => date('Y-m-d H:i:s'),
        ];

    }
}
```

- TestController.php ：新的Controller文件，即上线后的Controller内容（调用getOpcacheStatus2方法）

```php
<?php

class TestController {

    public function test(){
         phpinfo();
    }

    public function test2(int $number){

	// opcache_invalidate(__FILE__, true);
        $opcache = TestService::getInstance()->getOpcacheStatus2();
	      $this->result = [
	        'number' => $number,
	        'opcache' => $opcache,
    	    'time' => date('Y-m-d H:i:s'),
        ];

    }
}
```

- TestServiceOld.php ：旧的Service文件，即回滚后的Service内容（没有getOpcacheStatus2方法）

```php
<?php

class TestService
{

        public function getOpcacheStatus1(){
	          return 1;
        }

}
```

- TestService.php ：新的Service文件，即上线后的Service内容（有getOpcacheStatus2方法）

```php
<?php

class TestService
{

        public function getOpcacheStatus1(){
	          return 1;
        }

        public function getOpcacheStatus2(){
		        sleep(1);
		        return 2;
        }
}
```

- loop.php ：循环脚本，用于不间断的依次执行 上线 / 回滚 操作

```php
<?php

while(1){
    sleep(1);
    echo "上线\n";
    system('bash ./online.sh');
    sleep(1);
    echo "回滚\n";
    system('bash ./rollback.sh');
}
```

## 2、测试计划
### (1) 测试方法
> 通过不间断执行上下线，可以加大opcache中不同文件上次更新时间的差异，在这种高概率的情况下且保持高QPS的访问，就比较容易复现 Call to undefined method 错误

- 执行 loop 脚本 ，即不间断的依次执行上下线
- 启动Go脚本并发请求接口 ，QPS 为 100

执行上两步操作，然后观察 `tail -f /home/log/sys_fatal.log` 日志

### (2) 预期结果
日志中出现 `Call to undefined method getOpcacheStatus2` 的报错

### (3) 预期结论
如果出现上述报错则说明PHP自身问题，导致在opcache中，Controller内容已更新，但Service内容未更新

![image](https://user-images.githubusercontent.com/35942268/183243144-56fe45ca-8217-45f4-b027-2de2b0da38d5.png)

## 3、测试过程
在执行所有待操作后，开始观察日志，很快就不断出现预期中的 Call to undefined method 错误，如下图所示

![image](https://user-images.githubusercontent.com/35942268/183243522-56bb916d-9113-4506-a38b-8ba2bf02af42.png)

## 4、测试结论

- 上线同步文件时间越长，每个文件的上次更新时间差异就越大
- 每个文件的上次更新时间差异越大，对应到opcache中每个文件的有效期差异就越大
- opcache中每个文件的有效期差异越大，PHP进程读取到非一致性版本文件内容（A文件中的新内容，B文件中的旧内容）的可能性就越大
- PHP进程读取到非一致性版本文件内容的可能性越大，出现PHP错误的可能性就越取决于QPS
- QPS越高（100以上），出现PHP错误的可能性就越大

## 5、测试总结
在可以确认所有文件是最新的情况下，同步文件需要的时间越长，每个文件的上次更新时间差异越大，上线后由opcache引起PHP错误的可能性就越大

# 四、问题总结
由于上线同步文件需要30秒，所以调用方文件和被调用方文件的上次更新时间一定不同，对应在opcache中的两个文件的上次更新时间也不是一致的，根据当时的日志可以确定QPS处于100以上，导致触发了由opcache引起的PHP错误

![image](https://user-images.githubusercontent.com/35942268/183243540-4cc2887d-f114-4c87-bc42-c389a9d4ffb7.png)
