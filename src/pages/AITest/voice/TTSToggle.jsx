import { message } from "antd";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  CopyOutlined,
} from "@ant-design/icons";

export const TTSToggle = ({ item, isPlaying, onTTSClick }) => {
  return (
    <div className="msg-ai-btns">
      <button
        className={`msg-copy-btn ${isPlaying ? "playing" : ""}`}
        onClick={() => onTTSClick(item)}
        title={isPlaying ? "停止朗读" : "朗读回复"}
      >
        {isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
      </button>
      <button
        className="msg-copy-btn"
        onClick={() => {
          navigator.clipboard.writeText(item.content).then(
            () => message.success("已复制"),
            () => message.error("复制失败")
          );
        }}
        title="复制回复"
      >
        <CopyOutlined />
      </button>
    </div>
  );
};