import { Menu } from "antd";
import { StepForwardOutlined, FilterOutlined, RollbackOutlined, BookOutlined } from "@ant-design/icons";
import React from "react";

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
  return (
    <Menu
      style={{ width: 256 }}
      items={items}
      mode="inline"
    />
  );
};

export default NavLeft;