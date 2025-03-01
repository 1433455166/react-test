import React from "react";
import LeftMenu from "./LeftMenu";
import { pageDataSource } from "./dataSource"
import DataManagement from "../../components/DataManagement"
import "./index.css";

// 数据后台
function DataBackground() {
  // 获取完整URL
  let currentUrl = window.location.href;
  // 查找 'dataBackground/' 的位置
  const dataBackgroundIndex = currentUrl.indexOf('dataBackground/');
  // 提取 'dataBackground/' 后面的数据
  const dataAfterDataBackground = currentUrl.substring(dataBackgroundIndex + 'dataBackground/'.length);
  const current = dataBackgroundIndex === -1 ? 'pDCarouselImage' : dataAfterDataBackground
  const renderDom = () => {
    const pageData = pageDataSource?.find((page) => page?.router === current)
    return (
        <DataManagement {...pageData} />
    )
  };

  return (
    <div className="data-background">
        <LeftMenu currentValue={current} />
        {renderDom()}
    </div>
  );
}

export default DataBackground;
