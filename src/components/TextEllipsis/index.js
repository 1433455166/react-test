import styles from "./index.scss";
import React, { useState, useRef, Fragment, useLayoutEffect } from "react";

/**
 * 多行文本溢出显示省略号组件
 */
const TextEllipsis = ({ content, headerText }) => {
  const contentRef = useRef({});
  const [showAll, setShowAll] = useState(false);
  const [needHidden, setNeedHidden] = useState(false); // 超出4行需要隐藏
  const [isCompute, setIsCompute] = useState(false);
  const [n, setN] = useState(2);

  /**
   * @description: 处理content文案的点击展开收起
   * @return: null
   */
  const handleContent = (e) => {
    e.stopPropagation();
    setN(6);
    setShowAll(!showAll);
  };
  // 判断文本超出行数
  const isElementCollision = (ele, rowCount = 6, cssStyles, removeChild) => {
    if (!ele) {
      return false;
    }
    const clonedNode = ele.cloneNode(true);
    // 给clone的dom增加样式
    clonedNode.style.overflow = "visible";
    clonedNode.style.display = "inline-block";
    clonedNode.style.width = "auto";
    clonedNode.style.whiteSpace = "nowrap";
    clonedNode.style.visibility = "hidden";
    clonedNode.style.whiteSpace = "pre-wrap"; //支持换行
    // 将传入的css字体样式赋值
    if (cssStyles) {
      Object.keys(cssStyles).forEach((item) => {
        clonedNode.style[item] = cssStyles[item];
      });
    }

    // 给clone的dom增加id属性
    const _time = new Date().getTime();

    const containerID = `collision_node_id_${_time}`;

    clonedNode.setAttribute("id", containerID);

    const tmpNode = document.getElementById(containerID);
    let newNode = clonedNode;

    if (tmpNode) {
      document.body.replaceChild(clonedNode, tmpNode);
    } else {
      newNode = document.body.appendChild(clonedNode);
    }
    // 新增的dom宽度与原dom的宽度*限制行数做对比
    // 一行是25高度，根据样式TextEllipsis.scss的textContent的样式line-height: px2rem(50);
    const defaulltHeight = rowCount * 4;
    let differ = false;

    if (newNode.offsetHeight > defaulltHeight) {
      differ = true;
    }

    if (removeChild) {
      document.body.removeChild(newNode);
    }
    return differ;
  };

  useLayoutEffect(() => {
    const cssStyles = { fontWeight: "400" };

    const needHiddenValue = isElementCollision(
      contentRef.current,
      6,
      cssStyles,
      true
    );

    setNeedHidden(needHiddenValue);
    setIsCompute(true);
  }, [contentRef]);
  // const www = document.getElementsByClassName("textContent");
  // console.log({ webkitLineClamp: www[0].style });
  return (
    <div className={styles.textEllipsis}>
      <div style={{ opacity: isCompute ? 1 : 0 }}>
        <div
          ref={contentRef}
          className={`textContent ${
            !showAll && needHidden ? "hidden-text" : ""
          }`}
          n={n}
        >
          {headerText ? headerText() : null}
          {content}
        </div>
      </div>
      {!isCompute && (
        <Fragment>
          <div className={styles.bgLoad} />
          <div className={styles.bgLoad} />
        </Fragment>
      )}
      {isCompute && needHidden && (
        <button
          className={styles["content-btn"]}
          onClick={(e) => {
            handleContent(e);
          }}
        >
          {!showAll ? "全文" : "收起"}
        </button>
      )}
    </div>
  );
};
export default TextEllipsis;
