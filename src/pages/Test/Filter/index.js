/**
 * 过滤条件
 */
import { Select, Space } from "antd";
import { FILTER_OPTION } from "../../../constants";
import React from "react";
import NavLeft from "../NavLeft";
import "./index.css";

const Filter = () => {
  return (
    <div className="filter-wrap">
      <NavLeft />
      <div>
        <h1>filter</h1>
        <Space>
          <Select
            placeholder="左值"
            options={FILTER_OPTION}
            style={{ width: 120 }}
          />
          <Select placeholder="操作符" style={{ width: 120 }} />
          <Select placeholder="值类型" style={{ width: 120 }} />
          <Select
            placeholder="右值"
            options={FILTER_OPTION}
            style={{ width: 120 }}
          />
        </Space>
      </div>
    </div>
  );
};

export default Filter;
