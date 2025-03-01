import { database, pdCollection } from "../../common/const";
import React from "react";
import dayjs from "dayjs";
import {
    AppstoreOutlined,
    MailOutlined,
    SettingOutlined,
  } from "@ant-design/icons";

// 数据后台页面数据
export const pageDataSource = [
    {
        database: database.pdDatabase,
        collection: pdCollection.lbts,     
        title: 'pdds轮播图',
        tableColumnList: [{
            title: "轮播图",
            dataIndex: "imgUrl",
            render: (url) => <img src={url} alt='' style={{ width: 280, height: 100 }} />,
            type: 'upload'
        }],
        showSearch: false,
        router: 'pDCarouselImage',
        icon: <MailOutlined />,
    },
    {
        database: database.pdDatabase,
        collection: pdCollection.recentlists,
        title: '最近在学',
        tableColumnList: [{
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
        }],
        searchType: ['title', 'havelearned'],
        showSearch: true,
        router: 'pDRecentlyStudy',
        icon: <AppstoreOutlined />,
    },
    {
        database: database.pdDatabase,
        collection: pdCollection.contentlists,
        title: '最近在学 content',
        tableColumnList: [
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
        ],
        searchType: ['title', 'content', 'rt', 'airplay'],
        showSearch: false,
        router: 'pDRecentlyStudyContent',
        icon: <SettingOutlined />,
    },
    {
        router: 'PDEditRecommend',
        title: '编辑推荐',
        collection: pdCollection.indexbjtjs,
        tableColumnList: [
            {
                title: "编号",
                dataIndex: "pdsid",
                type: 'input',
            },
            {
                title: "标题",
                dataIndex: "title",
                type: 'input'
            },
            {
                title: "图片",
                dataIndex: "imgUrl",
                render: (url) => <img src={url} alt='' style={{ width: 100, height: 120 }} />,
                type: 'upload'
            },
            {
                title: "描述",
                dataIndex: "describe",
                type: 'input'
            },
            {
                title: "播放量",
                dataIndex: "view",
                type: 'input',
            },
        ],
        // searchType: ['title', 'content', 'rt', 'airplay'],
        showSearch: false,
        icon: <SettingOutlined />,
        database: database.pdDatabase,
    },
]