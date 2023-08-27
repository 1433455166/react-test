import { Menu } from "antd";
import { StepForwardOutlined, FilterOutlined, RollbackOutlined } from "@ant-design/icons";
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
];

const NavLeft = ({ current, setCurrent }) => {
  const onClick = (e) => setCurrent(e.key);
  return (
    <Menu
      onClick={onClick}
      style={{ width: 256 }}
      selectedKeys={[current]}
      items={items}
      mode="inline"
    />
  );
};

export default NavLeft;
