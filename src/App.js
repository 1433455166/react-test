import React, { useState } from "react";
import { HashRouter, Route, Redirect } from "react-router-dom";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  UpSquareOutlined,
  VerticalLeftOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import "./App.css";
import Other from "./pages/Other";
import TodoList from "./pages/TodoList";
import TodoListTwo from "./pages/TodoListTwo";
import Test from "./pages/Test";
import Error from "./components/404";

const items = [
  {
    label: <a href="#/todoList">列表</a>,
    key: "todoList",
    icon: <MailOutlined />,
  },
  {
    label: <a href="#/todoListTwo">列表2.0</a>,
    key: "todoListTwo",
    icon: <AppstoreOutlined />,
    // disabled: true, // 是否可选
  },
  {
    label: <a href="#/other">展开收起</a>,
    key: "alipay",
    icon: <UpSquareOutlined />,
  },
  {
    label: <a href="#/test">组件测试</a>,
    key: "test",
    icon: <VerticalLeftOutlined />,
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

function App() {
  const [current, setCurrent] = useState("todoListTwo");
  const onClick = (e) => setCurrent(e.key);

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
        <Route path="/test" exact component={Test} />
        <Route path="/other" exact component={Other} />
        {/* 404 页面 */}
        {/* <Route component={Error} /> */}
        <Redirect from="/" to="/todoListTwo" />
      </HashRouter>
    </div>
  );
}

export default App;
