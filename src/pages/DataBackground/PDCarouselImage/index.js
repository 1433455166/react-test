import React from "react";
import "../index.css";
import LeftMenu from "../LeftMenu";
import DataManagement from "../../../components/DataManagement";
import { database, pdCollection } from "../../../common/const";

// 轮播图
const PDCarouselImage = () => {
    const tableColumnList = [{
        title: "轮播图",
        dataIndex: "imgUrl",
        render: (url) => <img src={url} alt='' style={{ width: 280, height: 100 }} />,
        type: 'upload'
    }]
    return (
        <div className="data-background">
            <LeftMenu />
            <DataManagement
                database={database.pdDatabase}
                collection={pdCollection.lbts}
                title='pdds轮播图'
                tableColumnList={tableColumnList}
                showSearch={false}
            />
        </div>
    );
};

export default PDCarouselImage;
