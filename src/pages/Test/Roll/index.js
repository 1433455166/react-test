/**
 * 滚动
 */
import React from "react";
import NavLeft from "../NavLeft";
import "./index.css";

const Other = () => {
  return (
    <div className="filter-wrap">
      <NavLeft />
      <div>
        <h1>滚动</h1>
        <div className="g-wrap">
          <div className="g-content" />
        </div>
      </div>
    </div>
  );
};

export default Other;
