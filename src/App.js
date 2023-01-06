import React, { useState } from "react";
import { HashRouter, Route, Redirect } from "react-router-dom";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import "./App.css";
import Other from "./components/Other";
import TodoList from "./components/TodoList";
import TodoListTwo from "./components/TodoListTwo";

const items = [
  {
    label: <a href="#/todoList">TodoList</a>,
    key: "todoList",
    icon: <MailOutlined />,
  },
  {
    label: <a href="#/todoListTwo">TodoListTwo</a>,
    key: "todoListTwo",
    icon: <AppstoreOutlined />,
    // disabled: true, // 是否可选
  },
  {
    label: "Navigation Three - Submenu",
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
  {
    label: <a href="#/other">Other</a>,
    key: "alipay",
  },
];

function App() {
  const [current, setCurrent] = useState("todoListTwo");
  const onClick = (e) => {
    // console.log("click ", e);
    setCurrent(e.key);
  };

  return (
    <div className="App">
      <div>
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          items={items}
        />
      </div>
      <HashRouter>
        {/* 跳转TodoList组件 */}
        <Route path="/todoList" exact component={TodoList} />
        <Route path="/todoListTwo" exact component={TodoListTwo} />
        <Route path="/other" exact component={Other} />
        <Redirect from="/" to="/todoListTwo" />
      </HashRouter>
    </div>
  );
}

export default App;
