/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Card, Form, Upload, Modal, message } from "antd";
import "./index.css";

const EditPage = () => {
    const [fileList, setFileList] = useState([
        {
            thumbUrl: '',
        },
    ]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState("");
    const [form] = Form.useForm();

    // 图片上传组件 onchange 事件
    const handleChange = (value) => {
        const { fileList: newFileList } = value

        const url = value?.file?.response?.filePath;
        if (value?.file?.error) {
            message.error('图片上传失败！');
        } else if (url) {
            // form.setFieldsValue({
            //     // 这里的 'image' 应该与 Form.Item 中的 name 属性一致  
            //     [imgName]: url,
            // });
        } else {
            // form.setFieldsValue({
            //     [imgName]: null,
            // });
        }
        setFileList(newFileList)
    };

    // 更新组件按钮
    const uploadButton = (
        <button style={{ border: 0, background: "none" }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

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

    const beforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        console.log(123, file);
        
        if (!isImage) {
          message.error('只能上传图片文件！');
        }
        return isImage; // 返回 true 表示允许上传，false 表示阻止上传
      };

    // console.log(/render/, recordValue);
    return (
        <Card style={{ width: '100%', height: "100vh" }}>
            <Form form={form}>
                <Upload
                    accept="image/*" // 限制选择器只显示图片文件
                    beforeUpload={beforeUpload} // 进一步验证文件类型
                    showUploadList={true} // 显示上传列表
                    action="http://localhost:3001/api/cc.lz.extract.text"
                    listType="picture-card"
                    data={(e) => {
                        return {
                            ...e,
                        }
                    }}
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
            </Form>
        </Card>
    );
};

export default EditPage;
