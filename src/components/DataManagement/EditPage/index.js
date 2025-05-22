/* eslint-disable no-case-declarations */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Card, Form, Button, Input, Upload, InputNumber, Modal, message, DatePicker, Table, Space, Select } from "antd";
import { getStringId } from "lz-js-tools";
import "./index.css";
import { easyAdd, easyEdit } from "../../../serve"
import { timeStrToStamp } from "../../../utils/time"
import TableModal from "./tableModal"

const { Column } = Table;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const EditPage = (props) => {
    const { setIsEdit, getQuary, recordValue, tableColumnList, title, collection, itemTableColumnList } = props;

    const imgName = tableColumnList?.find((column) => column?.type === 'upload')?.dataIndex;
    const time = tableColumnList?.find((column) => column?.type === 'time')?.dataIndex;
    const timeInterval = tableColumnList?.find((column) => column?.type === 'timeInterval')?.dataIndex;
    const table = tableColumnList?.find((column) => column?.type === 'table')?.dataIndex;
    // 类型是编辑还是新增
    const type = recordValue ? "编辑" : "新增";

    // 是否是编辑态
    const isEdit = type === "编辑"

    const [fileList, setFileList] = useState(isEdit ? [
        {
            thumbUrl: recordValue?.[imgName],
        },
    ] : []);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState(recordValue?.[imgName]);
    const [previewTitle, setPreviewTitle] = useState("");
    const [tableData, setTableData] = useState(recordValue?.[table]);
    const [tableItem, setTableItem] = useState();
    const [showModal, setShowModal] = useState(false); // table 弹窗的显隐
    const [showDeleteModal, setShowDeleteModal] = useState(false); // table 删除二次确认框的显隐
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
                [imgName]: url,
            });
        } else {
            form.setFieldsValue({
                [imgName]: null,
            });
        }
        setFileList(newFileList)
    };

    // 编辑时提交事件
    const editClick = async (params) => {
        const url = params?.[imgName] ? new URL(params?.[imgName]) : '';
        const res = await easyEdit({
            collection,
            data: {
                ...recordValue,
                ...params,
                [imgName]: url.pathname,
                [time]: params?.[time] && timeStrToStamp(params?.[time]),
                [timeInterval]: [
                    params?.[timeInterval]?.[0] ? timeStrToStamp(params?.[timeInterval][0]) : null,
                    params?.[timeInterval]?.[1] ? timeStrToStamp(params?.[timeInterval][1]) : null,
                ],
                [table]: table && tableData ? (tableData || []).map((item) => {
                    const img = itemTableColumnList?.find((column) => column?.type === 'upload')?.dataIndex;
                    const imgUrl = item?.[img] ? new URL(item?.[img]) : '';
                    return {
                        ...item,
                        [img]: imgUrl.pathname,
                    }
                }) : undefined,
            },
        })
        if (res?.success) {
            message.success("编辑成功！")
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

        if (recordValue) {
            editClick(params);
        } else {
            const url = value?.[imgName] ? new URL(value?.[imgName]) : '';
            const res = await easyAdd({
                collection,
                data: {
                    ...value,
                    [imgName]: url.pathname,
                    [time]: value?.[time] && timeStrToStamp(value?.[time]),
                    [timeInterval]: [
                        value?.[timeInterval]?.[0] ? timeStrToStamp(value?.[timeInterval][0]) : null,
                        value?.[timeInterval]?.[1] ? timeStrToStamp(value?.[timeInterval][1]) : null,
                    ],
                    [table]: table && tableData ? (tableData || []).map((item) => {
                        const img = itemTableColumnList?.find((column) => column?.type === 'upload')?.dataIndex;
                        const imgUrl = item?.[img] ? new URL(item?.[img]) : '';
                        return {
                            ...item,
                            [img]: imgUrl.pathname,
                        }
                    }) : undefined,
                },
            })
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
        const typeProps = tableColumn?.typeProps || {};
        switch (tableColumn?.type) {
            case 'inputNumber': 
                return <InputNumber { ...typeProps } />;
            case 'input': 
                return <Input onBlur={tableColumn?.onBlur} />;
            case 'time':
                return <DatePicker showTime />;
            case 'timeInterval':
                return <RangePicker />;
            case 'textArea':
                return <TextArea { ...typeProps } />;
            case 'tags':
                return <Select mode="tags" />
            case 'select':
                return <Select { ...typeProps } />
            case 'table':
                return (
                    <>
                        <Button 
                            onClick={() => {
                                setShowModal(true)
                            }}
                            type="primary"
                            style={{ marginBottom: 12 }}
                        >
                            添加
                        </Button>
                        <Table dataSource={tableData || []}>
                            {(itemTableColumnList || []).map((tableColumn) => {
                                return (
                                    <Column
                                        title={tableColumn?.title}
                                        dataIndex={tableColumn?.dataIndex}
                                        key={tableColumn?.dataIndex}
                                        render={(v, i, r) => { 
                                            return tableColumn?.render 
                                                ? tableColumn?.render(v, i, r) 
                                                : v
                                        }}
                                        width={tableColumn?.width}
                                    />
                                )
                            })}
                            <Column
                                title="操作"
                                dataIndex="action"
                                key="action"
                                render={(_v, record, index) => {
                                    return (
                                        <Space>
                                            <Button
                                                type="primary"
                                                onClick={() => {
                                                    setTableItem({
                                                        ...record,
                                                        index: index,
                                                    })
                                                    setShowModal(true)
                                                }}
                                            >
                                                编辑
                                            </Button>
                                            <Button
                                                type="primary"
                                                danger
                                                onClick={() => {
                                                    setTableItem({
                                                        index: index,
                                                    })
                                                    setShowDeleteModal(true)
                                                }}
                                            >
                                                删除
                                            </Button>
                                        </Space>
                                    );
                                }}
                            />
                        </Table>
                    </>
                );
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
    };

    const tableDeleteFn = () => {
        const arr = [ ...tableData ];
        const index = tableItem?.index; // 要删除的元素索引
        arr.splice(index, 1);
        setTableData(arr);
        setShowDeleteModal(false)
    }

    // console.log(/render/, recordValue);
    return (
        <Card style={{ width: '100%', height: "100vh" }}>
            <div className="top-wrap">
                <div className="coc-title">{title}{type}</div>
            </div>
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 16 }}
                // style={{ maxWidth: 600 }}
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
            <Modal
                title="是否删除"
                open={showDeleteModal}
                onOk={() => tableDeleteFn()}
                onCancel={() => setShowDeleteModal(false)}
            >
                确定删除吗？
            </Modal>
            {showModal && (
                <TableModal 
                    tableItem={tableItem}
                    setTableItem={setTableItem}
                    collection={collection}
                    itemTableColumnList={itemTableColumnList}
                    setShowModal={setShowModal}
                    setTableData={setTableData}
                    tableData={tableData}
                    setTable={(e) => {
                        form.setFieldValue(table, e)
                    }}
                />
            )}
        </Card>
    );
};

export default EditPage;
