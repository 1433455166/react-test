import dayjs from "dayjs";

// 时间转时间戳
export const timeStrToStamp = (date) => {
    return dayjs(date).valueOf();
}