import { Menu } from "antd";
import React, { useState } from "react";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "./index.css";

function Game() {
  const [current, setCurrent] = useState("gobang");

  const items = [
    {
      label: <a href="#/game/plane">飞机大战</a>,
      key: "plane",
      icon: <MailOutlined />,
    },
    {
      label: <a href="#/game/bouncyBall">弹弹球</a>,
      key: "bouncyBall",
      icon: <AppstoreOutlined />,
      // disabled: true, // 是否可选
    },
    {
      label: <a href="#/game/gobang">五子棋</a>,
      key: "gobang",
      icon: <AppstoreOutlined />,
      // disabled: true, // 是否可选
    },
    {
      label: "其他-代办",
      key: "SubMenu",
      icon: <SettingOutlined />,
      children: [
        {
          type: "group",
          label: "Item 1",
          children: [
            {
              label: "Option 1",
              key: "setting:1",
            },
            {
              label: "Option 2",
              key: "setting:2",
            },
          ],
        },
        {
          type: "group",
          label: "Item 2",
          children: [
            {
              label: "Option 3",
              key: "setting:3",
            },
            {
              label: "Option 4",
              key: "setting:4",
            },
          ],
        },
      ],
    },
  ];

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
}

export default Game;
