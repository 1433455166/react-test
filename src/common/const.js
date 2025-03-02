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
    indexbjtjs: "indexbjtjs", // 编辑推荐
    indexrmbds: "indexrmbds", // 热门榜单
    indexbzxs: "indexbzxs", // 本周新书
    indexjqxs: "indexjqxs", // 近期新书
    indexzswntjs: "indexzswntjs", // 专属为你推荐
    detaildatas: "detaildatas", // 首页详情
    xxhds: "xxhds", // 线下活动
    xxscs: "xxscs", // 心选商城
    soundlbts: "soundlbts", // 声音剧 轮播图
    soundeverydays: "soundeverydays", // 声音剧 每日珍藏图片 轮播图
    soundrecommends: "soundrecommends", // 声音剧 好剧推荐
    soundverticals: "soundverticals", // 声音剧 周边商城 竖
    llsreads: "llsreads", // 李雷慢读 当前在更
    llsreadrs: "llsreadrs", // 李雷慢读 编辑推荐
    todays: "todays", // 李雷慢读 今日限免
    talks: "talks", // 李雷慢读 谈话节目
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