import { Select, Space } from "antd";
import { Content } from "antd/es/layout/layout";
import { FILTER_OPTION } from "../../constants";
import React, { useRef, useEffect, useState } from "react";
import "./index.css";

function App() {
  const [value, setValue] = useState(0);
  const inputRef = useRef();
  useEffect(() => {
    const timer = setInterval(() => {
      const val = inputRef?.current?.value;
      inputRef.current.value = +val + 1;
      setValue(value + 1);
      // console.log({ inputRefValuååe: inputRef.current.value });
    }, 1000);
    if (value > 10) {
      return () => clearInterval(timer);
    }
    // if (+inputRef?.current?.value > 10) {
    //   return () => clearInterval(timer);
    // }
    console.log({ inputRefValue2: inputRef.current.value });
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="App">
      <header>这是测试页面</header>
      <Content>
        <h1>filter</h1>
        <Space>
          <Select
            placeholder="左值"
            options={FILTER_OPTION}
            style={{ width: 120 }}
          />
          <Select placeholder="操作符" style={{ width: 120 }} />
          <Select placeholder="值类型" style={{ width: 120 }} />
          <Select
            placeholder="右值"
            options={FILTER_OPTION}
            style={{ width: 120 }}
          />
        </Space>
        <h1>滚动</h1>
        <div className="g-wrap">
          <div className="g-content" />
        </div>
        <h1>定时器中获取dom</h1>
        <div className="g-wrap">
          <input ref={inputRef} />
        </div>
      </Content>
    </div>
  );
}

export default App;
