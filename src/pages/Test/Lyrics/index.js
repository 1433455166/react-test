import React, { useState } from 'react';
import { Input, Button, Card, message } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import './index.css';
import { getLyrics, parseLyrics } from 'lyrics-lib';
import NavLeft from "../NavLeft";

const GetLyrics = () => {
  const [title, setTitle] = useState('稻香');
  const [artist, setArtist] = useState('周杰伦');
  const [lyrics, setLyrics] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

// 获取歌词
//   const getLyricsFn = async () => {
//     // 2. 使用 async/await 获取歌词
//     //    注意：需要在支持顶级 await 的环境或 async 函数中运行
//     setLoading(true);
//     const lyrics = await getLyrics({
//         title,    // 歌曲名（必填）
//         artist      // 艺术家名（强烈建议填写，可以提高匹配准确度）
//     });
//     setLoading(false);

//     // 3. 打印结果
//     if (lyrics) {
//         setLyrics(lyrics);
//         console.log('获取到的歌词：\n', lyrics);
//         message.success('歌词获取成功');
//     } else {
//         console.log('没有找到相关歌词。');
//         message.warning('未找到匹配的歌词，显示提示信息');
//     }
//   }


    const getLyricsFn2 = async () => {
        setLoading(true);
        try {
            const rawLyrics = await getLyrics({ title, artist });

            if (rawLyrics) {
                // 解析歌词，分离出有时间轴和没有时间轴的部分
                const { synced, unsynced } = parseLyrics(rawLyrics);

                if (synced) {
                    // synced 是一个数组，每一项包含歌词文本和开始时间（毫秒）
                    console.log('逐句歌词（带时间戳）：');
                    synced.forEach(line => {
                        console.log(`[${line.startTime}ms] ${line.text}`);
                    });
                    const data = synced.map(line => {
                        return `[${line.startTime}ms] ${line.text}`;
                    }).join('\n');
                    setLyrics(data);
                } else {
                    // 如果没有时间轴，就使用纯文本部分
                    const data = unsynced.map(l => l.text).join('\n');
                    setLyrics(data);
                    console.log('纯文本歌词：', data);
                }
            }
        } catch (err) {
            console.error('获取歌词失败：', err);
            message.error('获取歌词失败，请检查输入信息');
        } finally {
            setLoading(false);
        }
        
    }

  return (
    <div className="get-lyrics-wrap">
        <NavLeft />
        <div className="get-lyrics">
        <h2>歌词获取</h2>
        <Card className="lyrics-form">
            <div className="form-item">
            <label>歌曲名 <span className="required">*</span></label>
            <Input
                placeholder="请输入歌曲名，如：稻香"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            </div>
            <div className="form-item">
            <label>艺术家名 <span className="required">*</span></label>
            <Input
                placeholder="请输入艺术家名，如：周杰伦"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
            />
            </div>
            <div className="primary-button-wrap">
                <Button
                type="primary"
                onClick={getLyricsFn2}
                loading={loading}
                disabled={!title.trim() || !artist.trim()}
                >
                获取歌词
                </Button>
                {loading && (
                  <div className="loading-text">
                    {'加载需要10s左右的时间'.split('').map((char, index) => (
                      <span key={index} className="bounce-char" style={{ animationDelay: `${index * 0.1}s` }}>
                        {char}
                      </span>
                    ))}
                  </div>
                )}
            </div>
        </Card>

        {lyrics && (
            <Card 
              className="lyrics-content" 
              title="歌词内容"
              extra={
                <Button
                  icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(lyrics);
                      setCopied(true);
                      message.success('复制成功！');
                      setTimeout(() => setCopied(false), 2000);
                    } catch (err) {
                      console.error('复制失败:', err);
                      message.error('复制失败，请手动复制');
                    }
                  }}
                  type={copied ? 'success' : 'default'}
                >
                  {copied ? '已复制' : '复制歌词'}
                </Button>
              }>
            <pre className="lyrics-text">{lyrics}</pre>
            </Card>
        )}
        </div>
    </div>
  );
};

export default GetLyrics;