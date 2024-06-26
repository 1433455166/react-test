/**
 * 登录组件
 */
import { Button, Input, Modal, Form, message } from "antd";
import React, { useState, useEffect } from "react";
import { registerApi, logInApi, userGetApi } from '../../serve'
import './index.css'

const TYPE = {
    LOGIN: '登录',
    REGISTER: '注册',
}

const FORM_ITEM = {
    userName: 'userName',
    password: 'password',
    confirmPassword: 'confirmPassword',
}

const User = () => {
    const [showModal, setShowModal] = useState(false)
    const [userMsg, setUserMsg] = useState({})
    const [type, setType] = useState()

    const [form] = Form.useForm();

    // 登录
    const logIn = async () => {
        try {
            const validateFields = await form.validateFields([FORM_ITEM.userName, FORM_ITEM.password])
            await logInApi(validateFields)
            // 注册成功清空表单
            form.resetFields()
            setUserMsg(validateFields)
            message.success("登录成功")
            setShowModal(false)
        } catch (error) {
            console.log(/error/, error);
        }
    }

    // 注册
    const register = async () => {
        try {
            const validateFields = await form.validateFields([FORM_ITEM.userName, FORM_ITEM.password, FORM_ITEM.confirmPassword])
            await registerApi(validateFields)
            // 注册成功清空表单
            form.resetFields()
            message.success("注册成功")
            setShowModal(false)
        } catch (error) {
            console.log(/error/, error);
        }
    }

    const handleClick = (type) => {
        setType(type)
        setShowModal(true)
    }

    // 弹窗关闭事件
    const handleCancel = () => {
        // 关闭弹窗时先清空表单
        form.resetFields()
        setShowModal(false)
    }

    // 获取登录信息
    const getUser = async (params) => {
        try {
            const res = await userGetApi({ userID: params })
            setUserMsg({ ...res?.data?.data })
        } catch (error) {
            console.log(/error/, error);
        }
    }

    useEffect(() => {
        const cookie = document.cookie
        const value = `; ${cookie}`;  
        const parts = value.split(`; userID=`);  
        if (parts.length === 2) {
            const value = parts.pop().split(';').shift();  
            getUser(Number(value))
        }
    }, [])

    return (userMsg.userName ? (
        <div className="logging-in">
            欢迎，<Button type="link">{userMsg.userName}</Button>
        </div>
    ) :
        <div className="user">
            <Button type="link" onClick={() => handleClick(TYPE.LOGIN)}>{TYPE.LOGIN}</Button>
            <Button type="text" onClick={() => handleClick(TYPE.REGISTER)}>{TYPE.REGISTER}</Button>
            <Modal
                title={type === TYPE.LOGIN ? TYPE.LOGIN : TYPE.REGISTER}
                open={showModal}
                onOk={type === TYPE.LOGIN ? logIn : register}
                onCancel={handleCancel}
            >
                <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600, marginTop: 24 }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="用户名"
                        name={FORM_ITEM.userName}
                        rules={[{ required: true, message: "请输入用户名" }]}
                        hasFeedback
                    >
                        <Input placeholder="请输入用户名" />
                    </Form.Item>
                    <Form.Item
                        label="密码"
                        name={FORM_ITEM.password}
                        rules={[{ required: true, message: "请输入密码" }]}
                        hasFeedback
                    >
                        <Input.Password placeholder="请输入密码" />
                    </Form.Item>
                    {type === TYPE.REGISTER && <Form.Item
                        hasFeedback
                        label="确认密码"
                        name={FORM_ITEM.confirmPassword}
                        // validateDebounce={1000} // validateDebounce 不生效
                        rules={[
                            { required: true, message: "请确认密码" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue(FORM_ITEM.password) === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('确认密码和密码不一致!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="请确认密码" />
                    </Form.Item>}
                </Form>
            </Modal>
        </div>
    )
}

export default User