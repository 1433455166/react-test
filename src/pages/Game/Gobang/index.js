import React, { useRef, useState } from "react";
import "./index.css";
import { Card } from "antd";

const App = () => {
  const itemRef = useRef();
  const [isUserOne, setIsUserOne] = useState(false);
  const arr = (dom) => {
    const arr = [];
    for (let i = 1; i < 20; i++) {
      arr.push(dom);
    }
    return arr;
  };

  return (
    <div className="gobang">
      <div>
        <div className="gobang-title">五子棋</div>
        <Card
          style={{
            margin: "0 12px",
          }}
        >
          <table cellspacing="0" border="1">
            {arr(
              <tr>
                {arr(
                  <td>
                    <div
                      ref={itemRef}
                      className="gobang-item"
                      onClick={(e) => {
                        setIsUserOne(!isUserOne);
                        if (!e.target.style.backgroundColor) {
                          if (isUserOne) {
                            e.target.style.backgroundColor = "#00F";
                          } else {
                            e.target.style.backgroundColor = "#F00";
                          }
                        }
                      }}
                    />
                  </td>
                )}
              </tr>
            )}
          </table>
        </Card>
      </div>
    </div>
  );
};

export default App;
