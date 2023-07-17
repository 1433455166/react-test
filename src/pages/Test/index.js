import { Select, Space } from "antd";
import { Content } from "antd/es/layout/layout";
import React from "react";
import "./index.css";

function App() {
  return (
    <div className="App">
      <header>这是测试页面</header>
      <Content>
        <h1>filter</h1>
        <Space>
          <Select placeholder="左值" style={{ width: 120 }} />
          <Select placeholder="操作符" style={{ width: 120 }} />
          <Select placeholder="值类型" style={{ width: 120 }} />
          <Select placeholder="右值" style={{ width: 120 }} />
        </Space>
        <h1>滚动</h1>
        <div className="g-wrap">
          <div className="g-content" />
        </div>
      </Content>
    </div>
  );
}

export default App;
