/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Card, Form, Button, Input, Upload, InputNumber, Modal, message } from "antd";
import { getStringId } from "lz-js-tools";
import "./index.css";
import { cocAdd, cocEdit } from "../../../serve"

const EditPage = (props) => {
    const { setIsEdit, getQuary, recordValue, tableColumnList, title } = props;

    // 类型是编辑还是新增
    const type = recordValue ? "编辑" : "新增";

    // 是否是编辑态
    const isEdit = type === "编辑"

    const [fileList, setFileList] = useState(isEdit ? [
        {
            thumbUrl: recordValue?.imgUrl,
        },
    ] : []);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(recordValue?.imgUrl);
    const [previewTitle, setPreviewTitle] = useState("");
    const [form] = Form.useForm();

    // 图片上传组件 onchange 事件
    const handleChange = (value) => {
        const { fileList: newFileList } = value

        const url = value?.file?.response?.filePath;
        if (value?.file?.error) {
            message.error('图片上传失败！');
        } else if (url) {
            form.setFieldsValue({
                // 这里的 'image' 应该与 Form.Item 中的 name 属性一致  
                imgUrl: url,
            });
        } else {
            form.setFieldsValue({
                imgUrl: null,
            });
        }
        setFileList(newFileList)
    };

    // 编辑时提交事件
    const editClick = async (params) => {
        const res = await cocEdit({
            ...recordValue,
            ...params,
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
            id: getStringId(),
        };

        // console.log(/value/, value);
        // return;

        if (recordValue) {
            console.log(/params/, params);
            return;
            editClick(params);
        } else {
            console.log(/value/, value);
            return;
            const res = await cocAdd(value)
            if (res?.success) {
                message.success("添加成功！")
                getQuary();
            }
        }
        setIsEdit(false);
    };

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = (file) => {
        if (!file.url && !file.preview) {
            file.preview = file?.response?.filePath;
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(
            file.name || file.url?.substring(file.url.lastIndexOf("/") + 1) || '图片放大镜'
        );
    };

    // 编辑组件
    const components = (tableColumn) => {
        switch (tableColumn?.type) {
            case 'inputNumber': 
                return <InputNumber />;
            case 'input': 
                return <Input onBlur={tableColumn?.onBlur} />;
            case 'upload': 
                return (
                    <>
                        <Upload
                            action="http://localhost:3001/api/picture.upload"
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
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
                    </>
                );
            default: 
                return <Input /> 
        }
    }

    // console.log(/render/, fileList, form.getFieldsValue());

    return (
        <Card style={{ width: '100%', height: "100%" }}>
            <div className="top-wrap">
                <div className="coc-title">{title}{type}</div>
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
                {(tableColumnList || []).map((tableColumn) => {
                    return (
                        <Form.Item
                            label={tableColumn?.title}
                            name={tableColumn?.dataIndex}
                            rules={[{ required: true, message: `请输入${tableColumn?.title}` }]}
                            key={tableColumn?.dataIndex}
                        >
                            {components(tableColumn)}
                        </Form.Item>
                    )
                })}
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
