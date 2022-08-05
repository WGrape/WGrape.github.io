---
layout:     post
title:      记一次对Redis的rename命令重写的尝试
header-img: /img/post.png
catalog: true
tags:
- 底层研究
- 经验之谈
- Redis源码
- 设计与实现
---

> 文章内容更新请以 [WGrape GitHub博客 : 记一次对Redis的rename命令重写的尝试](https://github.com/WGrape/Blog/issues/243) 为准

### 前言
本文原创，著作权归[WGrape](https://github.com/WGrape)所有，未经授权，严禁转载

## 一、背景
随着云上产品的发展愈来愈完善，越来越多的公司开始投入到服务器上云的工作中，可选的云上服务商和产品也非常多。

某某云服务商旗下的XX是基于Redis开发的云上存储产品，基本对Redis可以做到99%兼容，之所以不是100%，是因为对于Redis的一些罕见命令是不支持的，比如R```rename```命令。

如果公司选择了此产品作为Redis云上产品，不巧的是业务中大量使用了```rename```命令，那么如何保证上云后，业务正常不受影响呢？

## 二、基于多命令组合的实现

### (1) 思路
基于```phpredis```提供的方法支持，去调用不同的Redis命令实现

### (2) 问题
- 需要考虑事务和管道的问题，比如```exec()```之后才执行删除Key等等，逻辑非常复杂
- 多个命令实现的rename不再具有原子性，而且在Multi场景下返回的数据结构也会不一致

### (3) 实现
```php
function rename($srcKey, $dstKey)
{
    $notExistKey = "temp_temp_not_exist_key";
    $maxDumpMB = intval($monitorRedis->get('config_max_dump_MB'));

    // 使用dump+restore替代Redis的rename命令
    // 创建调用方Redis实例
    $calledRedis = (new static())->init();

    // 序列化出数据内容, 通过内存消耗判断dump出来的Key的占用内存
    $memoryStart = memory_get_usage();
    $serializedData = $calledRedis->dump($srcKey);
    $memoryEnd = memory_get_usage();
    $usedMB = intval(($memoryEnd - $memoryStart) / 1024 / 1024);

    // 如果超过最大内存限制, 则拒绝此操作
    if ($maxDumpMB && $usedMB > $maxDumpMB) {
        return $this->isMulti ? parent::sIsMember($notExistKey, '123456') : false;
    }

    // 如果序列化失败(Key不存在或Redis内部失败), 则拒绝此操作
    if ($serializedData === false) {
        return $this->isMulti ? parent::sIsMember($notExistKey, '123456') : false;
    }

    // 获取srcKey的有效期
    $srcKeyTTL = intval($calledRedis->ttl($srcKey));
    if ($srcKeyTTL <= 0) {
        $srcKeyTTL = 0;
    }

    // 把序列化数据重新写入新Key
    $dstKeyDelSuccess = $calledRedis->del($dstKey);
    if ($this->isMulti) {
        $this->waitDeleteKeys[] = $srcKey;
        return parent::restore($dstKey, 0, $serializedData); // restore with ttl will failed
    } else {
        $srcKeyDelSuccess = false;
        $restoreSuccess = $calledRedis->restore($dstKey, 0, $serializedData); // restore with ttl will failed
        if ($restoreSuccess) {
            $srcKeyDelSuccess = $calledRedis->del($srcKey);
            $calledRedis->expire($dstKey, $srcKeyTTL);
        }
        return $restoreSuccess && $srcKeyDelSuccess;
    }

    // 使用Redis原生rename命令
    return parent::rename($srcKey, $dstKey);
}
```

## 二、基于Lua的实现

### (1) 思路
通过使用Lua，使用其多条命令会当成一条命令执行的特性，实现在一个命令里面做多种不同的操作。而且Lua命令和其他Redis命令都是等同的，这也保证了不需要在Lua中考虑事务、管道等任何问题。

### (2) 问题
既简单清晰又逻辑严谨的最完美的方案，没有任何安全性问题。

### (3) 源码
```php
function rename($srcKey, $dstKey)
{
    $isCustomRename = intval($monitorRedis->get('is_custom_rename'));

    // 使用dump+restore替代Redis的rename命令
    if (KTV_STAT_PREFIX == 143 || ENVIRONMENT == 'aliyun' || $isCustomRename) {
        $lua = <<<LUA
        local data=redis.call('dump',KEYS[1])
        if (data == nil or data == '' or data == false) then
            return false
        end
        local ttl=redis.call('pttl',KEYS[1])
        if ttl<0 then
            ttl=0
        end
        redis.call('del',KEYS[1])
        redis.call('del',KEYS[2])
        return redis.call('restore',KEYS[2],ttl,data)
LUA;
        return parent::eval($lua, [$srcKey, $dstKey], 2);
    }

    // 使用Redis原生rename命令
    return parent::rename($srcKey, $dstKey);
}
```

## 三、收获
基于此次经验，除了有如下收获外，总结并写了一篇Redis底层文章[《Redis源码系列之rename讲解》](https://github.com/WGrape/Blog/issues/6) 欢迎查看。

- Redis中不同的命令会使用不同的秒、毫秒级时间单位，小心使用错误
- 在使用```phpredis```的时候，很多场景都是直接用```parent```的方法即可，例如```parent::multi()```
- Lua本身是一个脚本，它里面无论有多少条命令，但作为一个脚本去```evel()```执行的时候，它都只是一个命令，也只会有一个返回值
- 在使用```phpredis```的时候，每一个操作的返回值会自动切换。即如果是Multi那么返回的结构是Object类型的Multi结构，否则是一个普通的String、Boolean、Int等类型

## 四、总结
如果当你解决一个问题需要使用非常复杂的方案，而且需要耗费巨大精力的时候，就一定要想想自己是否选错了方案。这时要尽快从泥潭中抽离出来，好好想想是不是自己的整个思路就是错误的，可能换一个思路之后，所有复杂的场景都不再需要考虑了
