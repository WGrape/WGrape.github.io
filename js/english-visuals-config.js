/**
 * =====================================================
 * 英文学习 — 内容配置文件  /js/english-visuals-config.js
 * =====================================================
 *
 * 📌 这是所有英文学习内容的唯一数据源，直接修改本文件即可。
 *
 * ── 每日一句 (dailyQuote) ────────────────────────────
 *   每日一句优先从「词霸 API」实时获取，当网络不可用时
 *   回退显示本文件中 dailyQuote.fallback 里配置的内容。
 *
 *   fallback 字段：
 *     en   英文句子
 *     zh   中文翻译
 *
 * ── 全局朗读设置 (speak) ─────────────────────────────
 *   lang   朗读语言  (en-US / en-GB / en-AU)
 *   rate   语速      0.1 ~ 2  (推荐 0.85)
 *   pitch  音调      0 ~ 2    (推荐 1.0)
 *
 * ── 三个内容板块 ──────────────────────────────────────
 *   cs          计算机领域英文
 *   aiWord      AI + 单词
 *   aiSentence  AI + 语法翻译
 *
 * ── 如何新增词条 ──────────────────────────────────────
 *   cs / aiWord 新增一条，在 items 末尾追加：
 *     {
 *       word:     '单词',
 *       phonetic: '/音标/',
 *       tag:      '分类标签',
 *       en:       '英文例句',
 *       zh:       '中文释义',
 *     },
 *
 *   aiSentence 新增一条，在 items 末尾追加：
 *     {
 *       title:  '句子标题（简短摘要）',
 *       en:     '完整英文长句',
 *       zh:     '中文翻译',
 *       source: '来源（可选）',
 *       parts:  [                          // 语法高亮（可选，删掉整行也不影响显示）
 *         { text: '主语部分',   role: 'subject'   },
 *         { text: ' 谓语部分 ', role: 'predicate' },
 *         { text: '其余文字',   role: 'normal'    },
 *       ],
 *     },
 *
 *   parts 中 role 可选值：
 *     subject / predicate / object / complement
 *     relative-clause / adverbial-clause / adverbial
 *     noun-clause / appositive / participial / normal
 * =====================================================
 */

