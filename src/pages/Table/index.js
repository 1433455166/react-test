/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import axios from "axios";

const { Column, ColumnGroup } = Table;

const App = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get("/api/tableData").then(
      (response) => {
        console.log("成功了", response.data);
        setData(response.data?.data);
      },
      (error) => {
        console.log("失败了", error);
      }
    );
    const data = {
      key1: "value1",
      key2: "value2",
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 5000, // 设置超时时间为5秒
    };

    axios
      .post("/api/test", JSON.stringify(data), config)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        // 报错处理
        if (error.code === "ECONNABORTED") {
          console.error("请求超时！");
        } else if (error.response) {
          console.error("服务器错误:", error.response.data);
        } else if (error.request) {
          console.error("请求错误:", error.request);
        } else {
          console.error("未知错误:", error.message);
        }
      });
  }, []);
  return (
    <Table dataSource={data}>
      <Column title="等级" dataIndex="label" key="label" />
      <Column
        title="建筑"
        dataIndex="build"
        key="build"
        render={(tags) => {
          return <>{tags.join(",")}</>;
        }}
      />
      <ColumnGroup title="最大建筑等级">
        <Column
          title="大本营"
          dataIndex="maxBuildLabel"
          key="baseCamp"
          render={(maxBuildLabel) => maxBuildLabel?.baseCamp}
        />
        <Column
          title="兵营"
          dataIndex="maxBuildLabel"
          key="barracks"
          render={(maxBuildLabel) => maxBuildLabel?.barracks}
        />
        <Column
          title="训练营"
          dataIndex="maxBuildLabel"
          key="trainingCamp"
          render={(maxBuildLabel) => maxBuildLabel?.trainingCamp}
        />
        <Column
          title="加农炮"
          dataIndex="maxBuildLabel"
          key="cannon"
          render={(maxBuildLabel) => maxBuildLabel?.cannon}
        />
        <Column
          title="箭塔"
          dataIndex="maxBuildLabel"
          key="bartizan"
          render={(maxBuildLabel) => maxBuildLabel?.bartizan || "无"}
        />
      </ColumnGroup>
      {/* <Column title="翻译" dataIndex="translate" key="translate" /> */}
      <Column
        title="建筑翻译"
        dataIndex="build"
        key="translate"
        render={(tags, record) => {
          return (
            <>
              {(tags || []).map((tag) => (
                <Tag color="blue" key={tag}>
                  {/* {record?.translate[tag]} */}
                  {record?.translate[tag]}
                </Tag>
              ))}
            </>
          );
        }}
      />
      {/* <Column
        title="Action"
        key="action"
        render={(_, record) => (
          <Space size="middle">
            <a>Invite {record.lastName}</a>
            <a>Delete</a>
          </Space>
        )}
      /> */}
    </Table>
  );
};

export default App;
