import React from "react";
import { TextFolding } from "../../components/TextFolding";
import { EventCountdown } from "../../components/EventCountdown";
import TextEllipsis from "../../components/TextEllipsis";

function App() {
  return (
    <div className="App">
      <TextFolding
        text="卡高消费卡背影删掉疯狂国际化设计的咖啡杯个双方都赶不上看对方还不够舒适的方式地方就会感慨阿妈打卡高消费卡背影够舒适的方方就会感慨阿妈打卡高消费卡背影删掉疯狂国际化设计的咖啡杯个双方都赶不上看对方还不够舒适的方式地方就会感慨阿妈打卡高消费卡背"
        maxRow={4}
      />
      <hr />
      <TextEllipsis content="一是培养专家型监管队伍。应坚持将专业的事交给专业的人去做，引导考核工作向岗位精细化、干部专业化、工作方法创新化方向倾斜。二是注重调查研究，当好“哨兵”“参谋”。监管局“哨兵”“参谋”作用的发挥，离不开深入实际的调查研究，应坚持在调研中摸清问题的根源，精准反映问题的成因，提供有价值的材料。只有在源头上铲除问题，才能有效降低监管成本，提高监管效益。因此，在考核中应把调查研究工作及成果应用放在突出位置。三是侧重问题整改纠正。偏重考核对整改结果的重视，要坚持将监管成果的应用重点放在监管发现问题的整改当中。要坚持“查、督、帮、纠、改”五位一体，形成彻底排除监管问题的闭环管理" />
      <hr />
      <EventCountdown timer={9} />
    </div>
  );
}

export default App;
