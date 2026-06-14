import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { MailOutlined, AppstoreOutlined, UpSquareOutlined, VerticalLeftOutlined } from "@ant-design/icons";
import TodoList from "../TodoList";
import TodoListTwo from "../TodoListTwo";
import Other from "../Other";
import Table from "../Table";
import "./index.css";

const menuItems = [
    { key: "todoList", label: "列表", icon: <MailOutlined /> },
    { key: "todoListTwo", label: "列表2.0", icon: <AppstoreOutlined /> },
    { key: "other", label: "展开收起", icon: <UpSquareOutlined /> },
    { key: "table", label: "数据/表格", icon: <VerticalLeftOutlined /> },
];

const pageComponents = {
    todoList: TodoList,
    todoListTwo: TodoListTwo,
    other: Other,
    table: Table,
};

function DataComponents() {
    const [current, setCurrent] = useState("todoList");

    useEffect(() => {
        const hash = window.location.hash;
        const match = hash.match(/#\/dataComponents\/(\w+)/);
        if (match && pageComponents[match[1]]) {
            setCurrent(match[1]);
        }
    }, []);

    const handleMenuClick = (e) => {
        setCurrent(e.key);
        window.location.hash = `/dataComponents/${e.key}`;
    };

    const CurrentComponent = pageComponents[current] || TodoList;

    return (
        <div className="data-components">
            <div className="data-components-left">
                <Menu
                    mode="inline"
                    selectedKeys={[current]}
                    onClick={handleMenuClick}
                    items={menuItems}
                />
            </div>
            <div className="data-components-right">
                <CurrentComponent />
            </div>
        </div>
    );
}

export default DataComponents;