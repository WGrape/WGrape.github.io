#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const TAGS = [
  '思维与认知', '情感与性格', '社会与制度', '经济与商业',
  '科技与创新', '自然与环境', '政治与外交', '学术与研究',
  '医学与健康', '文化与艺术', '法律与道德', '语言与文字'
];

function parseTextFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').filter(line => line.trim());

  const words = lines.map(line => {
    const parts = line.trim().split(/\s+/);
    let word = '';
    let meaning = '';

    const tabParts = line.split('\t');
    if (tabParts.length >= 2) {
      word = tabParts[0].trim();
      meaning = tabParts.slice(1).join(' ').trim();
    } else {
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const posPattern = /^[a-z]+\./;
        if (posPattern.test(part) && i > 0) {
          word = parts.slice(0, i).join(' ').trim();
          meaning = parts.slice(i).join(' ').trim();
          break;
        }
      }
      if (!word) {
        word = parts[0].trim();
        meaning = parts.slice(1).join(' ').trim();
      }
    }

    return {
      word,
      meaning,
      tag: TAGS[Math.floor(Math.random() * TAGS.length)]
    };
  });

  return words.filter(item => item.word && item.meaning);
}

function main() {
  const dataDir = path.join(__dirname, 'data');
  const jsDir = path.join(__dirname, 'js');

  const files = ['cet4.txt', 'cet6.txt', 'cet-kaoyan.txt'];
  const names = ['CET4', 'CET6', '考研'];
  const vars = ['CET4_VOCAB', 'CET6_VOCAB', 'CET_KAOYAN_VOCAB'];

  files.forEach((file, idx) => {
    const filePath = path.join(dataDir, file);
    const words = parseTextFile(filePath);

    const output = `/**
 * =====================================================
 * ${names[idx]} 词汇数据源
 * =====================================================
 *
 * 数据结构说明：
 *   word      单词
 *   tag       分类标签
 *   meaning   中文释义
 *
 * 总词条：${words.length} 条
 * =====================================================
 */

var ${vars[idx]} = ${JSON.stringify(words, null, 2)};\n`;

    fs.writeFileSync(path.join(jsDir, `${file.replace('.txt', '')}.js`), output);
    console.log(`Generated ${file.replace('.txt', '')}.js with ${words.length} words`);
  });

  console.log('Done!');
}

main();
