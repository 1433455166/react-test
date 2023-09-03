/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Table, Card, Button, Space } from "antd";
import axios from "axios";
import "./index.css";
import EditPage from "./EditPage";

const { Column } = Table;

const config = {
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000, // 设置超时时间为5秒
};

const App = () => {
  const [data, setData] = useState([]); // 表格数据
  const [loading, setLoading] = useState(false); // 表格是否加载
  const [isEdit, setIsEdit] = useState(false); // 是否是编辑页面
  const getQuary = () => {
    setLoading(true);
    axios.get("/api/coc.quary").then(
      (response) => {
        console.log("成功了", response.data);
        setData(response.data);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      },
      (error) => {
        console.log("失败了", error);
        setLoading(false);
      }
    );
  };
  useEffect(() => {
    getQuary();
  }, []);
  return !isEdit ? (
    <Card>
      <div className="top-wrap">
        <div className="coc-title">等级数据</div>
        <Button type="primary" onClick={() => setIsEdit(true)}>
          新增数据
        </Button>
      </div>
      <Table dataSource={data} loading={loading}>
        <Column title="等级" dataIndex="label" key="label" />
        <Column
          title="建筑"
          dataIndex="build"
          key="build"
          // render={(tags) => {
          //   return <>{tags.join(",")}</>;
          // }}
        />
        {/* <ColumnGroup title="最大建筑等级">
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
        </ColumnGroup> */}
        <Column
          title="建筑中文翻译"
          dataIndex="translate"
          key="translate"
          // render={(tags, record) => {
          //   return (
          //     <>
          //       {(tags || []).map((tag) => (
          //         <Tag color="blue" key={tag}>
          //           {/* {record?.translate[tag]} */}
          //           {record?.translate[tag]}
          //         </Tag>
          //       ))}
          //     </>
          //   );
          // }}
        />
        <Column
          title="操作"
          dataIndex="action"
          key="action"
          render={(_, record) => {
            return (
              <Space>
                <Button
                  type="primary"
                  onClick={() => {
                    console.log(/编辑/, record);
                  }}
                >
                  编辑
                </Button>
                <Button
                  type="primary"
                  danger
                  onClick={() => {
                    axios
                      .post(
                        "/api/coc.delete",
                        JSON.stringify({ translate: record?.translate }),
                        config
                      )
                      .then(() => {
                        getQuary();
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
                  }}
                >
                  删除
                </Button>
              </Space>
            );
          }}
        />
      </Table>
    </Card>
  ) : (
    <EditPage getQuary={getQuary} setIsEdit={setIsEdit} />
  );
};

export default App;
