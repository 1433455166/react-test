import React, { useState, useEffect, useRef, useCallback } from "react";
import { Select, Input, Button, Avatar, Spin } from "antd";
import { SendOutlined, RobotOutlined, UserOutlined, CloudServerOutlined } from "@ant-design/icons";
import "./index.css";

const { Option } = Select;

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
    return <div className="message-text">{item.content}</div>;
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

function AITest() {
  const [selectedApi, setSelectedApi] = useState(apiOptions?.[0]);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

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

  const handleSend = async () => {
    if (!inputValue.trim() || !selectedApi || !selectedModel) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
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
        
        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("event: error")) {
            continue;
          }
          
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6);
            
            if (dataStr === "[DONE]") {
              break;
            }

            try {
              const data = JSON.parse(dataStr);
              
              if (data.error) {
                throw new Error(data.error.message || "API请求失败");
              }

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
      
      if (error.message && error.message.includes("TLS") || error.message?.includes("SSL")) {
        errorMessage = "SSL/TLS连接失败，请检查网络环境或尝试使用HTTP协议。";
      } else if (error.message && error.message.includes("403")) {
        errorMessage = "API密钥无效或权限不足，请检查密钥配置。";
      } else if (error.message) {
        errorMessage = `请求失败: ${error.message}`;
      }
      
      if (!aiContent) {
        setMessages((prev) => [...prev, {
          id: aiMessageId,
          type: "ai",
          content: errorMessage,
          timestamp: new Date().toLocaleTimeString(),
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="ai-test">
      <h1>AI测试页面</h1>

      <div className="selector-container">
        <div className="selector-item">
          <label>选择API服务：</label>
          <Select
            value={selectedApi?.value}
            onChange={handleApiChange}
            style={{ width: 300 }}
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
          <div className="selector-item">
            <label>选择AI模型：</label>
            <Select
              value={selectedModel}
              onChange={handleModelChange}
              style={{ width: 300 }}
              placeholder="请选择AI模型"
              loading={isLoadingModels}
            >
              {models.map((model) => (
                <Option key={model.id} value={model.id}>
                  {model.name}
                </Option>
              ))}
            </Select>
            {isLoadingModels && (
              <Spin size="small" className="loading-spin" />
            )}
          </div>
        )}
      </div>

      {selectedApi && selectedModel ? (
        <div className="chat-container">
          <div className="chat-header">
            <RobotOutlined />
            <span>AI 对话</span>
            <span className="chat-model-info">({selectedModel})</span>
          </div>

          <div className="chat-messages" ref={messagesEndRef}>
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
                  <div className="message-time">{item.timestamp}</div>
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

          <div className="chat-input">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="请输入消息..."
              disabled={isLoading}
              style={{ flex: 1 }}
            />
            <Button
              type="primary"
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              icon={<SendOutlined />}
            >
              发送
            </Button>
          </div>
        </div>
      ) : (
        <div className="no-selection">
          <CloudServerOutlined style={{ fontSize: 48, color: "#999", marginBottom: 16 }} />
          <p>{!selectedApi ? "请先选择API服务" : "请选择AI模型"}</p>
        </div>
      )}
    </div>
  );
}

export default AITest;