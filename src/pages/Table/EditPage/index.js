/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Card, Form, Button, Input, Upload, InputNumber, Modal, message } from "antd";
import { getStringId } from "lz-js-tools";
import "./index.css";
import { cocAdd, cocEdit } from "../../../serve"

const EditPage = (props) => {
    const { setIsEdit, getQuary, recordValue } = props;

    // 类型是编辑还是新增
    const type = recordValue ? "编辑" : "新增";

    // 是否是编辑态
    const isEdit = type === "编辑"

    const [fileList, setFileList] = useState(isEdit ? [
        {
            thumbUrl: recordValue?.image,
        },
    ] : []);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(recordValue?.image);
    const [previewTitle, setPreviewTitle] = useState("");
    const [form] = Form.useForm();

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            if (!file) {
                return resolve(recordValue?.image);
            } else {
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            }
        });

    // 图片上传组件 onchange 事件
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    // 编辑时提交事件
    const editClick = async (params) => {
        const res = await cocEdit({
            ...recordValue,
            ...params,
            image: fileList?.[0]?.thumbUrl,
        })
        if (res?.success) {
            getQuary();
        }
    };

    // 更新组件按钮
    const uploadButton = (
        <button style={{ border: 0, background: "none" }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    // 提交按钮事件
    const onFinish = async (params) => {
        const value = {
            ...params,
            image: fileList?.[0]?.thumbUrl,
            id: getStringId(),
        };

        // console.log(/value/, value);
        // return;

        if (recordValue) {
            editClick(params);
        } else {
            const res = await cocAdd(value)
            if (res?.success) {
                message.success("添加成功！")
                getQuary();
            }
        }
        setIsEdit(false);
    };

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(
            file.name || file.url?.substring(file.url.lastIndexOf("/") + 1) || '图片放大镜'
        );
    };

    // 使用 customRequest 代替 action 处理文件，原因是 action 需要接口来处理，但是返回体不知道是什么，只能自己来处理了
    const handleUpload = async (info) => {
        try {
            const url = await getBase64(info?.file);
            form.setFieldsValue({
                // 这里的 'image' 应该与 Form.Item 中的 name 属性一致  
                image: url,
            });
            info.onSuccess(url);
        } catch (error) {
            info.onError(error);
        }
    };

    // console.log(/render/, fileList, form.getFieldsValue());

    return (
        <Card>
            <div className="top-wrap">
                <div className="coc-title">等级数据{type}</div>
            </div>
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={recordValue}
                onFinish={onFinish}
                onFinishFailed={(err) => console.error(/onFinishFailed/, err)}
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
                    <InputNumber />
                </Form.Item>

                <Form.Item
                    label="建筑中文翻译"
                    name="translate"
                    rules={[{ required: true, message: "请输入建筑中文翻译" }]}
                >
                    <Input
                        onBlur={(e) => {
                            // 获取输入框的当前值
                            let currentValue = e?.target?.value;
                            // 使用正则表达式匹配非中文字符
                            const nonChineseRegex = /[^\u4e00-\u9fa5]/g;
                            // 替换非中文字符为空字符串
                            const filteredValue = currentValue.replace(nonChineseRegex, "");
                            // 如果过滤后的值和当前值不同，说明有非中文字符被移除
                            if (filteredValue !== currentValue) {
                                form.setFieldValue("translate", filteredValue);
                            }
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="建筑图片"
                    name="image"
                    rules={[{ required: true, message: "请输入建筑图片" }]}
                >
                    <Upload
                        // action="http://localhost:3000/api/picture.upload"
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        customRequest={handleUpload}
                    >
                        {fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                    <Modal
                        open={previewOpen}
                        title={previewTitle}
                        footer={null}
                        onCancel={handleCancel}
                    >
                        <img alt="example" style={{ width: "100%" }} src={previewImage} />
                    </Modal>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 1, span: 6 }}>
                    <Button type="primary" htmlType="submit" style={{ marginRight: 12 }}>
                        提交
                    </Button>
                    <Button onClick={() => setIsEdit(false)}>返回</Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default EditPage;
