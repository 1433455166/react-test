import React, { useState } from "react";
import "./index.css";
import LiftNav from "../LiftNav";
import { Card, Modal } from "antd";

const PIECE_COLOR = {
    red: 'red',
    blue: 'blue',
}

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
          content: `${subArray?.[0]?.backgroundColor}赢了`,
          onOk() {
            setIsUser(GobangArr);
          },
        });
        return true;
      }
    }
    return false;
  }

  return (
    <div className="gobang">
      <LiftNav />
      <div>
        <div className="gobang-title">五子棋</div>
        <Card
          style={{
            margin: "0 12px",
            background: 'bisque'
          }}
        >
          {isUser.map((Gobang, index) => {
            return (
              <div style={{ display: "flex" }}>
                {Gobang.map((go, idx) => {
                  return (
                    <div
                      style={{
                        background: go?.backgroundColor,
                        width: 16,
                        height: 16,
                        border: "1px solid #000",
                      }}
                      onClick={() => {
                        const arr = isUser.map((Gobang, inde) => {
                          if (inde === index)
                            return Gobang.map((go, id) => {
                              if (id === idx)
                                return {
                                  ...go,
                                  backgroundColor: color,
                                };
                              return go;
                            });
                          return Gobang;
                        });
                        if (!go.backgroundColor) {
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
                          const sortedArray = arr.map((_, i) =>
                            arr.map((row) => row[i])
                          );
                          sortedArray.forEach((isUse) => {
                            if (isConsecutiveSame(isUse, 5)) {
                              colFlag = true;
                            }
                          });
                          if (colFlag) return;

                          // 左下到右上斜对角
                          const isRightTop = (list, x, y) =>
                            list?.[x - 1]?.[y + 1];
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
                          const isRightButtom = (list, x, y) =>
                            list?.[x + 1]?.[y + 1];
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
                      }}
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
