import { Menu } from "antd";
import React, { useState, useEffect } from "react";
import Plane from "./Plane";
import BouncyBall from "./BouncyBall";
import Gobang from "./Gobang";
import Minesweeper from "./Minesweeper";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "./index.css";

function Game() {
  const [current, setCurrent] = useState("plane");

  // 从URL获取当前游戏
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('/game/minesweeper')) {
      setCurrent('minesweeper');
    } else if (hash.includes('/game/gobang')) {
      setCurrent('gobang');
    } else if (hash.includes('/game/bouncyBall')) {
      setCurrent('bouncyBall');
    } else if (hash.includes('/game/plane')) {
      setCurrent('plane');
    }
  }, []);

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
      label: <a href="#/game/minesweeper">扫雷</a>,
      key: "minesweeper",
      icon: <AppstoreOutlined />,
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
  const renderDom = (value) => {
    console.log({ value });
    switch (value) {
      case "plane":
        return <Plane />;
      case "bouncyBall":
        return <BouncyBall />;
        case "gobang":
          return <Gobang />;
      case "minesweeper":
        return <Minesweeper />;
      default:
        <div />;
    }
  };

  const onClick = (e) => setCurrent(e.key);
  return (
    <div className="game">
      <Menu
        onClick={onClick}
        style={{ width: 256 }}
        selectedKeys={[current]}
        items={items}
        mode="inline"
      />
      {renderDom(current)}
    </div>
  );
}

export default Game;