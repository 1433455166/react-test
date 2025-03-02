/* eslint-disable no-case-declarations */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Form, Input, Upload, InputNumber, Modal, message, DatePicker } from "antd";
import "./index.css";

// table 弹窗
const TableModal = (props) => {
    const { tableItem, setTableItem, collection, itemTableColumnList, setShowModal, tableData, setTableData, setTable } = props;

    const imgName = itemTableColumnList?.find((column) => column?.type === 'upload')?.dataIndex;
    // 类型是编辑还是新增
    const type = tableItem ? "编辑" : "新增";

    // 是否是编辑态
    const isEdit = type === "编辑"

    const [fileList, setFileList] = useState(isEdit ? [
        {
            thumbUrl: tableItem?.[imgName],
        },
    ] : []);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(tableItem?.[imgName]);
    const [previewTitle, setPreviewTitle] = useState("");
    const [tableForm] = Form.useForm();

    // 图片上传组件 onchange 事件
    const handleChange = (value) => {
        const { fileList: newFileList } = value

        const url = value?.file?.response?.filePath;
        if (value?.file?.error) {
            message.error('图片上传失败！');
        } else if (url) {
            tableForm.setFieldsValue({
                // 这里的 'image' 应该与 Form.Item 中的 name 属性一致  
                [imgName]: url,
            });
        } else {
            tableForm.setFieldsValue({
                [imgName]: null,
            });
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
    // 编辑组件
    const components = (tableColumn) => {
        switch (tableColumn?.type) {
            case 'inputNumber': 
                return <InputNumber />;
            case 'input': 
                return <Input onBlur={tableColumn?.onBlur} />;
            case 'time':
                return <DatePicker showTime />;
            case 'upload': 
                return (
                    <>
                        <Upload
                            action="http://localhost:3001/api/picture.upload"
                            listType="picture-card"
                            data={(e) => {
                                return {
                                    ...e,
                                    uploadAddress: collection
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
                    </>
                );
            default: 
                return <Input /> 
        }
    }

    // tabel 弹窗 ok 事件
    const modalOk = () => {
        const value = tableForm?.getFieldsValue()
        if (isEdit) {
            const { index } = tableItem;
            setTableData([ ...tableData ].map((item, idx) => {
                if (idx === index) {
                    return value
                }
                return item
            }))
        } else {
            const data = tableData || []
            setTableData([ ...data, { ...value }])
            setTable([ ...data, { ...value }])
        }
        setShowModal(false)
        setTableItem(null)
    }

    // tabel 弹窗 Cancel 事件
    const modalCancel = () => {
        setShowModal(false)
        setTableItem(null)
    };

    // console.log(1234, tableItem);

    return (
        <Modal
            title={`列表${isEdit ? '编辑' : '添加'}`}
            open
            onOk={modalOk}
            onCancel={modalCancel}
        >
            <Form
                form={tableForm}
                name="basic"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
                initialValues={tableItem}
                autoComplete="off"
            >
                {(itemTableColumnList || []).map((tableColumn) => {
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
            </Form>
        </Modal>
    );
};

export default TableModal;
