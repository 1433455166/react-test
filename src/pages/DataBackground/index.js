import React, { useState } from "react";
import PDCarouselImage from "./PDCarouselImage";
import LeftMenu from "./LeftMenu";
import "./index.css";

// 数据后台
function DataBackground() {
  const [current, setCurrent] = useState("pDCarouselImage");
  const renderDom = (value) => {
    switch (value) {
      case "pDCarouselImage":
        return <PDCarouselImage />;
    //   case "bouncyBall":
    //     return <BouncyBall />;
    //   case "gobang":
    //       return <Gobang />;
      default:
        <div />;
    }
  };

  return (
    <div className="data-background">
        <LeftMenu current={current} setCurrent={setCurrent} />
        {renderDom(current)}
    </div>
  );
}

export default DataBackground;
