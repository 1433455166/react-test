import React from "react";
import "../index.css";
import LeftMenu from "../LeftMenu";
import DataManagement from "../../../components/DataManagement";
import { database, pdCollection } from "../../../common/const";
// 最近在学
const PDRecentlyStudy = () => {
    const tableColumnList = [{
        title: "标题",
        dataIndex: "title",
        type: 'input'
    }, {
        title: "图片",
        dataIndex: "url",
        render: (url) => <img src={url} alt='' style={{ width: 80, height: 100 }} />,
        type: 'upload'
    }, {
        title: "观看位置",
        dataIndex: "havelearned",
        type: 'input'
    }]
  return (
    <div className="data-background">
        <LeftMenu />
        <DataManagement
            database={database.pdDatabase}
            collection={pdCollection.recentlists}
            title='最近在学'
            tableColumnList={tableColumnList}
            searchType={['title', 'havelearned']}
            showSearch={true}
        />
    </div>
  );
};

export default PDRecentlyStudy;
