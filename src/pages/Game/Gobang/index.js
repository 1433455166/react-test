import React, { useState } from "react";
import "./index.css";
import LiftNav from "../LiftNav";
import bgItem from "../../../components/svg/bgItem.svg";
import bgBorderItem from "../../../components/svg/bgBorderItem.svg";
import bgRadiusItem from "../../../components/svg/bgRadiusItem.svg";
import whiteItem from "../../../components/svg/whiteItem.svg";
import blackItem from "../../../components/svg/blackItem.svg";
import { Card, Modal } from "antd";

const PIECE_COLOR = {
    red: "red",
    blue: "blue",
};

const App = () => {
    const GobangArr = Array.from({ length: 36 }, (_, i) => i).map(
        (_val, index) => {
            return Array.from({ length: 36 }, (_, i) => i).map((_v, idx) => {
                return {
                    backgroundColor: undefined,
                    x: index,
                    y: idx,
                };
            });
        }
    );
    const [isUser, setIsUser] = useState(GobangArr);
    const [color, setColor] = useState(PIECE_COLOR.red);

    // 数组中是否有 n 个连续数据相同
    function isConsecutiveSame(arr, n) {
        if (arr.length < n) {
            return false;
        }

        for (let i = 0; i <= arr.length - n; i++) {
            const subArray = arr.slice(i, i + n);
            if (
                subArray.every(
                    (value) =>
                        value?.backgroundColor &&
                        value?.backgroundColor === subArray?.[0]?.backgroundColor
                )
            ) {
                Modal.success({
                    title: "game over",
                    content: `${subArray?.[0]?.backgroundColor === PIECE_COLOR.blue ? '白子' : '黑子'}赢了`,
                    onOk() {
                        // 确认清空棋盘
                        setIsUser(GobangArr);
                    },
                });
                return true;
            }
        }
        return false;
    }

    // 落子事件
    const pieceClick = (value, index, itemIndex) => {
        const arr = isUser.map((Gobang, inde) => {
            if (inde === index)
                return Gobang.map((go, id) => {
                    if (id === itemIndex)
                        return {
                            ...go,
                            backgroundColor: color,
                            backgroundImage: undefined
                        };
                    return go;
                });
            return Gobang;
        });
        if (!value.backgroundColor) {
            setIsUser(arr);
            setColor(color === PIECE_COLOR.red ? PIECE_COLOR.blue : PIECE_COLOR.red);

            // 横排
            let rowFlag = false;
            arr.forEach((isUse) => {
                if (isConsecutiveSame(isUse, 5)) {
                    rowFlag = true;
                }
            });
            if (rowFlag) return;

            // 竖排
            let colFlag = false;

            // 二维数组竖向排列
            const sortedArray = arr.map((_, i) => arr.map((row) => row[i]));

            sortedArray.forEach((isUse) => {
                if (isConsecutiveSame(isUse, 5)) {
                    colFlag = true;
                }
            });
            if (colFlag) return;

            // 左下到右上斜对角
            const isRightTop = (list, x, y) => list?.[x - 1]?.[y + 1];
            function convertToDiagonalArray(arr) {
                const result = [];
                for (let i = 0; i < arr?.length; i++) {
                    const iArr = arr[i];
                    const rightTopValue = [iArr[0]];
                    const rightTopFn = (list, x, y) => {
                        if (isRightTop(list, x, y)) {
                            rightTopValue.push(isRightTop(list, x, y));
                            if (isRightTop(list, x - 1, y + 1)) {
                                rightTopFn(list, x - 1, y + 1);
                            }
                        }
                    };
                    rightTopFn(arr, i, 0);
                    result.push(rightTopValue);
                }
                for (let i = 0; i < arr?.length - 1; i++) {
                    const iArr = arr[arr?.length - 1];
                    const rightTopValue = [iArr[i + 1]];
                    const rightTopFn = (list, x, y) => {
                        if (isRightTop(list, x, y)) {
                            rightTopValue.push(isRightTop(list, x, y));
                            if (isRightTop(list, x - 1, y + 1)) {
                                rightTopFn(list, x - 1, y + 1);
                            }
                        }
                    };
                    rightTopFn(arr, arr?.length - 1, i + 1);
                    result.push(rightTopValue);
                }
                return result;
            }
            const output = convertToDiagonalArray(arr);
            let rightTopFlag = false;
            output.forEach((isUse) => {
                if (isConsecutiveSame(isUse, 5)) {
                    rightTopFlag = true;
                }
            });
            if (rightTopFlag) return;

            // 左上到右下斜对角
            const isRightButtom = (list, x, y) => list?.[x + 1]?.[y + 1];
            function toRightButtomFn(arr) {
                const result = [];
                for (let i = 0; i < arr?.length; i++) {
                    const iArr = arr[i];
                    const rightTopValue = [iArr[0]];
                    const rightButtomFn = (list, x, y) => {
                        if (isRightButtom(list, x, y)) {
                            rightTopValue.push(isRightButtom(list, x, y));
                            if (isRightButtom(list, x + 1, y + 1)) {
                                rightButtomFn(list, x + 1, y + 1);
                            }
                        }
                    };
                    rightButtomFn(arr, i, 0);
                    result.push(rightTopValue);
                }
                for (let i = 0; i < arr?.length - 1; i++) {
                    const iArr = arr[0];
                    const rightTopValue = [iArr[i + 1]];
                    const rightButtomFn = (list, x, y) => {
                        if (isRightButtom(list, x, y)) {
                            rightTopValue.push(isRightButtom(list, x, y));
                            if (isRightButtom(list, x + 1, y + 1)) {
                                rightButtomFn(list, x + 1, y + 1);
                            }
                        }
                    };
                    rightButtomFn(arr, 0, i + 1);
                    result.push(rightTopValue);
                }
                return result;
            }
            const RightButtomValue = toRightButtomFn(arr);
            let rightButtomFlag = false;
            RightButtomValue.forEach((isUse) => {
                if (isConsecutiveSame(isUse, 5)) {
                    rightButtomFlag = true;
                }
            });
            if (rightButtomFlag) return;
        }
    };

    return (
        <div className="gobang">
            <LiftNav />
            <div>
                <div className="gobang-title">五子棋</div>
                <Card
                    style={{
                        margin: "0 12px 12px",
                        background: "antiquewhite",
                    }}
                >
                    {isUser.map((Gobang, index) => {
                        return (
                            <div style={{ display: "flex" }}>
                                {Gobang.map((go, idx) => {
                                    const background = () => {
                                        if (idx === 0 && index === 0) {
                                            return {
                                                backgroundImage: `url(${bgRadiusItem})`
                                            }
                                        } else if (idx === 0 && index === isUser?.length - 1) {
                                            return {
                                                backgroundImage: `url(${bgRadiusItem})`,
                                                transform: 'rotate(270deg)'
                                            }
                                        } else if (index === 0 && idx === Gobang?.length - 1) {
                                            return {
                                                backgroundImage: `url(${bgRadiusItem})`,
                                                transform: 'rotate(90deg)'
                                            }
                                        } else if (index === isUser?.length - 1 && idx === Gobang?.length - 1) {
                                            return {
                                                backgroundImage: `url(${bgRadiusItem})`,
                                                transform: 'rotate(180deg)'
                                            }
                                        } else if (idx === 0) {
                                            return {
                                                backgroundImage: `url(${bgBorderItem})`
                                            }
                                        } else if (index === 0) {
                                            return {
                                                backgroundImage: `url(${bgBorderItem})`,
                                                transform: 'rotate(90deg)'
                                            }
                                        } else if (index === isUser?.length - 1) {
                                            return {
                                                backgroundImage: `url(${bgBorderItem})`,
                                                transform: 'rotate(270deg)'
                                            }
                                        } else if (idx === Gobang?.length - 1) {
                                            return {
                                                backgroundImage: `url(${bgBorderItem})`,
                                                transform: 'rotate(180deg)'
                                            }
                                        }
                                        return {
                                            backgroundImage: `url(${bgItem})`
                                        }
                                    }
                                    const style = background()
                                    return (
                                        <div
                                            style={{
                                                ...style,
                                                backgroundImage: go?.backgroundColor === PIECE_COLOR.blue ? `url(${whiteItem})` : go?.backgroundColor === PIECE_COLOR.red ? `url(${blackItem})` : style?.backgroundImage,
                                                width: 20,
                                                height: 20,
                                                borderRadius: '50% 50%'
                                            }}
                                            onClick={() => pieceClick(go, index, idx)}
                                        />
                                    );
                                })}
                            </div>
                        );
                    })}
                </Card>
            </div>
        </div>
    );
};

export default App;
