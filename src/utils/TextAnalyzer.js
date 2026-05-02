class TextAnalyzer {
  constructor(text) {
    this.originalText = text || '';
    this.chineseOnly = this.extractChineseCharacters();
  }

  extractChineseCharacters() {
    // 提取中文字符（包括简体、繁体）
    const chineseRegex = /[\u4e00-\u9fff]/g;
    return (this.originalText.match(chineseRegex) || []).join('');
  }

  getCharacterCount() {
    return this.originalText.length;
  }

  getChineseCharacterCount() {
    return this.chineseOnly.length;
  }

  getWordFrequency() {
    const words = this.originalText.split(/\s+/).filter(word => word.length > 0);
    const frequency = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    return frequency;
  }
}

export { TextAnalyzer, splitChapters, processChapterData };

// 卷数据处理
function splitChapters(text) {
  const pattern = /(第[零〇一二两三四五六七八九十百千万0-9]+章)/g;
  
  const chapters = [];
  let match;
  let lastTitle = null;
  let lastIndex = 0;

  while ((match = pattern.exec(text)) !== null) {
    const title = match[0];
    const titleIndex = match.index;
    
    // 如果有上一个章节，保存它（标题 + 从标题后到当前标题前的内容）
    if (lastTitle !== null) {
      const content = text.substring(lastIndex, titleIndex);
      chapters.push(`${lastTitle}${content}`);
    }
    
    // 记录当前章节标题和标题结束位置
    lastTitle = title;
    lastIndex = titleIndex + title.length;
  }
  
  // 处理最后一个章节
  if (lastTitle !== null) {
    const content = text.substring(lastIndex);
    chapters.push(`${lastTitle}${content}`);
  }

  return chapters;
}

function processChapterData(data) {
  const processed = {
    ...data,
    title: "",
    content: []
  };
  
  // 过滤 content 数组
  const filteredContent = data.content.filter(line => {
    // 过滤空行
    if (line.trim() === "") return false;
    // 过滤广告行
    if (/八\s*零\s*电\s*子\s*书|w{3}\.\d+\s*\w+\s*\.\s*c\s*o\s*m/i.test(line)) return false;
    // 过滤只有分隔线的行
    if (/^-{3,}$/.test(line.trim())) return false;

    // 过滤 \nnext： 项
    if ([
        "\"", 
        "\nnext：", 
        "    ：。：", 
        "    （推荐一首改版后的天下潮，在我微信公众号fenghuo1985就有，大家可以关注一下。我的新浪微博也有链接。Ps：这首歌的幕后制作花絮尤为精彩。）",
        "    （万字章节，补上昨天的请假。ps：本章的章节名借自一位读者。）",
        "    :",
        "    （必须要表扬一下大家，剑来这本书的订阅很奇怪，高定21500，均订20000，但是24小时订阅是20500。感谢你们对剑来的喜爱。）",
        "    推荐一个淘宝天猫内部折扣优惠券的微信公众号:guoertejia每天人工筛选上百款特价商品。打开微信添加微信公众号:guoertejia　省不少辛苦钱。",
        "    （昨天的章节末尾，那句小诗，出自白鹤林的孤独，今天的末尾，则好像是一位小孩子写的，我只是稍作改编。两首小诗，我都很喜欢，一见钟情的那种。）",
        "    （让大家久等了~）",
        "    （一万字，补上19号的请假。）",
        "    （章节名借自圈子的读者。）",
        "    （说两件事，一个是微信公众号发了1655期刊的第一期，喜欢剑来和雪中的朋友一定要去翻一下。再就是这个月事情比较多，只能争取12万字左右的更新，世间总有无奈事，穷尽人力。只不过自剑来开书以来，有句话感受颇深，就是“但问耕耘，莫问收获”，与大家共勉。）",
    ].includes(line)) return false;
    return true;
  });
  
  // 处理最后一项，去掉 \n------------
  if (filteredContent.length > 0) {
    let lastLine = filteredContent[filteredContent.length - 1];
    lastLine = lastLine.replace(/\\n-+$/, "").replace(/\n-+$/, "");
    if (lastLine.trim() === "") {
      filteredContent.pop();
    } else {
      filteredContent[filteredContent.length - 1] = lastLine;
    }
  }
  
  // 提取 title：第一项去除 "第XXX章" 后的内容
//   if (filteredContent.length > 0) {
//     const firstLine = filteredContent[0];
//     const match = firstLine.match(/第[零〇一二三四五六七八九十百千万0-9]+章\s*(.*)/);
//     if (match) {
//       processed.title = match[1].trim();  // "作别"
//       // 移除第一行的章节标题部分，保留可能的后缀内容
//       filteredContent[0] = firstLine.replace(/第[零〇一二三四五六七八九十百千万0-9]+章\s*/, "").trim();
//       if (filteredContent[0] === "") {
//         filteredContent.shift();  // 如果第一行只剩空，删除
//       }
//     }
//   }

    if (filteredContent.length > 0) {
    const firstLine = filteredContent[0];
    const match = firstLine.match(/第[零〇一二两三四五六七八九十百千万0-9]+章\s*(.*)/);
    if (match) {
      processed.title = match[1].trim();  // 提取 "作别"
      filteredContent.shift();  // 删除第一项（章节标题行）
    }
  }
  
  processed.content = filteredContent;
  
  // 重新计算字数（可选）
  const textContent = filteredContent.join("\n");
  processed.wordCount = textContent.length;
  processed.readTime = Math.ceil(textContent.length / 400) + "分钟";
  
  return processed;
}