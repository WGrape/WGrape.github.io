#!/usr/bin/env node
/**
 * 为单词墙生成带例句的增强词库 v4
 * 核心原则：中文翻译必须是纯中文自然句子，明确展示单词含义
 */

const fs = require('fs');
const path = require('path');

// 从释义中提取核心中文含义（彻底清除所有词性前缀）
function extractCoreMeaning(meaning) {
  let s = meaning.trim();

  // 按空格分割，找到第一个包含中文的片段
  const parts = s.split(/\s+/);
  let chineseParts = [];
  for (const p of parts) {
    let cleaned = p
      .replace(/^(adj|adv|noun|verb)\.?\s*/gi, '')
      .replace(/^[nva]\.?\s*/gi, '')
      .replace(/^(dj|av)\.?\s*/gi, '');
    if (/[\u4e00-\u9fff]/.test(cleaned)) {
      chineseParts.push(cleaned);
    }
  }

  if (chineseParts.length > 0) {
    s = chineseParts[0];
  } else {
    s = s.replace(/^(adj|adv|noun|verb)\.?\s*/gi, '');
    s = s.replace(/^[nva]\.?\s*/gi, '');
    s = s.trim();
  }

  // 取分号之前
  if (s.includes('；')) s = s.split('；')[0].trim();
  // 取第一个逗号/顿号之前（只要第一个短释义）
  if (s.includes('，')) s = s.substring(0, s.indexOf('，')).trim();
  if (s.includes(',')) s = s.substring(0, s.indexOf(',')).trim();

  // 截断过长
  if (s.length > 10) s = s.substring(0, 10);

  return s.trim() || meaning;
}

// 检测词性
function detectPos(meaning) {
  const m = meaning.trim();
  if (/^n\./.test(m)) return 'noun';
  if (/^v\./.test(m)) return 'verb';
  if (/^(adj|a)\./.test(m)) return 'adj';
  if (/^adv/.test(m)) return 'adv';
  return 'other';
}

// 根据词性和释义生成例句
// v4 核心改进：中文翻译是纯中文自然句子，不混入任何英文单词
function generateExample(word, meaning) {
  const pos = detectPos(meaning);
  let core = extractCoreMeaning(meaning);
  const W = word.charAt(0).toUpperCase() + word.slice(1);
  const w = word.toLowerCase();

  // 辅助函数：将 core 嵌入句子时避免重复"的"
  function c(suffix) {
    // 如果 core 以"的"结尾且 suffix 以"的"开头，去掉 core 末尾的"的"
    if (core.endsWith('的') && suffix.startsWith('的')) {
      return core + suffix.slice(1);
    }
    return core + suffix;
  }
  function cBefore(prefix) {
    // 如果 prefix 以"的"结尾且 core 以"的"开头，去掉 core 开头的"的"
    if (prefix.endsWith('的') && core.startsWith('的')) {
      return prefix + core.slice(1);
    }
    return prefix + core;
  }

  let en = '', zh = '';

  // ═══════════════════════════════════════
  // 名词模板 — 中文翻译纯中文，自然表达含义
  // ═══════════════════════════════════════
  const nounTemplates = [
    {
      en: `The ${w} is a key concept in modern society.`,
      zh: `「${core}」是这个词汇的核心含义。`,
    },
    {
      en: `Scholars have long studied the nature of ${w}.`,
      zh: `学者们长期研究的正是${core}这一概念。`,
    },
    {
      en: `We need to understand what ${w} truly means.`,
      zh: `我们需要真正理解什么是${core}。`,
    },
    {
      en: `${W} plays a crucial role in our daily life.`,
      zh: `在日常生活中，${core}扮演着重要角色。`,
    },
    {
      en: `Many people confuse ${w} with similar concepts.`,
      zh: `很多人会把${core}和一些相似的概念混淆。`,
    },
    {
      en: `The definition of ${w} has evolved over time.`,
      zh: `人们对${core}的定义随着时间不断演变。`,
    },
    {
      en: `Understanding ${w} is essential for learning English.`,
      zh: `想学好英语，必须先搞懂什么是${core}。`,
    },
    {
      en: `You will encounter the word ${w} frequently in reading.`,
      zh: `阅读时你会经常遇到表示${core}的这个词。`,
    },
  ];

  // ═══════════════════════════════════════
  // 动词模板
  // ═══════════════════════════════════════
  const verbTemplates = [
    {
      en: `We should try to ${w} this problem step by step.`,
      zh: `我们应该一步步地${core}这个问题。`,
    },
    {
      en: `If you ${w} something, you take action on it.`,
      zh: `所谓${core}，就是针对某事采取实际行动。`,
    },
    {
      en: `She decided to ${w} the situation immediately.`,
      zh: `她决定立刻${core}当前的局面。`,
    },
    {
      en: `To ${w} well requires practice and patience.`,
      zh: `想要熟练地${core}，需要不断练习和耐心。`,
    },
    {
      en: `They managed to ${w} the goal through hard work.`,
      zh: `通过努力工作，他们最终成功${core}了目标。`,
    },
    {
      en: `Learning how to ${w} is a valuable skill.`,
      zh: `学会如何${core}是一项非常有价值的技能。`,
    },
    {
      en: `You can ${w} this by following these steps.`,
      zh: `按照这些步骤，你就可以完成${core}。`,
    },
  ];

  // ═══════════════════════════════════════
  // 形容词模板
  // ═══════════════════════════════════════
  const adjTemplates = [
    {
      en: `This situation is truly ${w}.`,
      zh: `这种情况确实可以用「${core}」来形容。`,
    },
    {
      en: `It is ${w} to see such remarkable progress.`,
      zh: `看到如此显著的进步，真是令人感到${core}。`,
    },
    {
      en: `A ${w} approach often yields better results.`,
      zh: `采取${c('的方法')}通常会带来更好的结果。`,
    },
    {
      en: `The result was surprisingly ${w}.`,
      zh: `结果出乎意料地${core}。`,
    },
    {
      en: `Being ${w} means having a specific quality.`,
      zh: `所谓${core}，指的是具备某种特定的品质或特征。`,
    },
    {
      en: `Most experts agree this method is ${w}.`,
      zh: `大多数专家都认为这种方法是${c('的')}。`,
    },
    {
      en: `Her attitude toward the problem was quite ${w}.`,
      zh: `她对待这个问题的态度相当${core}。`,
    },
  ];

  // ═══════════════════════════════════════
  // 副词模板
  // ═══════════════════════════════════════
  const advTemplates = [
    {
      en: `He spoke ${w} to emphasize his point.`,
      zh: `他${core}地说话，以强调自己的观点。`,
    },
    {
      en: `She handled the situation ${w}.`,
      zh: `她${core}地处理了整个局面。`,
    },
    {
      en: `To do something ${w} requires skill.`,
      zh: `要想${core}地做某件事，需要一定的技巧。`,
    },
    {
      en: `The team worked ${w} to meet the deadline.`,
      zh: `团队${core}地工作，以便按时完成任务。`,
    },
  ];

  // ═══════════════════════════════════════
  // 其他/通用模板（兜底）
  // ═══════════════════════════════════════
  const otherTemplates = [
    {
      en: `The term "${word}" has a specific meaning in English.`,
      zh: `${core}——这就是该词在英语中的含义。`,
    },
    {
      en: `${W} is an important word to remember.`,
      zh: `${core}，这是一个需要牢记的重要词汇。`,
    },
    {
      en: `In academic contexts, ${w} carries special significance.`,
      zh: `在学术语境中，${c('具有特殊意义')}。`,
    },
    {
      en: `You will frequently encounter ${w} in English reading.`,
      zh: `阅读时你会经常碰到表示${c('的')}这个词。`,
    },
  ];

  // 选择对应词性的模板池
  let pool;
  switch (pos) {
    case 'noun': pool = nounTemplates; break;
    case 'verb': pool = verbTemplates; break;
    case 'adj': pool = adjTemplates; break;
    case 'adv': pool = advTemplates; break;
    default: pool = otherTemplates;
  }

  // 用 word 的字符码做确定性随机（同个词每次生成相同结果）
  const hash = word.split('').reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
  const idx = Math.abs(hash) % pool.length;
  const t = pool[idx];
  en = t.en; zh = t.zh;

  return { en, zh };
}

