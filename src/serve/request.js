/* eslint-disable no-throw-literal */
import axios from "axios";
import { message } from "antd";

// 请求头
const config = {
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 5000, // 设置超时时间为5秒
};

// 成功处理函数
const successFn = (success) => {
    if (!success?.data?.success) {
        message.error(success?.data?.errorMessage || "系统错误，请联系管理员！");
        throw {
            ...success,
            success: false
        }
    }
    return {
        ...success,
        success: true
    }
};

// 错误处理函数
const errorFn = (error) => {
    // 报错处理
    if (error?.code === "ECONNABORTED") {
        message.error("请求超时！");
    } else if (error?.response) {
        message.error(`服务器错误: ${error?.response?.data}`);
    } else if (error?.request) {
        message.error(`请求错误: ${error?.request}`);
    } else {
        message.error(`未知错误: ${error?.message}`);
    }
    return {
        ...error,
        success: false
    }
}

const request = (obj, type = 'GET') => {
    switch (type) {
        case 'GET':
            const getRes = axios.get(obj?.url).then(
                successFn,
                errorFn,
            );
            return getRes;
        case 'POST':
            const postRes = axios.post(obj?.url, JSON.stringify(obj?.params), config).then(
                successFn,
                errorFn,
            );
            return postRes;
        default:
            const defaultRes = axios.get(obj?.url).then(
                successFn,
                errorFn,
            );
            return defaultRes;
    }
}
export default request;

