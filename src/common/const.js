// COOKIE 的名字
export const COOKIE_NAME = {
    userMessage: 'USER_MESSAGE'
}
// 数据库
export const database = {
    // 部落冲突
    cocDatabase: "coc-database",
    // 攀登读书
    pdDatabase: '111',
}
// 攀登读书 数据库集合列表
export const pdCollection = {
    lbts: "lbts", // 轮播图
    recentlists: "recentlists", // 最近在学
    contentlists: "contentlists", // 最近在学 content
}
// 本地 端口号
export const port = 3001
// 地址
export const address = {
    // 后端地址
    backend: 'http://127.0.0.1:888',
    //  c端 后端地址
    cBackend: 'http://localhost:3000',
    // 本地地址
    local: `http://localhost:${port}`,
}