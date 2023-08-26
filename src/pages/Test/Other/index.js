/**
 * 其他部分
 */
import React, { useState, useRef, useEffect } from "react";
import NavLeft from "../NavLeft";
import "./index.css";

const Other = () => {
  const [value, setValue] = useState(0);
  const inputRef = useRef();
  useEffect(() => {
    const timer = setInterval(() => {
      const val = inputRef?.current?.value;
      inputRef.current.value = +val + 1;
      setValue(value + 1);
      // console.log({ inputRefValuååe: inputRef.current.value });
    }, 1000);
    if (value > 10) {
      return () => clearInterval(timer);
    }
    // if (+inputRef?.current?.value > 10) {
    //   return () => clearInterval(timer);
    // }
    console.log({ inputRefValue2: inputRef.current.value });
    return () => clearInterval(timer);
  }, [value]);
  return (
    <div className="filter-wrap">
      <NavLeft />
      <div>
        <h1>滚动</h1>
        <div className="g-wrap">
          <div className="g-content" />
        </div>
        <h1>定时器中获取dom</h1>
        <input ref={inputRef} />
      </div>
    </div>
  );
};

export default Other;