// 主函数
function main() {
  const vocabs = [
    { file: 'js/cet4.js', varName: 'CET4_VOCAB', outVar: 'CET4_WALL_VOCAB' },
    { file: 'js/cet6.js', varName: 'CET6_VOCAB', outVar: 'CET6_WALL_VOCAB' },
    { file: 'js/cet-kaoyan.js', varName: 'CET_KAOYAN_VOCAB', outVar: 'KAOYAN_WALL_VOCAB' },
  ];

  vocabs.forEach(({ file, varName, outVar }) => {
    const srcPath = path.join(__dirname, file);

    if (!fs.existsSync(srcPath)) {
      console.log(`跳过 ${file}: 文件不存在`);
      return;
    }

    const content = fs.readFileSync(srcPath, 'utf-8');
    const match = content.match(new RegExp(`var ${varName}\\s*=\\s*(\\[[\\s\\S]*\\]);`));
    if (!match) {
      console.log(`无法从 ${file} 提取 ${varName}`);
      return;
    }

    let vocab;
    try { vocab = eval(match[1]); } catch (e) { console.log(`解析 ${file} 失败:`, e.message); return; }

    console.log(`处理 ${file}: ${vocab.length} 条词条`);

    const enhanced = vocab.map(item => {
      const example = generateExample(item.word, item.meaning);
      return {
        word: item.word,
        meaning: item.meaning,
        tag: item.tag || '',
        en: example.en,
        zh: example.zh,
      };
    });

    const outContent = `/**
 * =====================================================
 * 单词墙增强词库（含例句） v4 — 纯中文翻译
 * 源文件：${file}
 * 生成时间：${new Date().toISOString()}
 * 总词条：${enhanced.length} 条
 * =====================================================
 */

var ${outVar} = ${JSON.stringify(enhanced, null, 2)};
`;

    const outFile = path.join(__dirname, file.replace('.js', '-wall.js'));
    fs.writeFileSync(outFile, outContent, 'utf-8');
    console.log(`✅ 已生成 ${outFile} (${enhanced.length} 条)`);
  });
}

main();
