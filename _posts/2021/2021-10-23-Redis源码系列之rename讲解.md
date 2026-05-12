---
layout:     post
title:      Redis源码系列之rename讲解
header-img: /img/post.png
catalog: true
tags:
- Redis
---

> 文章内容更新请以 [WGrape GitHub博客 : Redis源码系列之rename讲解](https://github.com/WGrape/Blog/issues/6) 为准

### 前言
本文原创，著作权归[WGrape](https://github.com/WGrape)所有，未经授权，严禁转载

## 目录
- [一、rename原理](#1)
- [二、rename完整过程](#2)
- [三、关于rename的一些疑问](#3)
- &nbsp; &nbsp; [1、rename具有原子性吗](#31)
- &nbsp; &nbsp; [2、rename中的删除操作是同步的吗](#32)
- &nbsp; &nbsp; [3、如何解决rename耗时长的问题](#33)
- &nbsp; &nbsp; [4、如何解决DEL耗时长的问题](#34)
- &nbsp; &nbsp; [5、服务器的异步删除参数](#35)
- &nbsp; &nbsp; [6、如何替换rename命令](#36)
- [四、附录](#4)

# <span id="1">一、rename原理</span>
当使用 `rename oldKey newKey` 命令时，主要会执行如下两个操作

## 1、隐式删除newKey
由于rename操作不是renameNX，而是强制性的把旧Key名修改为新Key名。因此如果新Key名指向了数据，Redis就必先把这个数据删掉！

![image](https://user-images.githubusercontent.com/35942268/167286871-9df1a2f5-13c6-43e9-9107-466b514cc3d0.png)
注 ：key对应的Value抽象为memory内存

### (1) 源码
在Redis中，无论执行`rename`还是`renameNX`命令，都会执行一个通用的`renameGenericCommand`函数，只是传递的第二个NX参数不一样而已，而client参数就是如其名，表示客户端，用于获取命令携带的参数

- c->argv[1]表示oldKey
- c->argv[2]表示newKey

所以核心看`renameGenericCommand`函数即可

![image](https://user-images.githubusercontent.com/35942268/167286884-10a2940d-2505-42fc-87a3-c16c2efe268a.png)

如下代码中 `if(lookupKeyWrite(c->db,c->argv[2]) != NULL)` ，其中`lookupKeyWrite` 函数会返回Key所指向的内存指针，如果不为空，则说明已经有数据存储，所以紧接着就会执行删除newKey的逻辑

![image](https://user-images.githubusercontent.com/35942268/167286894-9f33aacf-9f7f-441f-8004-a0dbc1123105.png)

### (2) 时间复杂度
时间复杂度为O(M) ，M为成员数量

### (3) 测试
先写一个有500W成员的Hash类型的bigkey，如下图发现写入后，内存增加约400MB，删除它需要3秒左右

![image](https://user-images.githubusercontent.com/35942268/167286966-8ab66d48-4d8e-4593-b048-10f26fae1935.png)

![image](https://user-images.githubusercontent.com/35942268/167286983-2a557f2b-ef35-44d0-bb43-8531a8cf5ed5.png)

![image](https://user-images.githubusercontent.com/35942268/167286998-b373e2c6-7c54-4300-98eb-105dba22c529.png)

然后我们执行rename操作，结果如下

![image](https://user-images.githubusercontent.com/35942268/167287027-6b7008c2-221e-4899-bbb6-5294eb365d29.png)

所以rename操作会隐式的同步删除newKey，且删除耗时为O(M)

## 2、修改指针指向
Redis有如下两种方案可以实现rename效果，第一种是数据拷贝，第二种是修改指针指向。如果采用值拷贝的方式，会增加Redis的内存峰值，且拷贝内存的时间也会增加耗时，最重要的值拷贝在Redis场景中不需要，所以Redis使用的是第二种修改指针的方式

![image](https://user-images.githubusercontent.com/35942268/167287046-42b63c4b-4c5c-4609-aa18-6aced4082e8d.png)

注 ：key对应的Value抽象为memory内存

### (1) 源码
如下源码中，在拿到oldKey指向的内存对象（值对象）指针后，记为o，然后依次做如下操作

- 为o引用计数加1，此时o的引用计数为2
- 把新的键值关系（newKey => o）增加到当前DB中，相当于让newKey重新指向o
- 删除旧的键值（oldKey => o）关系，相当于删除oldKey的指向

**由于o的引用计数为2，在删除了oldKey的指向关系后，o的引用计数还是1，并不会触发GC**，所以对象o所占用的内存空间仍然是有效的，不过变成了由newKey指向

![image](https://user-images.githubusercontent.com/35942268/167287064-676f0f52-bf6e-4635-87f7-59155c2f3023.png)

### (2) 时间复杂度
O(1)

## 3、总结
rename操作耗时为O(1)是不准确的，应该为O(M)+O(1)

- O(M)为删除newKey的耗时，成员与删除耗时成线性关系
- O(1)为newKey指向新内存的耗时，是常数级别，可忽略

# <span id="2">二、rename完整过程</span>
1、find newKey ：找到newKey所指向的值对象
2、delete memory A ：删除值对象所指向的内存
3、find oldKey ：找到oldKey所指向的值对象
4、incrRefCount ：为oldKey所指向的值对象的引用计数+1
5、add relation ：把(newKey => o)新的键值对信息加到数据库中，让newKey指向一个新的值对象
6、delete relation ：删除(oldKey => o)旧的键值对信息，让oldKey不再指向之前的值对象

![image](https://user-images.githubusercontent.com/35942268/167287088-a971c55e-b219-4742-920b-a261252920f3.png)

注 ：key对应的Value抽象为memory内存

# <span id="3">三、关于rename的一些疑问</span>
## <span id="31">1、rename具有原子性吗</span>
从源码中看，rename过程需要经过删除newKey和修改指针指向这两步，而如果第二步失败，第一步操作并不会回滚，所以不具有原子性
## <span id="32">2、rename中的删除操作是同步的吗</span>
从代码中可以看到是同步还是异步，完全取决于配置的DEL机制，即由`lazyfree-lazy-server-del`配置决定。

![image](https://user-images.githubusercontent.com/35942268/167287097-9e740d95-c49e-4b6c-9e2b-eddec632b997.png)

![image](https://user-images.githubusercontent.com/35942268/167287126-a147e91c-7d11-46d5-8253-dd8ec1d68502.png)

## <span id="33">3、如何解决rename耗时长的问题</span>
之前测试中发现rename操作卡了3秒，执行`config get *`命令，发现确实配置的删除方式为同步删除

![image](https://user-images.githubusercontent.com/35942268/167287158-43a7f086-feb2-4b64-aa09-956c3192be9f.png)

所以解决方法有两个，要么减少Key的member成员数量，要么配置`lazyfree-lazy-server-del`为`yes`

## <span id="34">4、如何解决DEL耗时长的问题</span>
(1) 如果使用的 Redis 是 4.0 以上版本，用 UNLINK 命令替代 DEL，此命令可以把释放 key 内存的操作，放到后台线程中去执行，从而降低对 Redis 的影响

(2) 如果使用的 Redis 是 6.0 以上版本，可以开启 lazy-free 机制（lazyfree-lazy-user-del = yes），在执行 DEL 命令时，释放内存也会放到后台线程中执行

## <span id="35">5、服务器的异步删除参数</span>

![image](https://user-images.githubusercontent.com/35942268/143533688-b3c87df0-2fb0-45d0-9799-01e6c8af9d07.png)

- lazyfree-lazy-expire ：数据过期进行淘汰时，是否启用异步删除

- lazyfree-lazy-server-del ：服务器隐式删除（如rename），是否启用异步删除

- lazyfree-lazy-user-del ：客户端执行显示删除命令（如DEL、UNLINK）时，是否启用异步删除

## <span id="36">6、如何替换rename命令</span>

### (1) 场景问题
假设现有一个场景，在使用Redis时无法再使用rename命令，但是现有业务代码中有很多使用rename的复杂情况（事务和非事务都有），完全不可能去修改代码，这时如何解决呢 ？

### (2) 问题分析
通过上述rename原理的分析，可以知道rename底层也是通过多个操作组合，最终实现的rename效果，只不过多个操作组合后，只返回了一个结果。所以现在首先需要做的，就是从Redis的所有命令中找到满足需求的命令并组合使用。

下一步需要做的，就是想办法实现使用多个Redis命令操作，但是只返回一个结果的效果。如何实现呢 ？

<img src="https://user-images.githubusercontent.com/35942268/150481537-5985aca1-1189-49f8-aafb-316bc8e434cc.png" width="650">

没错，可以使用```EVEL```命令传递```LUA```脚本实现。

这时就剩下最后一个问题了，Redis命令在事务和非事务中返回的结构是不一样的，如何解决呢 ？其实很简单，在```php```中操作Redis时，数据结构的返回都是由```phpredis```控制的，我们并不需要判断当前操作环境是否为事务，只需要使用调用```parent```类即```Redis```类下的方法即可。

### (3) 最终实现

```php
class MyRedis extends Redis
{
    public function rename($srcKey, $dstKey)
    {
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

    public function renameNx($srcKey, $dstKey)
    {
        $lua = <<<LUA
local isExist=redis.call('exists',KEYS[2])
if (isExist == 1) then
    return false
end
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
}
```

# <span id="4">四、附录</span>
源码使用VSCode[在线查看](https://github1s.com/redis/redis/)