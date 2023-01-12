// List 自定义增删改查
import React, { useState } from "react";
import {
  Avatar,
  List,
  Skeleton,
  Button,
  Input,
  Modal,
  Form,
  message,
  Popconfirm,
} from "antd";
import CreateEdit from "./createEdit";

const { Search } = Input;

const CUSTOMLIST = [
  {
    gender: "female",
    name: "Hennum",
    email: "munira.hennum@example.com",
    picture: "https://randomuser.me/api/portraits/women/19.jpg",
    nat: "NO",
  },
  {
    gender: "female",
    name: "Pulli",
    email: "nella.pulli@example.com",
    picture: "https://randomuser.me/api/portraits/women/22.jpg",
    nat: "FI",
  },
  {
    gender: "female",
    name: "Neva",
    email: "ellen.neva@example.com",
    picture: "https://randomuser.me/api/portraits/women/95.jpg",
    nat: "FI",
  },
];

const TodoList = () => {
  const [initLoading, setInitLoading] = useState(false); // loading 状态
  const [list, setList] = useState(CUSTOMLIST); // 默认 list 数据
  const [isModalOpen, setIsModalOpen] = useState(false); // 新增弹窗的显隐
  const [form] = Form.useForm();
  // 弹窗确认事件
  const handleOk = () => {
    setInitLoading(true);
    const newList = list;
    newList.push(form.getFieldsValue());
    setList(newList);
    // 延时一秒钟，模拟加载效果
    setTimeout(() => {
      setInitLoading(false);
    }, 1000);
    setIsModalOpen(false);
  };
  // 弹窗取消事件
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // 查询搜索事件
  const onSearch = (value) => {
    setInitLoading(true);
    let arr = [];
    list.forEach((item) => {
      if (item.nat === value) arr.push(item);
    });
    // 搜索结果为空时搜索结果应为全部数据
    if (value === "") {
      setList(CUSTOMLIST);
    } else {
      setList(arr);
    }
    // 延时一秒钟，模拟加载效果
    setTimeout(() => {
      setInitLoading(false);
    }, 1000);
  };
  // 删除二次确认取消事件
  const cancel = () => {
    message.error("取消删除");
  };

  return (
    <div>
      <Search
        placeholder="按照国家来搜索"
        allowClear
        enterButton="搜索"
        size="large"
        onSearch={onSearch}
      />
      <List
        loading={initLoading}
        itemLayout="horizontal"
        dataSource={list}
        renderItem={(item) => {
          // 遍历 dataSource 的数据，返回需要渲染的数
          return (
            <List.Item
              actions={[
                <CreateEdit
                  setInitLoading={setInitLoading}
                  list={list}
                  setList={setList}
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  itemObject={item}
                  type="edit"
                />,
                <Popconfirm
                  placement="topRight"
                  title="删除"
                  description="确定删除？"
                  onConfirm={() => {
                    setInitLoading(true);
                    const newList = list.filter(
                      (li) => li.email !== item.email
                    );
                    setList(newList);
                    // 延时一秒钟，模拟加载效果
                    setTimeout(() => {
                      setInitLoading(false);
                    }, 1000);
                    message.success("删除成功");
                  }}
                  onCancel={cancel}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button type="link">删除</Button>
                </Popconfirm>,
              ]}
            >
              <Skeleton avatar title={false} loading={initLoading} active>
                <List.Item.Meta
                  avatar={<Avatar src={item.picture} />}
                  title={<a href="#/other">{item.name}</a>}
                  description={
                    <>
                      <div>邮箱📮：{item.email}</div>
                      <div>国家：{item.nat}</div>
                    </>
                  }
                />
              </Skeleton>
            </List.Item>
          );
        }}
      />
      {!initLoading ? (
        <div
          style={{
            textAlign: "center",
            marginTop: 12,
            height: 32,
            lineHeight: "32px",
          }}
        >
          <Button
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            新增数据
          </Button>
        </div>
      ) : null}
      {/* 新增数据弹窗 */}
      <Modal
        title="新增数据"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          form={form}
          autoComplete="off"
        >
          <Form.Item
            label="名字"
            name="name"
            rules={[{ required: true, message: "请输入名字!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ required: true, message: "请输入邮箱📮!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="头像"
            name="picture"
            rules={[{ required: true, message: "请填写头像图片地址!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="国家"
            name="nat"
            rules={[{ required: true, message: "请输入国家!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TodoList;
