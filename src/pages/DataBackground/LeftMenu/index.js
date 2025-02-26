/* eslint-disable react/prop-types */
import { Menu } from "antd";
import React, { useState } from "react";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";

function LeftMenu(props) {
    const { currentValue } = props;
    const [current, setCurrent] = useState(currentValue || "pDCarouselImage");

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
        {
            label: <a href="#/dataBackground/pDRecentlyStudyContent">最近在学 content</a>,
            key: "pDRecentlyStudyContent",
            icon: <SettingOutlined />,
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

export default LeftMenu;
