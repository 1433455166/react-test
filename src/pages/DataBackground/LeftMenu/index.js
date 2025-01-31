/* eslint-disable react/prop-types */
import { Menu } from "antd";
import React, { useState } from "react";
import {
  AppstoreOutlined,
  MailOutlined,
//   SettingOutlined,
} from "@ant-design/icons";

function LeftMenu() {
    const [current, setCurrent] = useState("pDCarouselImage");

    const items = [
        {
            label: <a href="#/dataBackground/pDCarouselImage">轮播图</a>,
            key: "pDCarouselImage",
            icon: <MailOutlined />,
        },
        {
          label: <a href="#/dataBackground/pDRecentlyStudy">最近在学</a>,
          key: "pDRecentlyStudy",
          icon: <AppstoreOutlined />,
        },
        // {
        //   label: <a href="#/game/gobang">五子棋</a>,
        //   key: "gobang",
        //   icon: <AppstoreOutlined />,
        //   // disabled: true, // 是否可选
        // }
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

export default LeftMenu;
