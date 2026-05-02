import React, { useEffect, useState } from 'react';
import { TextAnalyzer, splitChapters, processChapterData } from '../../../utils/TextAnalyzer';
import threeBoby1 from './data/threeBoby1.json';
import './index.css';

const NovelDataProcessing = () => {
  const [novelContent, setNovelContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 从 public 目录下的 TXT 文件读取内容
  useEffect(() => {
    const fetchNovelContent = async () => {
      try {
        const response = await fetch('/data/4.txt');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        setNovelContent(text);
      } catch (err) {
        console.error('Failed to load novel content:', err);
        setError(err.message);
        // 如果 TXT 文件加载失败，使用默认字符串作为后备
        setNovelContent(`123`);
      } finally {
        setLoading(false);
      }
    };

    fetchNovelContent();
  }, []);


const chapters = splitChapters(novelContent);
// console.log("chapters", chapters);


  // 处理文本分割逻辑
//   const list = novelContent.split("next：");
  const list = chapters;
  const arr = (list || []).map((item, index) => {

    const wordCount = new TextAnalyzer(item).getChineseCharacterCount();

    return {
        // 1 85 179 239
      "id": 239 + index,
    //   "id": index,
      "chapterId": 1 + index,
      "title": "",
    //   "content": item.split("\n\n"),
      "content": item.split("\\n\\n"),
    //   "wordCount": 0,
      wordCount,
    //   "readTime": "0分钟"
      "readTime": `${Math.ceil(wordCount / 400)}分钟`
    };
  });

  const analyzer = new TextAnalyzer(threeBoby1.chapters[9].content.join(''));

  // 在开发环境中输出日志
  useEffect(() => {
    if (!loading) {
    //   console.log('list:', list);
      console.log('arr:', arr);
      console.log('processChapterData:', arr.map(processChapterData));
    //   console.log('analyzer.chineseOnly:', analyzer.chineseOnly);
    }
  }, [loading, list, arr, analyzer]);

  if (loading) {
    return <div className="novel-data-processing">加载中...</div>;
  }

  return (
    <div className="novel-data-processing">
      <h2>小说数据处理测试</h2>
      {error && (
        <div className="error-message">
          加载小说内容失败: {error}
        </div>
      )}
      <div className="test-content">
        <h3>原始字符串分割结果:</h3>
        {/* <pre>{JSON.stringify(list, null, 2)}</pre>  */}
        
        <h3>处理后的数组:</h3>
        {/* <pre>{JSON.stringify(arr, null, 2)}</pre> */}
        
        <h3>第九章中文字符提取:</h3>
        <div className="chinese-text">
          {analyzer.chineseOnly}
        </div>
        
        <h3>统计信息:</h3>
        <div className="stats">
          <p>总字符数: {analyzer.getCharacterCount()}</p>
          <p>中文字符数: {analyzer.getChineseCharacterCount()}</p>
          <p>章节段落数: {list.length}</p>
        </div>
      </div>
    </div>
  );
};

export default NovelDataProcessing;