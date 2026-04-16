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
import { Provider } from 'react-redux';  
import store from './store.js';  
// import { amountConversion } from "lz-js-tools";
import "./App.css";
import IntervalGetDom from "./pages/Test/IntervalGetDom/index.js";
import ExtractText from "./pages/Test/ExtractText/index.js";
import Other from "./pages/Other/index.js";
import TodoList from "./pages/TodoList/index.js";
import TodoListTwo from "./pages/TodoListTwo/index.js";
import Game from "./pages/Game/index.js";
import Gobang from "./pages/Game/Gobang/index.js";
import Table from "./pages/Table/index.js";
import DataBackground from "./pages/DataBackground/index.js";
import { pageDataSource } from "./pages/DataBackground/dataSource.js";
import Filter from "./pages/Test/Filter/index.js";
import Roll from "./pages/Test/Roll/index.js";
import UniqueValueTest from "./pages/Test/UniqueValueTest/index.js";
import User from "./components/User/index.js";
import { router } from "./common/enum.ts";
import Minesweeper from "./pages/Game/Minesweeper/index.js";
// import GameIcon from "../public/svg/game.svg";
// import moment from "moment";
// import Error from "./components/404";

const items = [
    {
        label: <a href={`#/${router.todoList}`}>列表</a>,
        key: router.todoList,
        icon: <MailOutlined />,
        components: TodoList,
    },
    {
        label: <a href={`#/${router.todoListTwo}`}>列表2.0</a>,
        key: router.todoListTwo,
        icon: <AppstoreOutlined />,
        components: TodoListTwo,
        // disabled: true, // 是否可选
    },
    {
        label: <a href={`#/${router.other}`}>展开收起</a>,
        key: router.other,
        icon: <UpSquareOutlined />,
        components: Other,
    },
    {
        label: <a href={`#/${router.test}`}>组件测试</a>,
        key: router.test,
        icon: <VerticalLeftOutlined />,
        components: UniqueValueTest
    },
    {
        label: <a href={`#/${router.game}`}>游戏</a>,
        key: router.game,
        icon: <img src="/svg/game.svg" alt="游戏" style={{ width: '1em', height: '1em' }} />,
        components: Gobang
    },
    {
        label: <a href={`#/${router.table}`}>数据/表格</a>,
        key: router.table,
        icon: <VerticalLeftOutlined />,
        components: Table
    },
    {
        label: <a href={`#/${router.dataBackground}`}>数据后台</a>,
        key: router.dataBackground,
        icon: <VerticalLeftOutlined />,
        components: DataBackground
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

// 设置全局 locale 为中文
// moment.locale('zh-cn');

// 默认路由
const defaultRouter = router.game
const defaultRouterComponents = Game

function App() {
    const [current, setCurrent] = useState(defaultRouter); // 默认页面
    const onClick = (e) => setCurrent(e.key);
    // js工具包测试
    //   console.log(/js工具包测试/, { money: amountConversion(1000000.0) });
    return (
        <Provider store={store}>
            <div className="app">
                <div className="app-header">
                    <Menu
                        onClick={onClick}
                        selectedKeys={[current]}
                        mode="horizontal"
                        items={items}
                    />
                    <User />
                </div>
                <div className="app-content">
                    <HashRouter>
                        <Route path={`/${router.todoList}`} exact component={TodoList} />
                        <Route path={`/${router.todoListTwo}`} exact component={TodoListTwo} />
                        <Route path="/" exact component={defaultRouterComponents} /> {/* 默认路由 */}
                        <Route path={`/${router.test}`} exact component={items.find((item) => item.key === router.test).components} />
                        <Route path={`/${router.test}/filter`} exact component={Filter} />
                        <Route path={`/${router.test}/intervalGetDom`} exact component={IntervalGetDom} />
                        <Route path={`/${router.test}/extractText`} exact component={ExtractText} />
                        <Route path={`/${router.test}/roll`} exact component={Roll} />
                        <Route path={`/${router.test}/UniqueValueTest`} exact component={UniqueValueTest} />
                        <Route path={`/${router.game}`} exact component={Game} />
                        <Route path={`/${router.game}/plane`} exact component={Game} />
                        <Route path={`/${router.game}/bouncyBall`} exact component={Game} />
                        <Route path={`/${router.game}/gobang`} exact component={Game} />
                        <Route path={`/${router.game}/minesweeper`} exact component={Game} />
                        <Route path={`/${router.table}`} exact component={Table} />
                        <Route path={`/${router.dataBackground}`} exact component={DataBackground} />
                        {pageDataSource.filter((pageData) => pageData?.router).map((page) => {
                            return <Route path={`/${router.dataBackground}/${page.router}`} exact component={DataBackground} key={page.router} />
                        })}
                        <Route path={`/${router.other}`} exact component={Other} />
                        {/* 404 页面 */}
                        {/* <Route component={Error} /> */}
                        <Redirect from="/" to={`/${defaultRouter}/minesweeper`} />
                        {/* <Redirect from="/game" to="/game/gobang" /> */}
                    </HashRouter>
                </div>
                <div className="app-footer">
                    1433455166@qq.com版权所有
                    {/* <ScrollTips wrapStyle={{ maxWidth: 150 }}>あ绝对是把搅拌好あ absolutely把搅拌好あ absolutely把搅拌好あ absolutely把搅拌好あ absolutely把搅拌好あ absolutely把搅拌好あ absolutely把搅拌好あ absolutely把搅拌好あ absolutely把搅拌好あ absolutely把搅拌好あ absolutely把搅拌好あ absolutely把搅拌好あ absolutely把搅拌好</ScrollTips> */}
                </div>
            </div>
        </Provider>
    );
}

export default App;
