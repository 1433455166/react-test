import { FileOutlined, UserOutlined, RobotOutlined, DownloadOutlined, CopyOutlined } from "@ant-design/icons";
import { Avatar, message } from "antd";
import { MarkdownView } from "./MarkdownView";
import { TTSToggle } from "../voice";

export const MessageBubble = ({
  item,
  isTtsPlaying,
  onTTSClick,
  modes = [],
  presetPrompts = {},
}) => {
  const isUser = item.type === "user";

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(
      () => message.success("已复制"),
      () => message.error("复制失败")
    );
  };

  const handleDownload = (url, index) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-image-${item.id}-${index}.png`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={`message-item ${item.type}`}>
      <Avatar
        icon={isUser ? <UserOutlined /> : <RobotOutlined />}
        className={`avatar ${item.type}`}
      />
      <div className="message-content">
        {isUser ? (
          <div className="message-text">
            {item.attachments && item.attachments.length > 0 && (
              <div className="msg-attachments">
                {item.attachments.map((att, idx) => (
                  <div key={idx} className="msg-attachment">
                    {att.type === "image" ? (
                      <img src={att.url} alt={att.name} />
                    ) : (
                      <div className="file-attachment">
                        <FileOutlined />
                        <span>{att.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {item.content && <span>{item.content}</span>}
          </div>
        ) : (
          <>
            {item.images && item.images.length > 0 && (
              <div className="ai-generated-images">
                {item.images.map((imgUrl, idx) => (
                  <div key={idx} className="ai-image-wrapper">
                    <img src={imgUrl} alt={`AI生成图片 ${idx + 1}`} />
                    <div className="ai-image-actions">
                      <button
                        className="ai-image-btn"
                        onClick={() => handleDownload(imgUrl, idx)}
                        title="下载图片"
                      >
                        <DownloadOutlined />
                      </button>
                      <a
                        className="ai-image-btn"
                        href={imgUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="在新标签页打开"
                      >
                        查看
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {item.content && <MarkdownView content={item.content} />}
          </>
        )}

        <div className="message-actions">
          <div className="message-time">
            {item.mode && (
              <span className="msg-tag">
                {modes.find((m) => m.key === item.mode)?.label}
              </span>
            )}
            {item.localMode && <span className="msg-tag local">本地</span>}
            {item.preset && (
              <span className="msg-tag preset">{presetPrompts[item.preset]?.title}</span>
            )}
            <span>{item.timestamp}</span>
          </div>
          {isUser && item.content ? (
            <button
              className="msg-copy-btn"
              onClick={() => handleCopy(item.content)}
              title="复制"
            >
              <CopyOutlined />
            </button>
          ) : null}
          {!isUser && (
            <TTSToggle
              item={item}
              isPlaying={isTtsPlaying}
              onTTSClick={onTTSClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};