// 生成唯一 17 位的字符串
const getUniqueId = () => Date.now() + (Math.random().toString(36).substring(2, 6));
// const getUniqueId = () => Date.now() + (Math.random().toString(36).substring(4));

export default getUniqueId