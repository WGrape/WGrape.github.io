---
layout:     post
title:      什么是Copy-on-write技术
catalog: true
tags:
- CopyOnWrite
---

> 文章内容更新请以 [WGrape GitHub博客 : 什么是Copy-on-write技术](https://github.com/WGrape/Blog/issues/17) 为准


### 目录
- [一、介绍](#1)
- [二、理解](#2)
- &nbsp;&nbsp;&nbsp; [1、优化前](#21)
- &nbsp;&nbsp;&nbsp; [2、优化后](#22)
- [三、应用](#3)
- &nbsp;&nbsp;&nbsp; [1、数据结构](#31)
- &nbsp;&nbsp;&nbsp; [2、Linux进程](#32)
- &nbsp;&nbsp;&nbsp; [3、Redis bgsave进程](#33)
- [四、参考](#4)

## <span id="1">一、介绍</span>
在程序的 **内存优化** 策略中，有一种叫做```Copy-on-write```的写时复制技术，它可用于避免不必要的内存拷贝，以提高内存的利用率。

## <span id="2">二、理解</span>
```Copy-on-write```的字面意思是写时复制，即只有当真正写的时候才复制。

为了更透彻的理解这种技术，可以看如下程序，代码中定义了 str1 和 str2 这两个字符串，且第二个字符串一直和第一个内容一样，但直到程序退出结束，str2字符串的内容也未曾改变。

```c
int main(){
    str1 = "hello world";
    str2 = str1;

    // ... ...

    return 0;
}
```

### <span id="21">1、优化前</span>
在未优化前，内存使用情况如下所示，两个字符串都占用了不同的内存空间。

<img src="https://user-images.githubusercontent.com/35942268/150673421-a9ba12ba-fde7-4406-83fe-3608eea96b9a.png" width="377">

### <span id="22">2、优化后</span>
在使用写时复制技术优化后，初始时两个字符串都共享同一个内存空间，只有当S2字符串出现写操作时，才会从内存中复制一个新的内存区域给S2使用。

也就是说只有当真正发生写操作时，才会有自己独享的可写内存，否则会使用共享的内存。

<img src="https://user-images.githubusercontent.com/35942268/150673591-0d6a45a8-b788-4527-b960-5207a015cc3a.png" width="800">

## <span id="3">三、应用</span>

### <span id="31">1、数据结构</span>
在一些常用的如树、链表等数据结构中，都可以使用到```COW```技术。如在Google实现的[Btree](https://github.com/google/btree)中，就广泛使用了这种写时复制技术，以用于提高内存利用率。

<img src="https://user-images.githubusercontent.com/35942268/150674210-ce1c9b17-f3fd-4ee4-8880-fb278231f7c1.png" width="600">

### <span id="32">2、Linux进程</span>
> PS ：如果不理解进程的fork功能，可以想象下github的fork功能，对比理解。

在Linux进程实现中，进程fork出子进程时，会复制父进程的数据，这种复制方式就是```Copy-on-write```。子进程并不会完全拷贝出一个完整的内存副本，而是只有当子进程对数据进行修改时，才会进行复制。

如下图中，父进程P在fork出Q子进程后，两个进程会共用一个内存空间，当父进程P修改页面3的数据时，系统会拷贝出一个页面3的副本，这样父进程就会修改页面3的副本数据，而不会对子进程有影响，实现进程间数据的隔离。

<img src="https://user-images.githubusercontent.com/35942268/150675604-227460ac-a241-49a2-bf49-019551746ee4.png" width="500">

### <span id="33">3、Redis bgsave进程</span>
Redis进行RDB文件导出的时候，会先fork出一个子进程（如下图）。由[Linux进程原理](#32)中可知，fork出一个子进程时会复制父进程的数据。

所以Redis的bgsave进程，会使用一些copy-on-write技术，以减少不必要的内存复制开销，提高性能。

<img width="750" alt="image" src="https://user-images.githubusercontent.com/35942268/158224934-14ea9259-ac6d-44c7-9666-9eb3bffa6f0f.png">


## <span id="4">四、参考</span>
- [copy-on-write](https://www.geeksforgeeks.org/copy-on-write/)
