/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Table, Card, Button, Space, Modal, message } from "antd";
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from '../../actions'
import "./index.css";
import EditPage from "./EditPage";
import SearchCard from "./SearchCard";
import { easyQueryList, easyDelete } from "../../serve"
import { LOGIN_STATUS } from "../../common"
import { COOKIE_NAME } from "../../common/const"
import { getCookie } from '../../utils/cookie';

const { Column } = Table;

// 数据管理组件
const DataManagement = (props) => {
    const { database, collection, title, tableColumnList, showSearch, searchType } = props
    const [data, setData] = useState([]); // 表格数据
    const [loading, setLoading] = useState(false); // 表格是否加载
    const [isEdit, setIsEdit] = useState(false); // 是否是编辑页面
    const [recordValue, setRecordValue] = useState(); // 编辑数据
    const [showDeleteModal, setShowDeleteModal] = useState(false); // 删除二次确认框的显隐

    const dispatch = useDispatch();
    const signOutFn = () => dispatch(signOut());

    const getQuary = async () => {
        setLoading(true);
        try {
            const res = await easyQueryList({
                database: database,
                collection: collection
            })
            if (res?.success) {
                setData(JSON.parse(res?.data?.data || '{}'));
            }
            setLoading(false);
        } catch (error) {
            console.log(/error/, error)
            if (error?.data?.errorStatus === LOGIN_STATUS.SIGN_OUT) {
                const user = JSON.parse(getCookie(COOKIE_NAME.userMessage) || '{}')
                if (!user?.userName) {
                    signOutFn()
                }

            }
            setLoading(false);
        }
    };

    const isLogIn = useSelector((state) => state.counter.isLogIn);
    useEffect(() => {
        getQuary();
    }, [isLogIn]);

    // 删除二次确认弹窗确认事件
    const handleOk = async (record) => {
        try {
            const res = await easyDelete({ id: record?.id, collection: collection })
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
        <Card style={{ width: '100%', height: "100%" }}>
            <div className="top-wrap">
                <div className="coc-title">{title || '等级数据'}</div>
                <Button type="primary" onClick={() => {
                    setRecordValue()
                    setIsEdit(true)
                }}>
                    新增数据
                </Button>
            </div>
            {showSearch && (
                <SearchCard 
                    setData={setData} 
                    getQuary={getQuary} 
                    tableColumnList={tableColumnList} 
                    collection={collection} 
                    searchType={searchType}
                />
            )}
            <Table dataSource={data} loading={loading}>
                {(tableColumnList || []).map((tableColumn) => {
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
                        />
                    )
                })}
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
                                    onClick={() => {
                                        setRecordValue(record);
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
            <Modal
                title="是否删除"
                open={showDeleteModal}
                onOk={() => handleOk(recordValue)}
                onCancel={handleCancel}
            >
                确定删除吗？
            </Modal>
        </Card>
    ) : (
        <EditPage
            recordValue={recordValue}
            getQuary={getQuary}
            setIsEdit={setIsEdit}
            tableColumnList={tableColumnList}
            title={title}
            collection={collection}
        />
    );
};

export default DataManagement;
