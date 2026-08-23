import React, { useState, useEffect, useRef, useCallback } from "react";
import { Select, Avatar, Spin, Dropdown, message, Modal } from "antd";
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  CloudServerOutlined,
  PlusOutlined,
  SoundOutlined,
  MoreOutlined,
  EnvironmentOutlined,
  FileImageOutlined,
  VideoCameraOutlined,
  FileOutlined,
  CloseOutlined,
  DeleteOutlined,
  PictureOutlined,
} from "@ant-design/icons";
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

const PRESET_PROMPTS = {
  ppt: {
    title: "PPT创作",
    placeholder: "请帮我生成一份关于【主题】的PPT大纲，包含标题、副标题和每页要点...",
    badge: "PPT模式",
  },
  video: {
    title: "AI生视频",
    placeholder: "请帮我生成一段视频脚本，主题是【描述视频内容和风格】...",
    badge: "视频模式",
  },
  image: {
    title: "AI生图",
    placeholder: "请帮我生成一幅图片的描述词，要求【描述画面、风格、色调】...",
    badge: "绘图模式",
  },
};

function renderInline(text) {
  const nodes = [];
  const regex = /(\*\*[^*]+\*\*)|(\*[^*]+\*)|(`[^`]+`)|(\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith("`")) {
      nodes.push(<code key={key++}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith("[")) {
      const linkMatch = /\[([^\]]+)\]\(([^)]+)\)/.exec(token);
      if (linkMatch) {
        nodes.push(
          <a key={key++} href={linkMatch[2]} target="_blank" rel="noopener noreferrer">
            {linkMatch[1]}
          </a>
        );
      }
    } else if (token.startsWith("*")) {
      nodes.push(<em key={key++}>{token.slice(1, -1)}</em>);
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

function parseMarkdown(md) {
  const lines = md.split("\n");
  const blocks = [];
  let i = 0;
  let listKey = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (/^#{1,6}\s/.test(line)) {
      const level = line.match(/^(#{1,6})\s/)[1].length;
      const text = line.slice(level);
      const Tag = `h${level}`;
      blocks.push(<Tag key={`h-${i}`}>{renderInline(text)}</Tag>);
      i++;
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      blocks.push(<hr key={`hr-${i}`} />);
      i++;
      continue;
    }

    if (/^>\s/.test(line)) {
      const quoteLines = [];
      while (i < lines.length && /^>\s/.test(lines[i])) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      blocks.push(
        <blockquote key={`q-${i}`}>
          {quoteLines.map((q, idx) => (
            <p key={idx}>{renderInline(q)}</p>
          ))}
        </blockquote>
      );
      continue;
    }

    if (/^\s*[-*+]\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*+]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*+]\s/, ""));
        i++;
      }
      blocks.push(
        <ul key={`ul-${listKey++}`}>
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\s*\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s/, ""));
        i++;
      }
      blocks.push(
        <ol key={`ol-${listKey++}`}>
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    const paraLines = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^#{1,6}\s/.test(lines[i]) &&
      !/^---+$/.test(lines[i].trim()) &&
      !/^>\s/.test(lines[i]) &&
      !/^\s*[-*+]\s/.test(lines[i]) &&
      !/^\s*\d+\.\s/.test(lines[i])
    ) {
      paraLines.push(lines[i]);
      i++;
    }

    blocks.push(
      <p key={`p-${i}`}>{renderInline(paraLines.join(" "))}</p>
    );
  }

  return blocks;
}

const MessageContent = ({ item }) => {
  if (item.type === "user") {
    return (
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
    );
  }
  return (
    <div className="message-text markdown-body">
      {parseMarkdown(item.content)}
    </div>
  );
};

