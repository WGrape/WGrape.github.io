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
    ],
  },

  /* ── AI + 单词 ──────────────────────────────────── */
  aiWord: {
    label:  'AI + 单词',
    tag:    'Vocabulary',
    accent: '#a78bfa',
    items: [
      {
        word: 'Alignment',
        phonetic: '/əˈlaɪnmənt/',
        tag: 'AI Safety',
        en: 'Alignment describes making an AI system behave in ways that match human goals, values, and expectations.',
        zh: '对齐：让 AI 系统的行为尽可能符合人类的目标、价值观和预期。',
      },
      {
        word: 'Hallucination',
        phonetic: '/həˌluːsɪˈneɪʃn/',
        tag: 'LLM',
        en: 'Hallucination refers to when an AI model generates confident but factually incorrect or fabricated content.',
        zh: '幻觉：AI 模型生成看似自信但实际上不准确或虚构内容的现象。',
      },
      {
        word: 'Inference',
        phonetic: '/ˈɪnfərəns/',
        tag: 'ML',
        en: 'Inference is the process of using a trained model to make predictions on new, unseen data.',
        zh: '推理：使用已训练好的模型对新数据进行预测的过程。',
      },
      {
        word: 'Fine-tuning',
        phonetic: '/faɪn ˈtjuːnɪŋ/',
        tag: 'Training',
        en: 'Fine-tuning adapts a pre-trained model to a specific task by training it on a smaller, task-specific dataset.',
        zh: '微调：通过在特定任务的小数据集上继续训练，将预训练模型适配到特定场景。',
      },
      {
        word: 'Embedding',
        phonetic: '/ɪmˈbedɪŋ/',
        tag: 'Representation',
        en: 'An embedding is a dense numerical vector that represents the meaning of words or data in a continuous space.',
        zh: '嵌入：将单词或数据表示为连续空间中稠密数值向量的技术。',
      },
      {
        word: 'Prompt Engineering',
        phonetic: '/prɒmpt ˌendʒɪˈnɪərɪŋ/',
        tag: 'LLM',
        en: 'Prompt engineering is the practice of crafting input text to guide a language model toward desired outputs.',
        zh: '提示工程：通过精心设计输入文本，引导语言模型输出符合预期结果的实践。',
      },
      {
        word: 'RAG',
        phonetic: '/ræɡ/',
        tag: 'Architecture',
        en: 'Retrieval-Augmented Generation combines a retrieval system with a generative model to ground responses in external knowledge.',
        zh: '检索增强生成：结合检索系统与生成模型，让回答有外部知识作为依据。',
      },
      {
        word: 'Token',
        phonetic: '/ˈtəʊkən/',
        tag: 'LLM Basics',
        en: 'A token is the basic unit of text that a language model processes, roughly corresponding to a word or subword.',
        zh: 'Token：语言模型处理文本的基本单位，大致对应一个单词或子词。',
      },
      {
        word: 'Grounding',
        phonetic: '/ˈɡraʊndɪŋ/',
        tag: 'Reliability',
        en: 'Grounding connects AI-generated responses to verifiable facts or real-world data sources.',
        zh: '接地：将 AI 生成的回答与可验证事实或真实数据来源相连接。',
      },
      {
        word: 'Context Window',
        phonetic: '/ˈkɒntekst ˈwɪndəʊ/',
        tag: 'LLM',
        en: 'The context window is the maximum amount of text (in tokens) a language model can attend to at once.',
        zh: '上下文窗口：语言模型一次能处理的最大文本量（以 token 计）。',
      },
      {
        word: 'Multimodal',
        phonetic: '/ˌmʌltiˈməʊdl/',
        tag: 'Architecture',
        en: 'A multimodal AI model can process and generate content across multiple modalities such as text, images, and audio.',
        zh: '多模态：能够跨文本、图像、音频等多种模态处理和生成内容的 AI 模型。',
      },
      {
        word: 'Agent',
        phonetic: '/ˈeɪdʒənt/',
        tag: 'AI Agent',
        en: 'An AI agent perceives its environment, makes decisions, and takes actions autonomously to achieve a goal.',
        zh: 'Agent：能感知环境、自主做决策并采取行动以实现目标的 AI 系统。',
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
        title: 'Reliable AI products are systems, not just models.',
        en: 'A strong AI product is not just a smart model, but a reliable system that can retrieve context, use tools, and return answers in a form users can act on.',
        zh: '一个优秀的 AI 产品不只是聪明的模型，更是一个可靠的系统：它能获取上下文、调用工具，并以用户可直接采取行动的形式返回答案。',
        source: 'AI Engineering, 2024',
        parts: [
          { text: 'A strong AI product', role: 'subject' },
          { text: ' is ', role: 'predicate' },
          { text: 'not just a smart model, but a reliable system', role: 'complement' },
          { text: ' that can retrieve context, use tools, and return answers', role: 'relative-clause' },
          { text: ' in a form ', role: 'adverbial' },
          { text: 'users can act on', role: 'relative-clause' },
          { text: '.', role: 'normal' },
        ],
      },
      {
        title: 'The context window is the working memory of a language model.',
        en: 'Everything the model knows about the current task — the system prompt, conversation history, retrieved documents, and user input — must fit inside the context window.',
        zh: '模型对当前任务所知道的一切——系统提示、对话历史、检索到的文档以及用户输入——都必须放进上下文窗口中。',
        source: 'Anthropic, 2024',
        parts: [
          { text: 'Everything', role: 'subject' },
          { text: ' the model knows about the current task', role: 'relative-clause' },
          { text: ' — the system prompt, conversation history, retrieved documents, and user input —', role: 'appositive' },
          { text: ' must fit', role: 'predicate' },
          { text: ' inside the context window', role: 'adverbial' },
          { text: '.', role: 'normal' },
        ],
      },
      {
        title: 'Hallucinations are a fundamental challenge, not a bug to be patched.',
        en: 'Large language models generate plausible-sounding text by predicting likely next tokens, which means they can produce confident, fluent, and entirely incorrect statements without any signal that something has gone wrong.',
        zh: '大语言模型通过预测下一个最可能的 token 来生成听起来合理的文本，这意味着它们可以自信、流畅地输出完全错误的内容，而不发出任何出错的信号。',
        source: 'OpenAI Research, 2023',
        parts: [
          { text: 'Large language models', role: 'subject' },
          { text: ' generate ', role: 'predicate' },
          { text: 'plausible-sounding text', role: 'object' },
          { text: ' by predicting likely next tokens', role: 'adverbial' },
          { text: ', which means they can produce confident, fluent, and entirely incorrect statements', role: 'relative-clause' },
          { text: ' without any signal', role: 'adverbial' },
          { text: ' that something has gone wrong', role: 'relative-clause' },
          { text: '.', role: 'normal' },
        ],
      },
      {
        title: 'Agents need to plan, act, observe, and reflect.',
        en: 'An effective AI agent must be able to decompose a complex goal into subtasks, execute each subtask using available tools, observe the results, and update its plan based on what it has learned.',
        zh: '一个有效的 AI Agent 必须能够将复杂目标分解为子任务，使用可用工具执行每个子任务，观察结果，并根据所学内容更新计划。',
        source: 'LangChain Docs',
        parts: [
          { text: 'An effective AI agent', role: 'subject' },
          { text: ' must be able to ', role: 'predicate' },
          { text: 'decompose a complex goal into subtasks, execute each subtask using available tools, observe the results, and update its plan', role: 'object' },
          { text: ' based on ', role: 'adverbial' },
          { text: 'what it has learned', role: 'noun-clause' },
          { text: '.', role: 'normal' },
        ],
      },
      {
        title: 'Retrieval-augmented generation grounds the model in reality.',
        en: 'Rather than relying solely on parametric knowledge baked into model weights during training, RAG systems fetch relevant documents at inference time and provide them as context, dramatically reducing hallucinations for knowledge-intensive tasks.',
        zh: '与完全依赖训练时嵌入模型权重中的参数化知识不同，RAG 系统在推理时获取相关文档并将其作为上下文提供，从而大幅减少知识密集型任务中的幻觉现象。',
        source: 'Meta AI Research',
        parts: [
          { text: 'Rather than relying solely on parametric knowledge baked into model weights during training, ', role: 'adverbial' },
          { text: 'RAG systems', role: 'subject' },
          { text: ' fetch relevant documents at inference time and provide them as context', role: 'predicate' },
          { text: ', dramatically reducing hallucinations for knowledge-intensive tasks', role: 'participial' },
          { text: '.', role: 'normal' },
        ],
      },
      {
        title: 'Alignment is not a technical problem alone.',
        en: 'Ensuring that AI systems behave in accordance with human values requires not only advances in machine learning research, but also careful work in ethics, governance, and the ongoing collaboration between developers, policymakers, and the public.',
        zh: '确保 AI 系统的行为符合人类价值观，不仅需要机器学习研究的进步，还需要在伦理、治理方面的细致工作，以及开发者、政策制定者和公众之间的持续协作。',
        source: 'DeepMind Safety',
        parts: [
          { text: 'Ensuring', role: 'subject' },
          { text: ' that AI systems behave in accordance with human values', role: 'noun-clause' },
          { text: ' requires ', role: 'predicate' },
          { text: 'not only advances in machine learning research, but also careful work in ethics, governance, and the ongoing collaboration between developers, policymakers, and the public', role: 'object' },
          { text: '.', role: 'normal' },
        ],
      },
      {
        title: 'Scaling alone does not solve all problems.',
        en: 'While increasing model size, data volume, and compute has yielded remarkable capabilities, certain failure modes — such as reasoning errors, brittleness under distribution shift, and susceptibility to adversarial inputs — persist even in the largest models.',
        zh: '尽管扩大模型规模、数据量和算力带来了显著能力提升，但某些失败模式——如推理错误、分布偏移下的脆弱性以及对对抗性输入的敏感性——在最大的模型中依然存在。',
        source: 'Stanford CRFM, 2023',
        parts: [
          { text: 'While increasing model size, data volume, and compute has yielded remarkable capabilities', role: 'adverbial-clause' },
          { text: ', certain failure modes', role: 'subject' },
          { text: ' — such as reasoning errors, brittleness under distribution shift, and susceptibility to adversarial inputs —', role: 'appositive' },
          { text: ' persist', role: 'predicate' },
          { text: ' even in the largest models', role: 'adverbial' },
          { text: '.', role: 'normal' },
        ],
      },
      {
        title: 'The system prompt shapes everything.',
        en: 'Before a single user message is processed, the system prompt establishes the model\'s persona, constraints, available tools, and the norms it should follow — making it the most powerful lever a developer has for controlling model behavior.',
        zh: '在处理任何用户消息之前，系统提示就已确立了模型的角色、约束、可用工具以及应遵循的规范——这使其成为开发者控制模型行为最强有力的杠杆。',
        source: 'OpenAI Platform Docs',
        parts: [
          { text: 'Before a single user message is processed', role: 'adverbial-clause' },
          { text: ', the system prompt', role: 'subject' },
          { text: ' establishes ', role: 'predicate' },
          { text: 'the model\'s persona, constraints, available tools, and the norms', role: 'object' },
          { text: ' it should follow', role: 'relative-clause' },
          { text: ' — making it the most powerful lever a developer has for controlling model behavior', role: 'participial' },
          { text: '.', role: 'normal' },
        ],
      },
    ],
  },

};
