// 使用React实现一个文本折叠组件
// - 当传入文本实际渲染行数小于maxRow时文本正常展示
// - 当传入文本实际渲染行数大于maxRow时展示【展开】按钮,点击【展开】按钮展示全部文本
// - 以实现功能为主,样式无需还原度很高
// 入参
// interface IProps {
//     text:string;//文本内容
//     maxRow:number;//最大不折叠行数
// }
import React, { useState } from "react";

export const TextFolding = (props) => {
  // const { text, maxRow } = props;
  const { text } = props;
  const [show, setShow] = useState(!!text || false);
  const onClick = () => {
    setShow(false);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: 800,
          fontSize: 28,
          overflow: "hidden" /** 隐藏超出的内容 **/,
          wordBreak: "break-all",
          textOverflow: "ellipsis" /** 多行 **/,
          display: "-webkit-box" /** 对象作为伸缩盒子模型显示 **/,
          webkitBoxOrient:
            "vertical" /** 设置或检索伸缩盒对象的子元素的排列方式 **/,
          webkitLineClamp: 2 /** 显示的行数 **/,
        }}
      >
        {text}
      </div>
      {/* <textarea rows={maxRow}>{text}</textarea> */}
      {show && <button onClick={onClick}>展开</button>}
    </div>
  );
};