var EV_CONFIG = {

  /* ── 每日一句 —— 网络不可用时显示此备用内容 ─────────── */
  dailyQuote: {
    fallback: {
      en: 'Every day is a fresh page. Keep learning, and keep turning it.',
      zh: '每一天都是崭新的一页。保持学习，也保持翻页。',
    },
  },

  speak: {
    lang:  'en-US',
    rate:  0.85,
    pitch: 1.0,
  },

  /* ── 计算机领域英文 ──────────────────────────────── */
  cs: {
    label:    '计算机领域英文',
    tag:      'Core Term',
    accent:   '#38bdf8',
    items: [
      {
        word: 'Idempotency',
        phonetic: '/ˌaɪdəmˈpəʊtənsi/',
        tag: 'Distributed Systems',
        en: 'An idempotent operation produces the same result even if it is executed multiple times.',
        zh: '幂等性：一个操作即使被重复执行多次，最终结果仍保持一致。',
      },
      {
        word: 'Latency',
        phonetic: '/ˈleɪtənsi/',
        tag: 'Performance',
        en: 'Latency is the time interval between a request being made and a response being received.',
        zh: '延迟：从发出请求到收到响应之间的时间间隔。',
      },
      {
        word: 'Throughput',
        phonetic: '/ˈθruːpʊt/',
        tag: 'Performance',
        en: 'Throughput is the number of requests a system can handle per unit of time.',
        zh: '吞吐量：系统在单位时间内能处理的请求数量。',
      },
      {
        word: 'Concurrency',
        phonetic: '/kənˈkɜːrənsi/',
        tag: 'Parallel Computing',
        en: 'Concurrency is the ability of a system to handle multiple tasks at overlapping time periods.',
        zh: '并发：系统在重叠的时间段内处理多个任务的能力。',
      },
      {
        word: 'Deadlock',
        phonetic: '/ˈdedlɒk/',
        tag: 'OS / DB',
        en: 'A deadlock occurs when two or more processes each wait for the other to release a resource.',
        zh: '死锁：两个或多个进程互相等待对方释放资源，导致永久阻塞。',
      },
      {
        word: 'Sharding',
        phonetic: '/ˈʃɑːdɪŋ/',
        tag: 'Database',
        en: 'Sharding splits a large database into smaller, faster, more manageable pieces called shards.',
        zh: '分片：将大型数据库拆分为更小、更快、更易管理的片段（shard）。',
      },
      {
        word: 'Cache Invalidation',
        phonetic: '/kæʃ ɪnˌvælɪˈdeɪʃn/',
        tag: 'Caching',
        en: 'Cache invalidation is the process of removing or updating stale data stored in a cache.',
        zh: '缓存失效：移除或更新缓存中过期数据的过程。',
      },
      {
        word: 'Eventual Consistency',
        phonetic: '/ɪˈventʃuəl kənˈsɪstənsi/',
        tag: 'Distributed Systems',
        en: 'Eventual consistency guarantees that all replicas will converge to the same value, given no new updates.',
        zh: '最终一致性：在没有新更新的情况下，所有副本最终会收敛到相同值。',
      },
      {
        word: 'Load Balancing',
        phonetic: '/ləʊd ˈbælənsɪŋ/',
        tag: 'Infrastructure',
        en: 'Load balancing distributes incoming network traffic across multiple servers to ensure reliability.',
        zh: '负载均衡：将传入流量分配到多台服务器，以保证系统可靠性和可用性。',
      },
      {
        word: 'Circuit Breaker',
        phonetic: '/ˈsɜːkɪt ˈbreɪkər/',
        tag: 'Resilience',
        en: 'A circuit breaker pattern stops cascading failures by short-circuiting calls to a failing service.',
        zh: '熔断器：通过短路对故障服务的调用，阻止级联故障蔓延的设计模式。',
      },
      {
        word: 'Mutex',
        phonetic: '/ˈmjuːteks/',
        tag: 'Concurrency',
        en: 'A mutex (mutual exclusion) is a lock that allows only one thread to access a shared resource at a time.',
        zh: '互斥锁：一种同步原语，确保同一时刻只有一个线程能访问共享资源。',
      },
      {
        word: 'Garbage Collection',
        phonetic: '/ˈɡɑːbɪdʒ kəˈlekʃn/',
        tag: 'Memory',
        en: 'Garbage collection automatically frees memory occupied by objects that are no longer in use.',
        zh: '垃圾回收：自动释放不再使用的对象所占内存的机制。',
      },
      {
        word: 'Polymorphism',
        phonetic: '/ˌpɒlɪˈmɔːfɪzəm/',
        tag: 'OOP',
        en: 'Polymorphism allows objects of different types to be treated through a unified interface, so the same method call behaves differently depending on the object it is invoked on.',
        zh: '多态：允许不同类型的对象通过同一接口调用，同一方法名在不同对象上展现出不同行为。',
      },
      {
        word: 'Recursion',
        phonetic: '/rɪˈkɜːʃn/',
        tag: 'Algorithm',
        en: 'Recursion is a technique where a function calls itself with progressively smaller inputs until it reaches a base case that stops the chain.',
        zh: '递归：函数以更小的输入不断调用自身，直到到达终止递归的基础情况。',
      },
      {
        word: 'Big O Notation',
        phonetic: '/bɪɡ əʊ nəʊˈteɪʃn/',
        tag: 'Algorithm',
        en: 'Big O notation describes the upper bound of an algorithm\'s time or space complexity as the input size grows, allowing developers to compare efficiency without benchmarking.',
        zh: '大 O 表示法：描述随输入规模增长算法时间或空间复杂度的上界，便于比较算法效率。',
      },
      {
        word: 'API',
        phonetic: '/ˌeɪ piː ˈaɪ/',
        tag: 'Architecture',
        en: 'An API (Application Programming Interface) defines a contract between software components — specifying how they communicate without exposing internal implementation details.',
        zh: 'API（应用程序编程接口）：定义软件组件间通信规范的契约，屏蔽内部实现细节。',
      },
      {
        word: 'Microservices',
        phonetic: '/ˈmaɪkrəʊ ˈsɜːvɪsɪz/',
        tag: 'Architecture',
        en: 'Microservices architecture decomposes an application into small, independently deployable services, each owning a single business capability and communicating over lightweight protocols.',
        zh: '微服务：将应用拆分为若干小型、可独立部署的服务，每个服务负责单一业务能力，通过轻量协议通信。',
      },
      {
        word: 'Containerization',
        phonetic: '/kənˌteɪnəraɪˈzeɪʃn/',
        tag: 'DevOps',
        en: 'Containerization packages an application together with all its dependencies into a portable, self-sufficient unit that runs consistently across development, staging, and production environments.',
        zh: '容器化：将应用及其全部依赖打包成可移植的自足单元，确保在开发、测试和生产环境中一致运行。',
      },
      {
        word: 'Race Condition',
        phonetic: '/reɪs kənˈdɪʃn/',
        tag: 'Concurrency',
        en: 'A race condition is a defect where the program\'s outcome depends on the unpredictable order in which concurrent threads access and modify shared data.',
        zh: '竞态条件：程序结果依赖于并发线程访问共享数据的不可预测顺序时出现的缺陷。',
      },
      {
        word: 'Dependency Injection',
        phonetic: '/dɪˈpendənsi ɪnˈdʒekʃn/',
        tag: 'Design Pattern',
        en: 'Dependency injection supplies a component with its required collaborators from the outside rather than letting it create them internally, reducing coupling and improving testability.',
        zh: '依赖注入：将组件所需的协作对象从外部传入而非内部创建，降低耦合度，提升可测试性。',
      },
      {
        word: 'Serialization',
        phonetic: '/ˌsɪərɪəlaɪˈzeɪʃn/',
        tag: 'Data',
        en: 'Serialization converts an in-memory object into a portable format such as JSON or binary so it can be stored to disk or transmitted over a network and later reconstructed.',
        zh: '序列化：将内存对象转换为 JSON 或二进制等可移植格式，以便存储或传输后再还原。',
      },
      {
        word: 'Abstraction',
        phonetic: '/æbˈstrækʃn/',
        tag: 'OOP',
        en: 'Abstraction hides the complex implementation details behind a simplified interface, letting callers focus on what a component does rather than how it works internally.',
        zh: '抽象：将复杂实现隐藏在简洁接口之后，让调用者关注"做什么"而非"怎么做"。',
      },
      {
        word: 'Event-Driven',
        phonetic: '/ɪˈvent ˈdrɪvn/',
        tag: 'Architecture',
        en: 'In an event-driven architecture, components communicate by publishing and subscribing to events, achieving loose coupling and enabling asynchronous, scalable workflows.',
        zh: '事件驱动：组件通过发布和订阅事件通信，实现松耦合并支持异步可扩展的工作流架构。',
      },
      {
        word: 'Immutable',
        phonetic: '/ɪˈmjuːtəbl/',
        tag: 'Functional Programming',
        en: 'An immutable object cannot be changed after creation; any apparent modification produces a new object, eliminating entire classes of bugs caused by unexpected state changes.',
        zh: '不可变：对象创建后不可更改；任何修改都产生新对象，从根本上消除意外状态变更引发的缺陷。',
      },
      {
        word: 'Backpressure',
        phonetic: '/ˈbækpreʃər/',
        tag: 'Streaming',
        en: 'Backpressure is a flow-control signal sent from a consumer to a producer when the incoming data rate exceeds the consumer\'s processing capacity, preventing buffer overflow.',
        zh: '背压：当消费者处理速度跟不上生产者时，向上游发出降速信号的流量控制机制，防止缓冲区溢出。',
      },
      {
        word: 'Refactoring',
        phonetic: '/ˌriːˈfæktərɪŋ/',
        tag: 'Engineering',
        en: 'Refactoring improves the internal structure of existing code — making it cleaner, more readable, and easier to extend — without altering its observable external behavior.',
        zh: '重构：在不改变代码可见外部行为的前提下，改善其内部结构，使代码更整洁、可读和易于扩展。',
      },
      {
        word: 'Webhook',
        phonetic: '/ˈwebhʊk/',
        tag: 'Integration',
        en: 'A webhook is a user-defined HTTP callback that a server automatically fires when a specified event occurs, pushing real-time data to a registered URL without polling.',
        zh: 'Webhook：用户自定义的 HTTP 回调，服务端在指定事件触发时自动推送数据到注册 URL，无需轮询。',
      },
      {
        word: 'Idempotent Key',
        phonetic: '/ˌaɪdəmˈpəʊtənt kiː/',
        tag: 'API Design',
        en: 'An idempotent key is a unique client-generated token attached to a request so the server can detect and safely ignore duplicate retries without re-executing side effects.',
        zh: '幂等键：客户端生成的唯一令牌，附在请求中让服务端识别并忽略重复重试，避免副作用被重复执行。',
      },
      {
        word: 'CAP Theorem',
        phonetic: '/kæp ˈθɪərəm/',
        tag: 'Distributed Systems',
        en: 'The CAP theorem states that a distributed system can guarantee at most two of the three properties — Consistency, Availability, and Partition tolerance — simultaneously.',
        zh: 'CAP 定理：分布式系统无法同时保证一致性（C）、可用性（A）和分区容忍性（P）三者，最多满足其中两个。',
      },
      {
        word: 'Observability',
        phonetic: '/əbˌzɜːvəˈbɪlɪti/',
        tag: 'Operations',
        en: 'Observability is the degree to which the internal state of a system can be inferred from its external outputs — typically logs, metrics, and distributed traces.',
        zh: '可观测性：通过系统对外暴露的日志、指标和分布式追踪等输出，推断其内部状态的能力。',
      },
    ],
  },

  /* ── AI + 单词 ──────────────────────────────────── */
  aiWord: {
    label:  'AI + 单词',
    tag:    'Vocabulary',
    accent: '#a78bfa',
    items: [
      {
        word: 'Procrastinate',
        phonetic: '/prəˈkræstɪneɪt/',
        tag: 'Word Roots',
        en: '🔍 Root breakdown: "pro-" (forward) + Latin "crastinus" (tomorrow) = push things forward to tomorrow. Story: Imagine someone who needs to pack a suitcase but every time they sit down to do it, they think "I\'ll do it tomorrow!" — that\'s procrastination in action.',
        zh: '词根拆解：pro-（向前）+ crastinus（拉丁语"明天"）= 把任务"推到明天"。\n拖延：一再推迟本该完成的事情。',
      },
      {
        word: 'Resilient',
        phonetic: '/rɪˈzɪlɪənt/',
        tag: 'Storytelling',
        en: '🎭 Story: Picture a rubber ball dropped hard on the floor. No matter how forcefully you slam it, it bounces right back to its original shape. Resilient people are exactly like that ball — they absorb shocks, setbacks, and failures, then spring back stronger. Root: Latin "resilire" (to jump back).',
        zh: '故事记忆：弹力球无论摔多重都会弹起——韧性强的人如同弹力球，承受打击后仍能恢复原状甚至更强。\n词根：resilire（拉丁语"弹回"）。有弹性的、能迅速复原的。',
      },
      {
        word: 'Ambiguous',
        phonetic: '/æmˈbɪɡjuəs/',
        tag: 'Word Roots',
        en: '🔍 Root breakdown: "ambi-" (both/around) + "agere" (Latin: to drive). Literally: driven in two directions at once. Story: You stand at a fork in the road, and your car\'s engine pushes both ways simultaneously — you cannot move. That paralysis of unclear meaning is ambiguity.',
        zh: '词根拆解：ambi-（两边）+ agere（驱动）= 同时被驱向两个方向，无法前进。\n模糊的、含混的：可以有多种解读，含义不清晰。',
      },
      {
        word: 'Meticulous',
        phonetic: '/məˈtɪkjʊləs/',
        tag: 'Word Roots',
        en: '🔍 Root: Latin "metus" (fear) → fearful of making mistakes → being extremely careful about every detail. Story: A watchmaker assembling a 300-part movement with tweezers, triple-checking each gear — not from doubt, but because precision is everything. That laser-focus is meticulousness.',
        zh: '词根：metus（拉丁语"恐惧"）→ 害怕出错 → 对每个细节极其谨慎。\n一丝不苟的：对细节极为注意，力求精准无误。',
      },
      {
        word: 'Ephemeral',
        phonetic: '/ɪˈfemərəl/',
        tag: 'Word Roots',
        en: '🔍 Root breakdown: Greek "epi-" (upon) + "hēmera" (day) = lasting only one day. Story: Cherry blossoms bloom for barely a week each spring. People travel hundreds of miles just to see them — precisely because they are gone so quickly. That fleeting beauty is ephemeral.',
        zh: '词根：epi-（在……上）+ hēmera（希腊语"一天"）= 仅持续一天。\n短暂的、转瞬即逝的：像樱花一样美丽，却只短暂存在。',
      },
      {
        word: 'Tenacious',
        phonetic: '/tɪˈneɪʃəs/',
        tag: 'Word Roots',
        en: '🔍 Root: Latin "tenax" → "tenere" (to hold, to grip). Story: Think of barnacles clinging to a ship\'s hull — waves, storms, scrubbing, nothing dislodges them. A tenacious person grips their goal like a barnacle grips rock: they simply will not let go no matter what.',
        zh: '词根：tenere（拉丁语"抓住"）= 死死抓住不放。\n故事：藤壶紧附船底，任何风浪都冲不走它——韧性十足的人正是如此。\n坚韧的、锲而不舍的。',
      },
      {
        word: 'Dilemma',
        phonetic: '/dɪˈlemə/',
        tag: 'Word Roots',
        en: '🔍 Root breakdown: Greek "di-" (two) + "lemma" (premise / horn). A dilemma literally means being caught between two horns of equal difficulty. Story: The classic trolley problem — pull a lever to save five but harm one, or do nothing. Two horns, no painless escape.',
        zh: '词根拆解：di-（二）+ lemma（希腊语"前提/角"）= 被两只角同时顶住。\n进退两难：只有两个选项，每个都有代价，无法两全其美。',
      },
      {
        word: 'Serendipity',
        phonetic: '/ˌserənˈdɪpɪti/',
        tag: 'Storytelling',
        en: '🎭 Origin story: In 1754, Horace Walpole coined the word from a Persian fairy tale "The Three Princes of Serendip" — heroes who always stumbled upon treasures they were not looking for. Penicillin? Discovered by accident when mold contaminated a petri dish. Post-it notes? An accidental weak adhesive. Serendipity makes history.',
        zh: '故事起源：1754年源自波斯童话《塞伦迪普三王子》，英雄们总能意外找到宝藏。青霉素是意外发现的，便利贴也是。\n意外之喜：在寻找别的东西时，意外发现有价值事物的幸运现象。',
      },
      {
        word: 'Eloquent',
        phonetic: '/ˈeləkwənt/',
        tag: 'Word Roots',
        en: '🔍 Root breakdown: Latin "e-" (out) + "loqui" (to speak) = to speak out fully and freely. Story: Picture a great orator — every word chosen perfectly, the rhythm carrying the audience forward, each sentence landing with weight. When words flow out like music, you are eloquent.',
        zh: '词根拆解：e-（出）+ loqui（拉丁语"说话"）= 充分地说出来。\n能言善辩的、口才出众的：表达清晰流畅，极具感染力和说服力。',
      },
      {
        word: 'Pragmatic',
        phonetic: '/præɡˈmætɪk/',
        tag: 'Word Roots',
        en: '🔍 Root: Greek "pragma" (deed, action). A pragmatic person is anchored to results and reality, not theories. Story: While the team debates the "perfect" architecture for days, the pragmatic engineer says: "Ship it, measure it, improve it." They care about what actually works over what is ideally correct.',
        zh: '词根：pragma（希腊语"行动/事实"）= 以行动和结果为导向。\n务实的：注重实际效果，不拘泥于理论和原则。',
      },
      {
        word: 'Gregarious',
        phonetic: '/ɡrɪˈɡeərɪəs/',
        tag: 'Word Roots',
        en: '🔍 Root: Latin "grex / gregis" (flock, herd). Story: Think of a shepherd watching sheep — they always cluster together, never wander alone by choice. Gregarious people are the same: they light up in crowds, seek company instinctively, and feel restless in solitude. They are "flock creatures" at heart.',
        zh: '词根：gregis（拉丁语"羊群"）= 喜欢群居的动物。\n合群的、爱社交的：天性喜欢与他人相处，在社交场合如鱼得水。',
      },
      {
        word: 'Synchronize',
        phonetic: '/ˈsɪŋkrənaɪz/',
        tag: 'Word Roots',
        en: '🔍 Root breakdown: Greek "syn-" (together) + "chronos" (time) = to happen at exactly the same time. Story: Watch a rowing crew in a race — every oar must enter the water at the identical moment. When they synchronize, they glide. When even one oar is off, the boat wobbles and slows.',
        zh: '词根拆解：syn-（一起）+ chronos（希腊语"时间"）= 同时发生。\n故事：赛艇队每支桨必须同时入水，否则船身摇摆减速。\n同步：使多个事物在时间上协调一致。',
      },
      {
        word: 'Verbose',
        phonetic: '/vɜːˈbəʊs/',
        tag: 'Word Roots',
        en: '🔍 Root breakdown: Latin "verbum" (word) + "-ose" (full of) = full of words. Story: You ask a coworker "What time is it?" and they respond with a three-paragraph explanation of how atomic clocks maintain precision. That is verbose — far more words than the situation needs.',
        zh: '词根拆解：verbum（拉丁语"词"）+ -ose（充满的）= 充满词语。\n故事：问同事几点，他用三段话解释时钟原理——这就是啰嗦。\n冗长的、啰嗦的：使用词语远超实际所需。',
      },
      {
        word: 'Persevere',
        phonetic: '/ˌpɜːsɪˈvɪər/',
        tag: 'Word Roots',
        en: '🔍 Root breakdown: Latin "per-" (through, thoroughly) + "severus" (strict, serious) = to be strictly committed all the way through. Story: A marathon runner hits "the wall" at mile 20 — legs burning, lungs aching. Perseverance is the invisible force that carries them across the finish line anyway.',
        zh: '词根拆解：per-（贯穿始终）+ severus（拉丁语"严格的"）= 始终如一地严格坚持。\n故事：马拉松选手在第20英里撞墙，是坚持不懈让他们跑完最后6英里。\n坚持不懈：面对困难仍继续努力，不轻言放弃。',
      },
      {
        word: 'Catastrophe',
        phonetic: '/kəˈtæstrəfi/',
        tag: 'Word Roots',
        en: '🔍 Root breakdown: Greek "kata-" (down) + "strophe" (turning) = a sudden downward turn. In ancient Greek theater, the "catastrophe" was the final scene where everything collapsed — heroes fell, cities burned, curtains dropped. Today, any sudden disaster that turns everything downward is a catastrophe.',
        zh: '词根拆解：kata-（向下）+ strophe（希腊语"转折"）= 向下的急剧转折。\n故事：古希腊戏剧中"catastrophe"是末幕，英雄陨落、城市覆灭的时刻。\n灾难：突然发生的严重灾难或彻底失败。',
      },
    ],
  },

  /* ── AI + 语法翻译 ────────────────────────────── */
  aiSentence: {
    label:  'AI + 语法翻译',
    tag:    'Sentence',
    accent: '#34d399',
    items: [
      {
        title: 'Hard work beats talent when talent refuses to work hard.',
        en: 'No matter how gifted you are, the person who shows up every day, puts in the hours, and refines their craft through deliberate practice will eventually outperform those who coast on natural ability alone.',
        zh: '无论你天赋多高，每天坚持出现、投入时间、通过刻意练习打磨技艺的人，最终都会超越那些只依赖天生能力的人。',
        source: 'Tim Notke',
        parts: [
          { text: 'No matter how gifted you are, ', role: 'adverbial-clause' },
          { text: 'the person', role: 'subject' },
          { text: ' who shows up every day, puts in the hours, and refines their craft through deliberate practice', role: 'relative-clause' },
          { text: ' will eventually outperform', role: 'predicate' },
          { text: ' those who coast on natural ability alone', role: 'object' },
          { text: '.', role: 'normal' },
        ],
      },
      {
        title: 'Reading widely is the fastest path to good writing.',
        en: 'Writers who read voraciously across genres — fiction, history, science, philosophy — absorb patterns of language unconsciously, so that when they sit down to write, fluency and style flow naturally from within.',
        zh: '大量涉猎各类题材——小说、历史、科学、哲学——的写作者能无意识地吸收语言规律，当他们坐下来写作时，流畅与风格便会自然而然地从内心涌现。',
        source: 'Writing Guide',
        parts: [
          { text: 'Writers', role: 'subject' },
          { text: ' who read voraciously across genres — fiction, history, science, philosophy —', role: 'relative-clause' },
          { text: ' absorb patterns of language unconsciously', role: 'predicate' },
          { text: ', so that when they sit down to write, fluency and style flow naturally from within', role: 'adverbial-clause' },
          { text: '.', role: 'normal' },
        ],
      },
      {
        title: 'Compound interest works the same way for knowledge.',
        en: 'Just as a small amount of money invested consistently over decades grows into enormous wealth through compounding, a small daily investment in learning — even just thirty minutes — accumulates into expertise that compounds over a lifetime.',
        zh: '就像少量资金经过数十年持续复利增长成为巨额财富一样，每天在学习上的微小投入——哪怕只有三十分钟——也会在一生中积累成不断复利增长的专业能力。',
        source: 'Charlie Munger',
        parts: [
          { text: 'Just as a small amount of money invested consistently over decades grows into enormous wealth through compounding', role: 'adverbial-clause' },
          { text: ', a small daily investment in learning', role: 'subject' },
          { text: ' — even just thirty minutes —', role: 'appositive' },
          { text: ' accumulates into ', role: 'predicate' },
          { text: 'expertise that compounds over a lifetime', role: 'object' },
          { text: '.', role: 'normal' },
        ],
      },
      {
        title: 'The map is not the territory.',
        en: 'Every model, theory, or mental framework is a simplification of reality — useful for navigation and prediction, but always incomplete, always missing details, and sometimes dangerously misleading when applied beyond its intended scope.',
        zh: '每一个模型、理论或思维框架都是对现实的简化——对导航和预测有用，但始终不完整，始终有所遗漏，当被应用于其适用范围之外时，有时甚至会产生危险的误导。',
        source: 'Alfred Korzybski',
        parts: [
          { text: 'Every model, theory, or mental framework', role: 'subject' },
          { text: ' is ', role: 'predicate' },
          { text: 'a simplification of reality', role: 'complement' },
          { text: ' — useful for navigation and prediction, but always incomplete, always missing details,', role: 'appositive' },
          { text: ' and sometimes dangerously misleading', role: 'appositive' },
          { text: ' when applied beyond its intended scope', role: 'adverbial-clause' },
          { text: '.', role: 'normal' },
        ],
      },
      {
        title: 'First principles thinking breaks problems down to their foundations.',
        en: 'Rather than reasoning by analogy — doing what others have done with slight modifications — first principles thinking requires you to break a problem down to its most fundamental truths and rebuild your solution from the ground up.',
        zh: '与类比推理——稍加改动地照搬他人做法——不同，第一性原理思维要求你将问题分解为最基本的真理，然后从零开始重建你的解决方案。',
        source: 'Elon Musk',
        parts: [
          { text: 'Rather than reasoning by analogy — doing what others have done with slight modifications —', role: 'adverbial' },
          { text: ' first principles thinking', role: 'subject' },
          { text: ' requires ', role: 'predicate' },
          { text: 'you', role: 'object' },
          { text: ' to break a problem down to its most fundamental truths and rebuild your solution from the ground up', role: 'complement' },
          { text: '.', role: 'normal' },
        ],
      },
      {
        title: 'Sleep is not a luxury — it is a biological necessity.',
        en: 'During deep sleep, your brain flushes out metabolic waste through the glymphatic system, consolidates the day\'s memories, and repairs cellular damage — processes that no amount of caffeine can replicate or replace.',
        zh: '在深度睡眠中，你的大脑通过淋巴系统冲刷代谢废物、巩固当天的记忆并修复细胞损伤——这些过程无论多少咖啡因都无法复制或替代。',
        source: 'Matthew Walker, Why We Sleep',
        parts: [
          { text: 'During deep sleep, ', role: 'adverbial' },
          { text: 'your brain', role: 'subject' },
          { text: ' flushes out metabolic waste through the glymphatic system, consolidates the day\'s memories, and repairs cellular damage', role: 'predicate' },
          { text: ' — processes that no amount of caffeine can replicate or replace', role: 'appositive' },
          { text: '.', role: 'normal' },
        ],
      },
      {
        title: 'A system without feedback flies blind.',
        en: 'A system without feedback is like a pilot flying through fog with no instruments — it cannot self-correct, cannot improve, and will inevitably drift off course; the best teams, products, and individuals share one trait: they actively seek honest, critical feedback and use it as fuel for growth.',
        zh: '没有反馈的系统如同在浓雾中无仪表飞行的飞行员——无法自我纠正，无法进步，必然偏离航线；最优秀的团队、产品和个人都拥有同一特质：主动寻求诚实而尖锐的反馈，并将其作为成长的燃料。',
        source: 'Ken Blanchard',
        parts: [
          { text: 'A system without feedback', role: 'subject' },
          { text: ' is like ', role: 'predicate' },
          { text: 'a pilot flying through fog with no instruments', role: 'complement' },
          { text: ' — it cannot self-correct, cannot improve, and will inevitably drift off course', role: 'appositive' },
          { text: '; the best teams, products, and individuals', role: 'subject' },
          { text: ' share ', role: 'predicate' },
          { text: 'one trait', role: 'object' },
          { text: ': they actively seek honest, critical feedback and use it as fuel for growth', role: 'appositive' },
          { text: '.', role: 'normal' },
        ],
      },
      {
        title: 'Writing forces you to confront what you don\'t know.',
        en: 'When you force yourself to write down an idea in clear, concrete sentences, you quickly discover whether you truly understand it or have merely been fooled by the comfortable vagueness of your own unexpressed thoughts.',
        zh: '当你强迫自己用清晰、具体的句子写下一个想法时，你很快就会发现自己是否真正理解了它，还是仅仅被自己未表达的模糊思维所迷惑。',
        source: 'Richard Feynman',
        parts: [
          { text: 'When you force yourself to write down an idea in clear, concrete sentences', role: 'adverbial-clause' },
          { text: ', you', role: 'subject' },
          { text: ' quickly discover ', role: 'predicate' },
          { text: 'whether you truly understand it or have merely been fooled by the comfortable vagueness of your own unexpressed thoughts', role: 'noun-clause' },
          { text: '.', role: 'normal' },
        ],
      },
      {
        title: 'Systems produce exactly the outcomes they were designed for.',
        en: 'If you want to lose weight but your kitchen is stocked with junk food and your schedule has no time for exercise, the system you live in will reliably produce the outcome it was built for — which is not the outcome you want.',
        zh: '如果你想减肥，但厨房里满是垃圾食品，日程表里没有运动时间，那么你所处的系统将稳定地产生它被构建时所对应的结果——而那并非你想要的结果。',
        source: 'James Clear, Atomic Habits',
        parts: [
          { text: 'If you want to lose weight but your kitchen is stocked with junk food and your schedule has no time for exercise', role: 'adverbial-clause' },
          { text: ', the system you live in', role: 'subject' },
          { text: ' will reliably produce ', role: 'predicate' },
          { text: 'the outcome', role: 'object' },
          { text: ' it was built for', role: 'relative-clause' },
          { text: ' — which is not the outcome you want', role: 'relative-clause' },
          { text: '.', role: 'normal' },
        ],
      },
      {
        title: 'Most people listen not to understand, but to reply.',
        en: 'Most people listen not to understand but to reply — their minds are already composing a response while the other person is still speaking, which means they miss the nuance, the emotion, and the real point buried beneath the words.',
        zh: '大多数人听话不是为了理解，而是为了回应——对方还没说完，他们的脑子就已经在组织回答了，这意味着他们错过了言语之下隐藏的细微差别、情感和真正要点。',
        source: 'Stephen Covey',
        parts: [
          { text: 'Most people', role: 'subject' },
          { text: ' listen ', role: 'predicate' },
          { text: 'not to understand but to reply', role: 'adverbial' },
          { text: ' — their minds are already composing a response', role: 'appositive' },
          { text: ' while the other person is still speaking', role: 'adverbial-clause' },
          { text: ', which means they miss the nuance, the emotion, and the real point buried beneath the words', role: 'relative-clause' },
          { text: '.', role: 'normal' },
        ],
      },
      {
        title: 'Good code is its own best documentation.',
        en: 'When variable names are precise, functions do exactly one thing, and structure mirrors the domain it models, code becomes self-explanatory — the need for comments shrinks because the logic speaks clearly for itself.',
        zh: '当变量名精确、函数只做一件事、结构映射其所建模的领域时，代码本身就能自我说明——注释的需求随之减少，因为逻辑本身已经说得足够清晰。',
        source: 'Clean Code, Robert C. Martin',
        parts: [
          { text: 'When variable names are precise, functions do exactly one thing, and structure mirrors the domain it models', role: 'adverbial-clause' },
          { text: ', code', role: 'subject' },
          { text: ' becomes ', role: 'predicate' },
          { text: 'self-explanatory', role: 'complement' },
          { text: ' — the need for comments shrinks', role: 'appositive' },
          { text: ' because the logic speaks clearly for itself', role: 'adverbial-clause' },
          { text: '.', role: 'normal' },
        ],
      },
      {
        title: 'Experts and beginners see the same world differently.',
        en: 'A novice chess player sees a board of pieces; a grandmaster sees threats, patterns, and possibilities twelve moves ahead — expertise is not about working harder, but about perceiving a richer, more structured version of the same reality.',
        zh: '象棋新手看到的是棋盘上的棋子；棋手大师看到的是十二步之后的威胁、模式和可能性——专业知识不在于更努力，而在于感知同一现实更丰富、更有结构的版本。',
        source: 'Cognitive Science Research',
        parts: [
          { text: 'A novice chess player', role: 'subject' },
          { text: ' sees ', role: 'predicate' },
          { text: 'a board of pieces', role: 'object' },
          { text: '; a grandmaster', role: 'subject' },
          { text: ' sees ', role: 'predicate' },
          { text: 'threats, patterns, and possibilities twelve moves ahead', role: 'object' },
          { text: ' — expertise is not about working harder, but about perceiving a richer, more structured version of the same reality', role: 'appositive' },
          { text: '.', role: 'normal' },
        ],
      },
      {
        title: 'Pronouns, verbs, adverbs, adjectives and nouns.',
        en: 'She quickly writes elegant code that solves real problems.',
        zh: '她快速地编写优雅的代码，解决真实的问题。',
        source: 'Grammar Demo',
        parts: [
          { text: 'She', role: 'pronoun' },
          { text: ' quickly', role: 'adverb' },
          { text: ' writes', role: 'verb' },
          { text: ' elegant', role: 'adjective' },
          { text: ' code', role: 'noun' },
          { text: ' that solves real problems', role: 'relative-clause' },
          { text: '.', role: 'normal' },
        ],
      },
      {
        title: 'Articles, nouns, verbs, prepositions and adjectives.',
        en: 'The intelligent algorithm runs efficiently on large datasets.',
        zh: '这个智能算法能在大型数据集上高效运行。',
        source: 'Grammar Demo',
        parts: [
          { text: 'The', role: 'article' },
          { text: ' intelligent', role: 'adjective' },
          { text: ' algorithm', role: 'noun' },
          { text: ' runs', role: 'verb' },
          { text: ' efficiently', role: 'adverb' },
          { text: ' on', role: 'preposition' },
          { text: ' large', role: 'adjective' },
          { text: ' datasets', role: 'noun' },
          { text: '.', role: 'normal' },
        ],
      },
      {
        title: 'Auxiliary verbs, infinitives and conjunctions.',
        en: 'You must train and evaluate the model carefully before deploying it.',
        zh: '在部署模型之前，你必须仔细地训练并评估它。',
        source: 'Grammar Demo',
        parts: [
          { text: 'You', role: 'pronoun' },
          { text: ' must', role: 'auxiliary' },
          { text: ' train', role: 'infinitive' },
          { text: ' and', role: 'conjunction' },
          { text: ' evaluate', role: 'infinitive' },
          { text: ' the model', role: 'noun' },
          { text: ' carefully', role: 'adverb' },
          { text: ' before deploying it', role: 'adverbial-clause' },
          { text: '.', role: 'normal' },
        ],
      },
      {
        title: 'Gerunds, determiners and prepositions.',
        en: 'Collecting and cleaning data requires significant effort from every team member.',
        zh: '收集和清洗数据需要每个团队成员付出大量精力。',
        source: 'Grammar Demo',
        parts: [
          { text: 'Collecting', role: 'gerund' },
          { text: ' and', role: 'conjunction' },
          { text: ' cleaning', role: 'gerund' },
          { text: ' data', role: 'noun' },
          { text: ' requires', role: 'verb' },
          { text: ' significant', role: 'adjective' },
          { text: ' effort', role: 'noun' },
          { text: ' from', role: 'preposition' },
          { text: ' every', role: 'determiner' },
          { text: ' team member', role: 'noun' },
          { text: '.', role: 'normal' },
        ],
      },
      {
        title: 'Participles, interjections and mixed roles.',
        en: 'Wow, a well-trained model can generate surprisingly accurate answers even without explicit instructions.',
        zh: '哇，一个训练良好的模型即使没有明确的指令，也能生成惊人准确的答案。',
        source: 'Grammar Demo',
        parts: [
          { text: 'Wow', role: 'interjection' },
          { text: ', a', role: 'article' },
          { text: ' well-trained', role: 'participle' },
          { text: ' model', role: 'noun' },
          { text: ' can', role: 'auxiliary' },
          { text: ' generate', role: 'verb' },
          { text: ' surprisingly', role: 'adverb' },
          { text: ' accurate', role: 'adjective' },
          { text: ' answers', role: 'noun' },
          { text: ' even without', role: 'preposition' },
          { text: ' explicit', role: 'adjective' },
          { text: ' instructions', role: 'noun' },
          { text: '.', role: 'normal' },
        ],
      },
    ],
  },

};
