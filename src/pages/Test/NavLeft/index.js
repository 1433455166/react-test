import { Menu } from "antd";
import { MailOutlined } from "@ant-design/icons";
import React from "react";

const items = [
  {
    label: <a href="#/test/filter">过滤条件</a>,
    key: "filter",
    icon: <MailOutlined />,
  },
  {
    label: <a href="#/test/other">其他</a>,
    key: "other",
    icon: <MailOutlined />,
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
