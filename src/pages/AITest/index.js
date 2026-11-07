import React, { useState, useEffect, useRef, useCallback } from "react";
import { Select, Spin, Dropdown, message, Modal } from "antd";
import {
  SendOutlined,
  RobotOutlined,
  CloudServerOutlined,
  PlusOutlined,
  SoundOutlined,
  MoreOutlined,
  EnvironmentOutlined,
  VideoCameraOutlined,
  FileOutlined,
  CloseOutlined,
  PictureOutlined,
  BulbOutlined,
  BulbFilled,
  LoadingOutlined,
  AudioOutlined,
  AudioMutedOutlined,
} from "@ant-design/icons";
import { useVoice, VoiceSettings } from "./voice";
import { MessageBubble } from "./components";
import { useSendMessage } from "./utils/useSendMessage";
import { PRESET_PROMPTS } from "./utils/constants";
import "./index.css";

const { Option } = Select;

const IconBolt = () => (
  <svg viewBox="0 0 1024 1024" width="14" height="14" fill="currentColor">
    <path d="M376 464h144c4.4 0 8-3.6 8-8 0-1.9-0.7-3.7-2-5.2l-156-212c-1.4-1.9-3.6-3-6-3-4.4 0-8 3.6-8 8v136H212c-4.4 0-8 3.6-8 8 0 1.9 0.7 3.7 2 5.2l156 212c1.4 1.9 3.6 3 6 3 4.4 0 8-3.6 8-8V464z" />
  </svg>
);

const IconSparkles = () => (
  <svg viewBox="0 0 1024 1024" width="14" height="14" fill="currentColor">
    <path d="M512 64a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V96a32 32 0 0 1 32-32zm0 672a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V768a32 32 0 0 1 32-32zM64 512a32 32 0 0 1 32-32h192a32 32 0 1 1 0 64H96a32 32 0 0 1-32-32zm672 0a32 32 0 0 1 32-32h192a32 32 0 1 1 0 64H768a32 32 0 0 1-32-32z" />
  </svg>
);

const IconPpt = () => (
  <svg viewBox="0 0 1024 1024" width="14" height="14" fill="currentColor">
    <path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7z" />
  </svg>
);

const IconMenu = () => (
  <svg viewBox="0 0 1024 1024" width="14" height="14" fill="currentColor">
    <path d="M128 256h768v86h-768zM128 477h768v86h-768zM128 698h768v86h-768z" />
  </svg>
);

const TOPICS = [
  { key: "general", label: "通用对话", theme: "auto" },
  { key: "work", label: "工作助理", theme: "light" },
  { key: "study", label: "学习助手", theme: "light" },
  { key: "code", label: "代码助手", theme: "dark" },
  { key: "creative", label: "创意写作", theme: "auto" },
];

const MODES = [
  { key: "fast", label: "快速", icon: <IconBolt /> },
  { key: "advanced", label: "进阶", icon: <IconSparkles /> },
  { key: "thinking", label: "思考", icon: <IconSparkles /> },
];

const apiOptions = [
    {
    value: "http://154.84.59.41:8317/",
    label: "云服务 cliproxyapi",
    description: "http://154.84.59.41:8317/",
    apiKey: "sk-CSjJcWq1oCckcpwd5eg8koZlPXh1yN8GjR3rMbatApJUKAwt"
  },
  {
    value: "http://localhost:8317/",
    label: "本地 cliproxyapi",
    description: "http://localhost:8317/",
    apiKey: "sk-mU8oCBy3Va4vZ0ttpegWaq8dB9eyEsMTvW5ojnPLP3JkKPCG"
  },
  {
    value: "",
    label: "本地Grok2API",
    description: "http://192.168.31.106:8000/v1",
    apiKey: "g2a_5a99e9e12ba3_SdSk2Ua4ijYZVApy-x0eWiAnrn7b-9cK"
  },
];

