// 实现n秒倒计时,初始显示n(来自props),每秒递减1,到0时停止倒计时,并显示"活动开始"使用函数组件+自定义hooks实现
// 加分项:使用TS编写
import React, { useState, useEffect, useRef } from "react";

export const EventCountdown = (props) => {
  const { timer } = props;
  const [n, setN] = useState(() => timer);
  const [show, setShow] = useState(false);
  let time = useRef(null);
  useEffect(() => {
    if (n === 0) {
      clearInterval(time);
      setShow(true);
    }
    if (n !== 0) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      time = setInterval(() => {
        setN(() => n - 1);
      }, 1000);
    }
  }, [n]);
  // console.log(n);
  return <div>活动倒计时：{show ? <div>活动开始</div> : n}</div>;
};
