/* eslint-disable react/prop-types */
import { Menu } from "antd";
import React from "react";
import { pageDataSource } from "../dataSource"

function LeftMenu(props) {
    const { currentValue } = props;

    const items = pageDataSource.filter((pageData) => pageData?.router).map((page) => {
        return {
            label: <a href={`#/dataBackground/${page.router}`}>{page?.title}</a>,
            key: page.router,
            icon: page.icon,
        }
    });

    return (
        <Menu
            style={{ width: 256 }}
            selectedKeys={[currentValue || "pDCarouselImage"]}
            items={items}
            mode="inline"
        />
    );
}

export default LeftMenu;
