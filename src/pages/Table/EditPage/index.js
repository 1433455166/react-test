/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Card, Form, Button, Input } from "antd";
import axios from "axios";
import "./index.css";

const EditPage = (props) => {
  const { setIsEdit, getQuary } = props;

  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 5000, // 设置超时时间为5秒
  };
  const type = "新增";
  return (
    <Card>
      <div className="top-wrap">
        <div className="coc-title">等级数据{type}</div>
      </div>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={(value) => {
          axios
            .post("/api/coc.add", JSON.stringify(value), config)
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
          setIsEdit(false);
        }}
        onFinishFailed={(err) => {
          console.error(err);
        }}
        autoComplete="off"
      >
        <Form.Item
          label="建筑"
          name="build"
          rules={[{ required: true, message: "请输入建筑" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="等级"
          name="label"
          rules={[{ required: true, message: "请输入等级" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="建筑中文翻译"
          name="translate"
          rules={[{ required: true, message: "请输入建筑中文翻译" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EditPage;
