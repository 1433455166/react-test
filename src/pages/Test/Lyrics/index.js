import React from 'react';
import { Card, message } from 'antd';
import './index.css';
import NavLeft from "../NavLeft";

const GetLyrics = () => {

  return (
    <div className="get-lyrics-wrap">
        <NavLeft />
        <div className="get-lyrics">
        <h2>歌词获取</h2>
        <Card className="tips-card" bordered={false}>
          <p>提示：直接让 AI 获取歌词数据：</p>
          <p className="prompt-text">获取 XXX 这首歌带时间的歌词</p>
          <p>推荐 AI 工具：<a href="https://chat.deepseek.com/" target="_blank" rel="noopener noreferrer">DeepSeek</a></p>
        </Card>
        </div>
    </div>
  );
};

export default GetLyrics;