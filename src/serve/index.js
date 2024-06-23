import request from "./request";

// coc 列表查询
export const cocQuary = () => {
    const res = request({ url: "/api/coc.quary" });
    return res
}

// coc 删除
export const cocDelete = (params) => {
    const res = request({ url: "/api/coc.delete", params }, "POST");
    return res
}

// coc 添加
export const cocAdd = (params) => {
    const res = request({ url: "/api/coc.add", params }, "POST");
    return res
}

// coc 编辑
export const cocEdit = (params) => {
    const res = request({ url: "/api/coc.edit", params }, "POST");
    return res
}

// coc 编辑
export const cocSearch = (params) => {
    const res = request({ url: "/api/coc.search", params }, "POST");
    return res
}