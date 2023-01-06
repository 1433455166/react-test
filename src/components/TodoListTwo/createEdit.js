// List 弹窗
import React, { useEffect } from "react";
import { Button, Input, Modal, Form } from "antd";

const CreateEdit = (props) => {
  const {
    setInitLoading,
    list,
    setList,
    isModalOpen,
    setIsModalOpen,
    type,
    itemObject,
  } = props;
  const [modalForm] = Form.useForm();
  useEffect(() => {
    console.log(itemObject, modalForm.getFieldsValue());
  }, [modalForm, itemObject]);
  // 弹窗确认事件
  const handleOk = () => {
    setInitLoading(true);
    const newList = list;
    // newList.push(form.getFieldsValue());
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

  return (
    <div>
      <Button
        onClick={() => {
          modalForm.setFieldsValue(itemObject);
          setIsModalOpen(true);
        }}
        type="link"
      >
        编辑
      </Button>
      <Modal
        title="新增数据"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name={type}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          form={modalForm}
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

export default CreateEdit;
