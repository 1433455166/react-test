/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Table, Card, Button, Space, Modal, message } from "antd";
import "./index.css";
import EditPage from "./EditPage";
import SearchCard from "./SearchCard";
import { cocQuary, cocDelete } from "../../serve"

const { Column } = Table;

const App = () => {
    const [data, setData] = useState([]); // 表格数据
    const [loading, setLoading] = useState(false); // 表格是否加载
    const [isEdit, setIsEdit] = useState(false); // 是否是编辑页面
    const [recordValue, setRecordValue] = useState(); // 编辑数据
    const [showDeleteModal, setShowDeleteModal] = useState(false); // 删除二次确认框的显隐

    const getQuary = async () => {
        setLoading(true);
        const res = await cocQuary()
        if (res?.success) {
            setData(res?.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        getQuary();
    }, []);

    // 删除二次确认弹窗确认事件
    const handleOk = async (record) => {
        try {
            const res = await cocDelete({ id: record?.id })
            if (res?.success) {
                message.success("删除成功！")
                getQuary();
                setShowDeleteModal(false)
            }
        } catch {
            setShowDeleteModal(false)
        }
    }

    // 删除二次确认弹窗取消事件
    const handleCancel = () => {
        setShowDeleteModal(false);
    };

    return !isEdit ? (
        <Card>
            <div className="top-wrap">
                <div className="coc-title">等级数据</div>
                <Button type="primary" onClick={() => {
                    setRecordValue()
                    setIsEdit(true)
                }}>
                    新增数据
                </Button>
            </div>
            <SearchCard setData={setData} getQuary={getQuary} />
            <Table dataSource={data} loading={loading}>
                <Column title="等级" dataIndex="label" key="label" />
                <Column
                    title="建筑"
                    dataIndex="build"
                    key="build"
                />
                <Column
                    title="建筑中文翻译"
                    dataIndex="translate"
                    key="translate"
                />
                <Column
                    title="建筑图片"
                    dataIndex="image"
                    key="image"
                    render={(url) => <img src={url} alt='' style={{ width: 64, height: 64 }} />}
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
                                        setRecordValue(record);
                                        setIsEdit(true);
                                    }}
                                >
                                    编辑
                                </Button>
                                <Button
                                    type="primary"
                                    danger
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    删除
                                </Button>
                                <Modal
                                    title="是否删除"
                                    open={showDeleteModal}
                                    onOk={() => handleOk(record)}
                                    onCancel={handleCancel}
                                >确定删除吗？</Modal>
                            </Space>
                        );
                    }}
                />
            </Table>
        </Card>
    ) : (
        <EditPage
            recordValue={recordValue}
            getQuary={getQuary}
            setIsEdit={setIsEdit}
        />
    );
};

export default App;
