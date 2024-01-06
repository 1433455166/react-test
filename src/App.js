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
import { amountConversion } from "lz-js-tools";
import "./App.css";
import IntervalGetDom from "./pages/Test/IntervalGetDom";
import Other from "./pages/Other";
import TodoList from "./pages/TodoList";
import TodoListTwo from "./pages/TodoListTwo";
import Game from "./pages/Game";
import Table from "./pages/Table";
import Filter from "./pages/Test/Filter";
import Roll from "./pages/Test/Roll";
import UniqueValueTest from "./pages/Test/UniqueValueTest";
// import Error from "./components/404";

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
    label: <a href="#/game">游戏</a>,
    key: "game",
    icon: <VerticalLeftOutlined />,
  },
  {
    label: <a href="#/table">数据/表格</a>,
    key: "table",
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
  const [current, setCurrent] = useState("test");
  const onClick = (e) => setCurrent(e.key);
  // js工具包测试
  console.log(/js工具包测试/, { money: amountConversion(1000000.0) });
  return (
    <div className="app">
      <div>
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          items={items}
        />
      </div>
      <div className="app-content">
        <HashRouter>
          {/* 跳转TodoList组件 */}
          <Route path="/todoList" exact component={TodoList} />
          <Route path="/todoListTwo" exact component={TodoListTwo} />
          <Route path="/" exact component={UniqueValueTest} /> {/* 默认路由 */}
          <Route path="/test" exact component={UniqueValueTest} />
          <Route path="/test/filter" exact component={Filter} />
          <Route path="/test/intervalGetDom" exact component={IntervalGetDom} />
          <Route path="/test/roll" exact component={Roll} />
          <Route path="/test/UniqueValueTest" exact component={UniqueValueTest} />
          <Route path="/game" exact component={Game} />
          <Route path="/game/plane" exact component={Game} />
          <Route path="/game/bouncyBall" exact component={Game} />
          <Route path="/game/gobang" exact component={Game} />
          <Route path="/table" exact component={Table} />
          <Route path="/other" exact component={Other} />
          {/* 404 页面 */}
          {/* <Route component={Error} /> */}
          <Redirect from="/" to="/test" />
          {/* <Redirect from="/test" to="/test/filter" /> */}
          {/* <Redirect from="/game" to="/game/plane" /> */}
        </HashRouter>
      </div>
      <div className="app-footer">1433455166@qq.com版权所有</div>
    </div>
  );
}

export default App;
