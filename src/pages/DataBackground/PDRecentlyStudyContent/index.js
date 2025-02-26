import React from "react";
import dayjs from "dayjs";
import "../index.css";
import LeftMenu from "../LeftMenu";
import DataManagement from "../../../components/DataManagement";
import { database, pdCollection } from "../../../common/const";

// 最近在学 content
const PDRecentlyStudyContent = () => {
    const tableColumnList = [
        {
            title: "标题",
            dataIndex: "title",
            type: 'input'
        },
        {
            title: "图片",
            dataIndex: "url",
            render: (url) => <img src={url} alt='' style={{ width: 100, height: 120 }} />,
            type: 'upload'
        },
        {
            title: "内容",
            dataIndex: "content",
            type: 'input'
        },
        {
            title: "更新时间",
            dataIndex: "rt",
            type: 'time',
            render: (time) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
            width: 180,
        },
        {
            title: "播放量",
            dataIndex: "airplay",
            type: 'inputNumber',
            width: 81,
        },
    ]
    return (
        <div className="data-background">
            <LeftMenu currentValue={'pDRecentlyStudyContent'} />
            <DataManagement
                database={database.pdDatabase}
                collection={pdCollection.contentlists}
                title='最近在学 content'
                tableColumnList={tableColumnList}
                searchType={['title', 'content', 'rt', 'airplay']}
                showSearch={false}
            />
        </div>
    );
};

export default PDRecentlyStudyContent;
