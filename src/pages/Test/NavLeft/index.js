import { Menu } from "antd";
import { StepForwardOutlined, FilterOutlined, RollbackOutlined, BookOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";

const items = [
  {
    label: <a href="#/test/filter">过滤条件</a>,
    key: "filter",
    icon: <FilterOutlined />,
  },
  {
    label: <a href="#/test/roll">滚动</a>,
    key: "roll",
    icon: <RollbackOutlined />,
  },
  {
    label: <a href="#/test/intervalGetDom">定时器get dom</a>,
    key: "intervalGetDom",
    icon: <StepForwardOutlined />,
  },
  {
    label: <a href="#/test/UniqueValueTest">唯一值测试</a>,
    key: "UniqueValueTest",
    icon: <StepForwardOutlined />,
  },
  {
    label: <a href="#/test/extractText">提取文字</a>,
    key: "extractText",
    icon: <StepForwardOutlined />,
  },
  {
    label: <a href="#/test/novelDataProcessing">小说数据处理</a>,
    key: "novelDataProcessing",
    icon: <BookOutlined />,
  },
  {
    label: <a href="#/test/getLyrics">歌词获取</a>,
    key: "getLyrics",
    icon: <BookOutlined />,
  },
];

const NavLeft = () => {
  const getCurrentKey = () => {
    const hash = window.location.hash;
    const match = hash.match(/#\/test\/(\w+)/);
    return match ? [match[1]] : ["novelDataProcessing"];
  };

  const [selectedKeys, setSelectedKeys] = useState(getCurrentKey());

  useEffect(() => {
    const handleHashChange = () => {
      setSelectedKeys(getCurrentKey());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <Menu
      style={{ width: 256 }}
      items={items}
      mode="inline"
      selectedKeys={selectedKeys}
    />
  );
};

export default NavLeft;