const apiOptions = [
  {
    value: "http://localhost:8317/",
    label: "本地 cliproxyapi",
    description: "http://localhost:8317/",
    apiKey: "sk-mU8oCBy3Va4vZ0ttpegWaq8dB9eyEsMTvW5ojnPLP3JkKPCG"
  },
  {
    value: "http://localhost:8000/",
    label: "本地Grok2API",
    description: "http://localhost:8000/",
    apiKey: "vlv1TRJV4zByXMub"
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

  const [isLocalMode, setIsLocalMode] = useState(false);
  const [activePreset, setActivePreset] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [moreMenuVisible, setMoreMenuVisible] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

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
    return () => darkModeMq.removeEventListener("change", handler);
  }, []);

  const resolvedTheme = (() => {
    if (selectedTopic.theme === "auto") return systemTheme;
    return selectedTopic.theme;
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
      }
    } catch (error) {
      setModels([]);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const handleApiChange = (value) => {
    const apiOption = apiOptions.find((option) => option.value === value);
    setSelectedApi(apiOption);
    setMessages([]);
  };

  const handleModelChange = (value) => {
    setSelectedModel(value);
    setMessages([]);
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

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      Modal.warning({
        title: "语音输入",
        content: "当前浏览器不支持语音输入功能，请使用 Chrome 或 Edge 浏览器。",
      });
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "zh-CN";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsRecording(true);
      message.loading({ content: "正在聆听...", key: "voice", duration: 0 });
    };

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInputValue((prev) => (prev ? prev + transcript : transcript));
      autoResize();
    };

    recognition.onerror = (event) => {
      console.log("语音识别错误:", event.error);
      setIsRecording(false);
      message.error("语音识别失败，请重试");
    };

    recognition.onend = () => {
      setIsRecording(false);
      message.destroy("voice");
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !selectedApi || !selectedModel) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString(),
      attachments: attachments.length > 0 ? [...attachments] : undefined,
      mode: selectedMode,
      localMode: isLocalMode,
      preset: activePreset,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setAttachments([]);
    setIsLoading(true);

    const aiMessageId = Date.now() + 1;
    let aiContent = "";

    try {
      const response = await fetch(`${selectedApi.value}v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${selectedApi.apiKey}`,
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            {
              role: "system",
              content: `当前模式: ${selectedMode}${isLocalMode ? "，本地电脑已接入" : ""}${activePreset ? `，任务类型: ${PRESET_PROMPTS[activePreset].title}` : ""}。请根据用户输入提供相应服务。`
            },
            { role: "user", content: inputValue }
          ],
          stream: true
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("event: error")) continue;

          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6);
            if (dataStr === "[DONE]") break;

            try {
              const data = JSON.parse(dataStr);
              if (data.error) throw new Error(data.error.message || "API请求失败");

              const content = data.choices?.[0]?.delta?.content;
              if (content !== undefined) {
                aiContent += content;
                setMessages((prev) => {
                  const aiIndex = prev.findIndex((msg) => msg.id === aiMessageId);
                  if (aiIndex >= 0) {
                    const newMessages = [...prev];
                    newMessages[aiIndex] = {
                      id: aiMessageId,
                      type: "ai",
                      content: aiContent,
                      timestamp: new Date().toLocaleTimeString(),
                    };
                    return newMessages;
                  } else {
                    return [
                      ...prev,
                      {
                        id: aiMessageId,
                        type: "ai",
                        content: aiContent,
                        timestamp: new Date().toLocaleTimeString(),
                      },
                    ];
                  }
                });
              }
            } catch (e) {
              console.log("JSON parse error:", e);
              throw e;
            }
          }
        }
      }
    } catch (error) {
      console.log("error", error);
      let errorMessage = "抱歉，暂时无法连接到AI服务。";

      if (error.message?.includes("TLS") || error.message?.includes("SSL")) {
        errorMessage = "SSL/TLS连接失败，请检查网络环境或尝试使用HTTP协议。";
      } else if (error.message?.includes("403")) {
        errorMessage = "API密钥无效或权限不足，请检查密钥配置。";
      } else if (error.message) {
        errorMessage = `请求失败: ${error.message}`;
      }

      if (!aiContent) {
        setMessages((prev) => [
          ...prev,
          {
            id: aiMessageId,
            type: "ai",
            content: errorMessage,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
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
          <span className="ai-theme-indicator">
            {resolvedTheme === "dark" ? "🌙 深色" : "☀️ 浅色"}
            {selectedTopic.theme === "auto" && " (跟随系统)"}
          </span>
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
              <div
                className={`message-item ${item.type}`}
                key={item.id}
              >
                <Avatar
                  icon={
                    item.type === "user" ? (
                      <UserOutlined />
                    ) : (
                      <RobotOutlined />
                    )
                  }
                  className={`avatar ${item.type}`}
                />
                <div className="message-content">
                  <MessageContent item={item} />
                  <div className="message-time">
                    {item.mode && <span className="msg-tag">{MODES.find(m=>m.key===item.mode)?.label}</span>}
                    {item.localMode && <span className="msg-tag local">本地</span>}
                    {item.preset && <span className="msg-tag preset">{PRESET_PROMPTS[item.preset]?.title}</span>}
                    <span>{item.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="loading-message">
                <RobotOutlined spin />
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
                className={`send-btn ${inputValue.trim() && !isLoading ? "active" : ""}`}
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                title="发送"
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