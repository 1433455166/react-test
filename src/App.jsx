import React, { useState, useEffect } from "react";
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
import DataComponents from "./pages/DataComponents/index.js";
import AITest from "./pages/AITest/index.js";
import { pageDataSource } from "./pages/DataBackground/dataSource.js";
import Filter from "./pages/Test/Filter/index.js";
import Roll from "./pages/Test/Roll/index.js";
import UniqueValueTest from "./pages/Test/UniqueValueTest/index.js";
import NovelDataProcessing from "./pages/Test/NovelDataProcessing/index.js";
import Lyrics from "./pages/Test/Lyrics/index.js";
import User from "./components/User/index.js";
import { router } from "./common/enum.ts";
import Minesweeper from "./pages/Game/Minesweeper/index.js";
// import GameIcon from "../public/svg/game.svg";
// import moment from "moment";
// import Error from "./components/404";

const items = [
    {
        label: <a href={`#/${router.dataComponents}`}>数据组件</a>,
        key: router.dataComponents,
        icon: <AppstoreOutlined />,
        components: DataComponents,
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
        label: <a href={`#/${router.dataBackground}`}>数据后台</a>,
        key: router.dataBackground,
        icon: <VerticalLeftOutlined />,
        components: DataBackground
    },
    {
        label: <a href={`#/${router.aiTest}`}>AI测试</a>,
        key: router.aiTest,
        icon: <VerticalLeftOutlined />,
        components: AITest
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
const defaultRouter = router.test;
const defaultRouterComponents = NovelDataProcessing;

function App() {
    const getCurrentFromHash = () => {
        const hash = window.location.hash;
        if (!hash || hash === '#/') return defaultRouter;
        const path = hash.replace('#/', '');
        const firstPart = path.split('/')[0];
        if (Object.values(router).includes(firstPart)) {
            return firstPart;
        }
        return defaultRouter;
    };

    const [current, setCurrent] = useState(getCurrentFromHash);

    const onClick = (e) => setCurrent(e.key);

    useEffect(() => {
        const handleHashChange = () => {
            setCurrent(getCurrentFromHash());
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

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
                        style={{ width: "100vw" }}
                    />
                    {/* 登录接口有问题，后面处理了再开放 */}
                    {/* <User /> */}
                </div>
                <div className="app-content">
                    <HashRouter>
                        <Route path={`/${router.dataComponents}`} exact component={DataComponents} />
                        <Route path={`/${router.dataComponents}/:subPage`} exact component={DataComponents} />
                        <Route path="/" exact component={defaultRouterComponents} /> {/* 默认路由 */}
                        <Route path={`/${router.test}`} exact component={items.find((item) => item.key === router.test).components} />
                        <Route path={`/${router.test}/filter`} exact component={Filter} />
                        <Route path={`/${router.test}/intervalGetDom`} exact component={IntervalGetDom} />
                        <Route path={`/${router.test}/extractText`} exact component={ExtractText} />
                        <Route path={`/${router.test}/roll`} exact component={Roll} />
                        <Route path={`/${router.test}/UniqueValueTest`} exact component={UniqueValueTest} />
                        <Route path={`/${router.test}/novelDataProcessing`} exact component={NovelDataProcessing} />
                        <Route path={`/${router.test}/getLyrics`} exact component={Lyrics} />
                        <Route path={`/${router.game}`} exact component={Game} />
                        <Route path={`/${router.game}/plane`} exact component={Game} />
                        <Route path={`/${router.game}/bouncyBall`} exact component={Game} />
                        <Route path={`/${router.game}/gobang`} exact component={Game} />
                        <Route path={`/${router.game}/minesweeper`} exact component={Game} />
                        <Route path={`/${router.dataBackground}`} exact component={DataBackground} />
                        {pageDataSource.filter((pageData) => pageData?.router).map((page) => {
                            return <Route path={`/${router.dataBackground}/${page.router}`} exact component={DataBackground} key={page.router} />
                        })}
                        <Route path={`/${router.aiTest}`} exact component={AITest} />
                        {/* 404 页面 */}
                        {/* <Route component={Error} /> */}
                        {/* <Redirect from="/" to={`/${defaultRouter}/minesweeper`} /> */}
                        <Route
                            path="/"
                            exact
                            render={() => {
                                const hash = window.location.hash;
                                if (!hash || hash === '#/' || hash === '#') {
                                    return <Redirect to={`/${defaultRouter}/novelDataProcessing`} />;
                                }
                                return null;
                            }}
                        />
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