const AITest = () => {
  const [selectedApi, setSelectedApi] = useState(apiOptions?.[0]);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [selectedMode, setSelectedMode] = useState(MODES[0].key);
  const [systemTheme, setSystemTheme] = useState("light");
  const [themeOverride, setThemeOverride] = useState(null);

  const [isLocalMode, setIsLocalMode] = useState(false);
  const [activePreset, setActivePreset] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [moreMenuVisible, setMoreMenuVisible] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSendRef = useRef(null);

  const voice = useVoice({
    onSend: (text) => handleSendRef.current?.(text),
    onFillInput: (text) => setInputValue(text),
  });

  const {
    isRecording,
    voiceChatMode,
    ttsPlayingId,
    ttsVoices,
    selectedTtsVoice,
    setSelectedTtsVoice,
    startVoiceInput,
    toggleVoiceChat,
    handleTTSClick,
    cleanup: voiceCleanup,
    handleAIReplyDone,
  } = voice;

  const { handleSend, abortControllerRef } = useSendMessage({
    inputValue,
    attachments,
    selectedApi,
    selectedModel,
    selectedMode,
    isLocalMode,
    activePreset,
    messages,
    setInputValue,
    setAttachments,
    setActivePreset,
    setIsLoading,
    setMessages,
    onReplyDone: handleAIReplyDone,
  });

  handleSendRef.current = handleSend;

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const darkModeMq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setSystemTheme(e.matches ? "dark" : "light");
    handler(darkModeMq);
    darkModeMq.addEventListener("change", handler);
    return () => {
      darkModeMq.removeEventListener("change", handler);
      abortControllerRef.current?.abort();
      voiceCleanup();
    };
  }, []);

  const resolvedTheme = (() => {
    if (themeOverride) return themeOverride;
    if (selectedTopic.theme === "auto") return systemTheme;
    return selectedTopic.theme;
  })();

  const currentThemeSource = (() => {
    if (themeOverride) return `手动: ${themeOverride === "dark" ? "深色" : "浅色"}`;
    if (selectedTopic.theme === "auto") return `跟随系统(${systemTheme === "dark" ? "深色" : "浅色"})`;
    return `主题预设: ${selectedTopic.theme === "dark" ? "深色" : "浅色"}`;
  })();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    if (selectedApi) {
      fetchModels();
    } else {
      setModels([]);
      setSelectedModel("");
    }
  }, [selectedApi]);

  const fetchModels = async () => {
    setIsLoadingModels(true);
    try {
      const response = await fetch(`${selectedApi.value}v1/models`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${selectedApi.apiKey}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setModels(data.data?.map((model) => ({
          id: model.id,
          name: model.name || model.id,
        })) || []);
      } else {
        setModels([]);
        message.warning(`获取模型列表失败（HTTP ${response.status}），请检查API服务是否可用`);
      }
    } catch (error) {
      setModels([]);
      message.warning("获取模型列表失败，请检查API服务是否可用");
    } finally {
      setIsLoadingModels(false);
    }
  };

  const handleStop = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  };

  const handleApiChange = (value) => {
    const apiOption = apiOptions.find((option) => option.value === value);
    setSelectedApi(apiOption);
    setSelectedModel("");
    setMessages([]);
  };

  const handleModelChange = (value) => {
    setSelectedModel(value);
    setMessages([]);
  };

  // 下拉打开时若列表为空（此前拉取失败）则自动重试
  const handleModelsDropdownOpen = (open) => {
    if (open && selectedApi && models.length === 0 && !isLoadingModels) {
      fetchModels();
    }
  };

  const autoResize = () => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newAttachments = files.map((file) => ({
      name: file.name,
      type: file.type.startsWith("image/") ? "image" : "file",
      url: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      size: file.size,
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
    message.success(`已添加 ${files.length} 个文件`);
    e.target.value = "";
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleLocalMode = () => {
    setIsLocalMode((prev) => {
      const next = !prev;
      message.info(next ? "已开启本地电脑模式，AI可访问本地文件" : "已关闭本地电脑模式");
      return next;
    });
  };

  const handlePresetClick = (presetKey) => {
    const preset = PRESET_PROMPTS[presetKey];
    if (!preset) return;

    if (activePreset === presetKey) {
      setActivePreset(null);
      setInputValue("");
    } else {
      setActivePreset(presetKey);
      setInputValue(preset.placeholder);
      message.success(`已切换到${preset.title}模式，请输入具体需求`);
    }
    setTimeout(() => {
      textareaRef.current?.focus();
      autoResize();
    }, 100);
  };


  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent?.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const modeMenuItems = MODES.map((m) => ({
    key: m.key,
    label: (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        {m.icon} {m.label}
      </span>
    ),
    onClick: () => setSelectedMode(m.key),
  }));

  const currentMode = MODES.find((m) => m.key === selectedMode);
  const modeLabel = currentMode?.label;
  const modeIcon = currentMode?.icon;

  const moreMenuItems = [
    {
      key: "clear",
      label: "清空对话",
      onClick: () => {
        Modal.confirm({
          title: "确认清空",
          content: "确定要清空所有对话记录吗？",
          onOk: () => {
            setMessages([]);
            message.success("对话已清空");
          },
        });
      },
    },
    {
      key: "export",
      label: "导出对话",
      onClick: () => {
        const text = messages
          .map((m) => `[${m.timestamp}] ${m.type === "user" ? "我" : "AI"}: ${m.content}`)
          .join("\n\n");
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `AI对话_${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        message.success("对话已导出");
      },
    },
    {
      key: "copy-last",
      label: "复制最后回复",
      onClick: () => {
        const lastAi = [...messages].reverse().find((m) => m.type === "ai");
        if (lastAi) {
          navigator.clipboard.writeText(lastAi.content).then(
            () => message.success("已复制到剪贴板"),
            () => message.error("复制失败")
          );
        } else {
          message.warning("没有可复制的内容");
        }
      },
    },
    { type: "divider" },
    {
      key: "github",
      label: "关于",
      onClick: () => {
        Modal.info({
          title: "AI 对话助手",
          content: "版本 v1.0\n\n支持多主题、语音输入、文件上传等功能。",
        });
      },
    },
  ];

  return (
    <div className={`ai-test theme-${resolvedTheme}`}>
      <div className="ai-page-header">
        <div className="ai-title-wrap">
          <h1 className="ai-main-title">AI 对话助手</h1>
          <span className="ai-theme-indicator" title={currentThemeSource}>
            {resolvedTheme === "dark" ? "🌙" : "☀️"}
            {!themeOverride && selectedTopic.theme === "auto" && <span className="theme-auto-tag">自动</span>}
          </span>
          <button
            className={`theme-toggle-btn ${themeOverride ? "overridden" : ""}`}
            onClick={() => {
              if (themeOverride === null) {
                setThemeOverride(resolvedTheme === "dark" ? "light" : "dark");
              } else {
                setThemeOverride(null);
              }
            }}
            title={`${themeOverride ? "点击恢复自动" : "点击切换主题"}\n当前: ${currentThemeSource}`}
          >
            {themeOverride === "dark" || (!themeOverride && resolvedTheme === "dark")
              ? <BulbOutlined />
              : <BulbFilled />}
          </button>
          <div className="mode-badges">
            {activePreset && (
              <span className="mode-badge preset-badge">
                {PRESET_PROMPTS[activePreset].badge}
              </span>
            )}
            {isLocalMode && (
              <span className="mode-badge local-badge">
                <EnvironmentOutlined /> 本地电脑
              </span>
            )}
            {voiceChatMode && (
              <span className="mode-badge voice-chat-badge">
                <AudioOutlined /> 语音对话
              </span>
            )}
          </div>
        </div>

        <div className="ai-config-row">
          <div className="config-item">
            <label>主题场景：</label>
            <Select
              value={selectedTopic.key}
              onChange={(val) => {
                const topic = TOPICS.find((t) => t.key === val);
                setSelectedTopic(topic);
                setThemeOverride(null);
              }}
              style={{ width: 160 }}
            >
              {TOPICS.map((t) => (
                <Option key={t.key} value={t.key}>
                  <span>{t.label}</span>
                  <span className="theme-tag">
                    ({t.theme === "auto" ? "跟随系统" : t.theme === "dark" ? "深色" : "浅色"})
                  </span>
                </Option>
              ))}
            </Select>
          </div>

          <div className="config-item">
            <label>API：</label>
            <Select
              value={selectedApi?.value}
              onChange={handleApiChange}
              style={{ width: 240 }}
              placeholder="请选择API服务"
              optionLabelProp="label"
            >
              {apiOptions.map((option) => (
                <Option key={option.value} value={option.value} label={option.label}>
                  <div>{option.label}</div>
                  <div className="option-description">{option.description}</div>
                </Option>
              ))}
            </Select>
          </div>

          {selectedApi && (
            <div className="config-item">
              <label>模型：</label>
              <Select
                value={selectedModel}
                onChange={handleModelChange}
                onOpenChange={handleModelsDropdownOpen}
                style={{ width: 200 }}
                placeholder="请选择AI模型"
                loading={isLoadingModels}
              >
                {models.map((model) => (
                  <Option key={model.id} value={model.id}>
                    {model.name}
                  </Option>
                ))}
              </Select>
              {isLoadingModels && <Spin size="small" className="loading-spin" />}
            </div>
          )}

          {selectedApi && (
            <VoiceSettings
              voices={ttsVoices}
              value={selectedTtsVoice}
              onChange={setSelectedTtsVoice}
            />
          )}
        </div>
      </div>

      {selectedApi && selectedModel ? (
        <div className="chat-container">
          <div className="chat-messages" ref={messagesEndRef}>
            {messages.length === 0 && (
              <div className="chat-empty">
                <RobotOutlined className="empty-icon" />
                <p className="empty-title">你好，我是 AI 助手</p>
                <p className="empty-desc">有什么可以帮你的吗？试试下面的输入框吧～</p>
              </div>
            )}
            {messages.map((item) => (
              <MessageBubble
                key={item.id}
                item={item}
                modes={MODES}
                presetPrompts={PRESET_PROMPTS}
                isTtsPlaying={ttsPlayingId === item.id}
                onTTSClick={handleTTSClick}
              />
            ))}
            {isLoading && (
              <div className="loading-message">
                <LoadingOutlined />
                <span>AI正在思考...</span>
              </div>
            )}
          </div>

          <div className="chat-footer">
            {attachments.length > 0 && (
              <div className="attachment-preview">
                {attachments.map((att, idx) => (
                  <div key={idx} className="attachment-item">
                    {att.type === "image" ? (
                      <img src={att.url} alt={att.name} />
                    ) : (
                      <div className="file-icon"><FileOutlined /></div>
                    )}
                    <span className="attachment-name">{att.name}</span>
                    <button
                      className="attachment-remove"
                      onClick={() => removeAttachment(idx)}
                    >
                      <CloseOutlined />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="quick-actions-bar">
              <button className="quick-action-btn" title="上传图片/文件" onClick={handleUploadClick}>
                <PlusOutlined />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt,.json"
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />

              <Dropdown menu={{ items: modeMenuItems }} trigger={["click"]}>
                <button className="quick-action-btn mode-btn">
                  {modeIcon}
                  <span>{modeLabel}</span>
                  <MoreOutlined className="chev" />
                </button>
              </Dropdown>

              <button
                className={`quick-action-btn ${isLocalMode ? "local-tag" : ""}`}
                title="本地电脑"
                onClick={toggleLocalMode}
              >
                <EnvironmentOutlined />
                <span>本地电脑</span>
              </button>

              <button
                className={`quick-action-btn ${activePreset === "ppt" ? "active-preset" : ""}`}
                title="PPT创作"
                onClick={() => handlePresetClick("ppt")}
              >
                <IconPpt />
                <span>PPT创作</span>
              </button>

              <button
                className={`quick-action-btn ${activePreset === "video" ? "active-preset" : ""}`}
                title="AI生视频"
                onClick={() => handlePresetClick("video")}
              >
                <VideoCameraOutlined />
                <span>AI生视频</span>
              </button>

              <button
                className={`quick-action-btn ${activePreset === "image" ? "active-preset" : ""}`}
                title="AI生图"
                onClick={() => handlePresetClick("image")}
              >
                <PictureOutlined />
                <span>AI生图</span>
              </button>

              <Dropdown
                menu={{ items: moreMenuItems }}
                trigger={["click"]}
                open={moreMenuVisible}
                onOpenChange={(v) => setMoreMenuVisible(v)}
              >
                <button className="quick-action-btn" title="更多功能">
                  <IconMenu />
                  <span>更多</span>
                </button>
              </Dropdown>

              <div className="spacer" />

              <button
                className={`quick-action-btn icon-only voice-btn ${isRecording ? "recording" : ""}`}
                title={isRecording ? "停止录音" : "语音输入"}
                onClick={startVoiceInput}
              >
                <SoundOutlined />
              </button>

              <button
                className={`quick-action-btn voice-chat-btn ${voiceChatMode ? "active" : ""}`}
                title={voiceChatMode ? "关闭语音对话" : "开启语音对话模式"}
                onClick={() => toggleVoiceChat({
                  canStart: () => {
                    if (isLoading) { message.warning("AI 正在回复，请稍候"); return false; }
                    if (!selectedModel) { message.warning("请先选择模型"); return false; }
                    return true;
                  },
                })}
              >
                {voiceChatMode ? <AudioMutedOutlined /> : <AudioOutlined />}
                <span>{voiceChatMode ? "关闭语音对话" : "语音对话"}</span>
              </button>
            </div>

            <div className="chat-input-wrapper">
              <textarea
                ref={textareaRef}
                className="chat-textarea"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  autoResize();
                }}
                onKeyDown={handleKeyDown}
                placeholder={isRecording ? "正在聆听，请说话..." : "尽管问，带图也行"}
                disabled={isLoading}
                rows={1}
              />
              <button
                className={`send-btn stop-btn ${isLoading ? "active" : ""}`}
                onClick={handleStop}
                disabled={!isLoading}
                title="停止生成"
                style={{ display: isLoading ? "flex" : "none" }}
              >
                <CloseOutlined />
              </button>
              <button
                className={`send-btn ${inputValue.trim() && !isLoading ? "active" : ""}`}
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isLoading}
                title="发送"
                style={{ display: isLoading ? "none" : "flex" }}
              >
                <SendOutlined />
              </button>
            </div>

            <p className="chat-disclaimer">
              内容由AI生成，可能不准确，请仔细甄别
            </p>
          </div>
        </div>
      ) : (
        <div className="no-selection">
          <CloudServerOutlined style={{ fontSize: 48, color: "var(--text-secondary)" }} />
          <p>{!selectedApi ? "请先选择API服务" : "请选择AI模型"}</p>
        </div>
      )}
    </div>
  );
};

export default AITest;