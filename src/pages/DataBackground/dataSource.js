import { database, pdCollection } from "../../common/const";
import React from "react";
import dayjs from "dayjs";
import {
    AppstoreOutlined,
    MailOutlined,
    SettingOutlined,
    PictureOutlined,
    ShopOutlined,
    ShoppingOutlined,
    FireOutlined,
    HighlightOutlined,
    BookOutlined,
  } from "@ant-design/icons";
import { Table } from "antd";

const { Column } = Table;

// 心选商城 list 枚举
const xxscsItemTableColumnList =  [
    {
        title: "观看人数",
        dataIndex: "people",
        type: 'input',
    },
    {
        title: "标题",
        dataIndex: "title",
        type: 'input'
    },
    {
        title: "图片",
        dataIndex: "img",
        render: (url) => <img src={url} alt='' style={{ width: 100, height: 120 }} />,
        type: 'upload'
    },
    {
        title: "内容",
        dataIndex: "text",
        type: 'input'
    },
    {
        title: "类型",
        dataIndex: "titlehead",
        type: 'input'
    },
    {
        title: "商品数",
        dataIndex: "goods",
        type: 'inputNumber',
    },
    {
        title: "价格",
        dataIndex: "money",
        type: 'inputNumber',
    },
]

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
        icon: <PictureOutlined />,
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
        icon: <HighlightOutlined />,
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
        icon: <HighlightOutlined />,
    },
    {
        router: 'pDEditRecommend',
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
        showSearch: false,
        icon: <FireOutlined />,
        database: database.pdDatabase,
    },
    {
        router: 'pDHotList',
        title: '热门榜单',
        collection: pdCollection.indexrmbds,
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
        showSearch: false,
        icon: <SettingOutlined />,
        database: database.pdDatabase,
    },
    {
        router: 'pDRecentBooks',
        title: '近期新书',
        collection: pdCollection.indexjqxs,
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
                title: "播放量",
                dataIndex: "view",
                type: 'input',
            },
        ],
        showSearch: false,
        icon: <BookOutlined />,
        database: database.pdDatabase,
    },
    {
        router: 'pDExclusivelyRecommendedForYou',
        title: '专属为你推荐',
        collection: pdCollection.indexzswntjs,
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
        showSearch: false,
        icon: <FireOutlined />,
        database: database.pdDatabase,
    },
    {
        router: 'pDHomeDetails',
        title: '首页详情',
        collection: pdCollection.detaildatas,
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
                title: "作者",
                dataIndex: "describe",
                type: 'input'
            },
            {
                title: "播放量",
                dataIndex: "view",
                type: 'inputNumber',
            },
        ],
        showSearch: false,
        icon: <AppstoreOutlined />,
        database: database.pdDatabase,
    },
    {
        router: 'pDOfflineActivities',
        title: '线下活动',
        collection: pdCollection.xxhds,
        tableColumnList: [
            {
                title: "标题",
                dataIndex: "title",
                type: 'input'
            },
            {
                title: "图片",
                dataIndex: "img",
                render: (url) => <img src={url} alt='' style={{ width: 152, height: 120 }} />,
                type: 'upload'
            },
            {
                title: "地址",
                dataIndex: "address",
                type: 'input'
            },
            {
                title: "价格",
                dataIndex: "money",
                type: 'input',
            },
            {
                title: "类型",
                dataIndex: "free",
                type: 'input',
            },
            {
                title: "评分",
                dataIndex: "point",
                type: 'input',
            },
            {
                title: "时间",
                dataIndex: "time",
                type: 'input',
            },
        ],
        showSearch: false,
        icon: <SettingOutlined />,
        database: database.pdDatabase,
    },
    {
        router: 'pDXinxuanMall',
        title: '心选商城',
        collection: pdCollection.xxscs,
        itemTableColumnList: xxscsItemTableColumnList,
        tableColumnList: [
            {
                title: "类型",
                dataIndex: "type",
                type: 'input'
            },
            {
                title: "列表",
                dataIndex: "list",
                type: 'table',
                render: (value) => {
                    return (
                        <Table dataSource={value || []} >
                        {(xxscsItemTableColumnList || []).map((tableColumn) => {
                            return (
                                <Column
                                    title={tableColumn?.title}
                                    dataIndex={tableColumn?.dataIndex}
                                    key={tableColumn?.dataIndex}
                                    render={(v, i, r) => { 
                                        return tableColumn?.render 
                                            ? tableColumn?.render(v, i, r) 
                                            : v
                                    }}
                                    width={tableColumn?.width}
                                />
                            )
                        })}
                    </Table>
                    )
                },
            },
        ],
        showSearch: false,
        icon: <ShopOutlined />,
        database: database.pdDatabase,
    },
    {
        database: database.pdDatabase,
        collection: pdCollection.soundlbts,     
        title: '声音剧 轮播图',
        tableColumnList: [{
            title: "轮播图",
            dataIndex: "imgUrl",
            render: (url) => <img src={url} alt='' style={{ width: 280, height: 100 }} />,
            type: 'upload'
        }],
        showSearch: false,
        router: 'pDSoundCarouselImage',
        icon: <PictureOutlined />,
    },
    {
        database: database.pdDatabase,
        collection: pdCollection.soundeverydays,     
        title: '声音剧 每日珍藏图片',
        tableColumnList: [{
            title: "轮播图",
            dataIndex: "imgUrl",
            render: (url) => <img src={url} alt='' style={{ width: 80, height: 100 }} />,
            type: 'upload'
        }],
        showSearch: false,
        router: 'pDSoundEveryday',
        icon: <PictureOutlined />,
    },
    {
        router: 'pDSoundRecommendedDramas',
        title: '声音剧 好剧推荐',
        collection: pdCollection.soundrecommends,
        tableColumnList: [
            {
                title: "描述",
                dataIndex: "describe",
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
                title: "主讲人",
                dataIndex: "speaker",
                type: 'input'
            },
            {
                title: "按钮文案",
                dataIndex: "free",
                type: 'input'
            },
        ],
        showSearch: false,
        icon: <FireOutlined />,
        database: database.pdDatabase,
    },
    {
        router: 'pDSoundNearbyShoppingMalls',
        title: '声音剧 周边商城 竖',
        collection: pdCollection.soundverticals,
        tableColumnList: [
            {
                title: "标题",
                dataIndex: "title",
                type: 'input'
            },
            {
                title: "图片",
                dataIndex: "imgUrl",
                render: (url) => <img src={url} alt='' style={{ width: 100, height: 100 }} />,
                type: 'upload'
            },
            {
                title: "价格",
                dataIndex: "price",
                type: 'input'
            },
        ],
        showSearch: false,
        icon: <ShoppingOutlined />,
        database: database.pdDatabase,
    },
    {
        router: 'pDLiLeiSlowReadingCurrentlyInMore',
        title: '李雷慢读 当前在更',
        collection: pdCollection.llsreads,
        tableColumnList: [
            {
                title: "标题",
                dataIndex: "title",
                type: 'input'
            },
            {
                title: "图片",
                dataIndex: "imgUrl",
                render: (url) => <img src={url} alt='' style={{ width: 100, height: 160 }} />,
                type: 'upload'
            },
            {
                title: "描述",
                dataIndex: "describe",
                type: 'input'
            },
            {
                title: "标语",
                dataIndex: "sketch",
                type: 'input'
            },
        ],
        showSearch: false,
        icon: <SettingOutlined />,
        database: database.pdDatabase,
    },
    {
        router: 'pDLiLeiSlowReadingEditRecommend',
        title: '李雷慢读 编辑推荐',
        collection: pdCollection.llsreadrs,
        tableColumnList: [
            {
                title: "标题",
                dataIndex: "title",
                type: 'input'
            },
            {
                title: "图片",
                dataIndex: "imgUrl",
                render: (url) => <img src={url} alt='' style={{ width: 80, height: 120 }} />,
                type: 'upload'
            },
            {
                title: "描述",
                dataIndex: "describe",
                type: 'input'
            },
            {
                title: "标语",
                dataIndex: "sketch",
                type: 'input'
            },
            {
                title: "节数",
                dataIndex: "pitch",
                type: 'input'
            },
        ],
        showSearch: false,
        icon: <FireOutlined />,
        database: database.pdDatabase,
    },
    {
        router: 'pDLiLeiSlowReadingFreeTodayOnly',
        title: '李雷慢读 今日限免',
        collection: pdCollection.todays,
        tableColumnList: [
            {
                title: "标题",
                dataIndex: "title",
                type: 'input'
            },
            {
                title: "图片",
                dataIndex: "imgUrl",
                render: (url) => <img src={url} alt='' style={{ width: 80, height: 120 }} />,
                type: 'upload'
            },
            {
                title: "描述",
                dataIndex: "describe",
                type: 'input'
            },
            {
                title: "名字",
                dataIndex: "name",
                type: 'input'
            },
        ],
        showSearch: false,
        icon: <SettingOutlined />,
        database: database.pdDatabase,
    },
    {
        router: 'pDLiLeiSlowReadingTalkShow',
        title: '李雷慢读 谈话节目',
        collection: pdCollection.talks,
        tableColumnList: [
            {
                title: "标题",
                dataIndex: "title",
                type: 'input'
            },
            {
                title: "图片",
                dataIndex: "imgUrl",
                render: (url) => <img src={url} alt='' style={{ width: 180, height: 120 }} />,
                type: 'upload'
            },
            {
                title: "人员",
                dataIndex: "people",
                type: 'input'
            },
        ],
        showSearch: false,
        icon: <MailOutlined />,
        database: database.pdDatabase,
    },
    {
        router: 'pDMessages',
        title: '消息',
        collection: pdCollection.messages,
        tableColumnList: [
            {
                title: "标题",
                dataIndex: "title",
                type: 'input'
            },
            {
                title: "信息内容",
                dataIndex: "msg",
                type: 'input'
            },
            {
                title: "时间",
                dataIndex: "day",
                type: 'input'
            },
        ],
        showSearch: false,
        icon: <MailOutlined />,
        database: database.pdDatabase,
    },
    {
        router: 'pDSearchtextlists',
        title: '搜索后',
        collection: pdCollection.searchtextlists,
        tableColumnList: [
            {
                title: "标记",
                dataIndex: "flag",
                type: 'input'
            },
            {
                title: "结果",
                dataIndex: "result",
                type: 'tags',
                render: (v) => v?.join('，')
            },
        ],
        showSearch: false,
        icon: <MailOutlined />,
        database: database.pdDatabase,
    },
    {
        router: 'pDSearchlists',
        title: '搜索时',
        collection: pdCollection.searchlists,
        tableColumnList: [
            {
                title: "标记",
                dataIndex: "flag",
                type: 'input'
            },
            {
                title: "结果",
                dataIndex: "result",
                type: 'tags',
                render: (v) => v?.join('，')
            },
        ],
        showSearch: false,
        icon: <MailOutlined />,
        database: database.pdDatabase,
    },
]