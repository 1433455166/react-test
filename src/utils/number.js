export function formatNumber(num, point = 1) {
    if (num < 10000) {
        return num.toString();
    } else if (num < 10000000) {
        // 将数字转换为“万”单位
        let formatted = (num / 10000).toFixed(point); // 保留一位小数
        return `${formatted}万`;
    } 
    // else if (num < 100000000) {
    //     // 将数字转换为“百万”单位
    //     let formatted = (num / 1000000).toFixed(1);
    //     return `${formatted}百万`;
    // } 
    else {
        // 将数字转换为“亿”单位
        let formatted = (num / 100000000).toFixed(point);
        return `${formatted}亿`;
    }
}