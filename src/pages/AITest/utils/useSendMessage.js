import { useCallback, useRef } from "react";
import { message } from "antd";
import { isImageModel, generateImages } from "./imageGeneration";
import { streamChatCompletion } from "./chatCompletion";
import { PRESET_PROMPTS } from "./constants";

/**
 * 发送消息的通用逻辑（生图 / 流式对话共用）。
 *
 * @param {Object} options
 * @param {string} options.inputValue        当前输入框内容
 * @param {Array}  options.attachments       待发送附件
 * @param {Object} options.selectedApi       当前 API 配置 { value, apiKey }
 * @param {string} options.selectedModel     当前模型 ID
 * @param {string} options.selectedMode      当前模式 key
 * @param {boolean} options.isLocalMode      是否本地电脑模式
 * @param {string|null} options.activePreset 当前激活的预设模式 key
 * @param {Array}  options.messages          当前消息列表
 * @param {Function} options.setInputValue
 * @param {Function} options.setAttachments
 * @param {Function} options.setActivePreset
 * @param {Function} options.setIsLoading
 * @param {Function} options.setMessages
 * @param {Function} options.onReplyDone     AI 回复结束后的回调 (content, aiMessageId)
 * @returns {{ handleSend: Function, abortControllerRef: Object }}
 */
export const useSendMessage = ({
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
  onReplyDone,
}) => {
  const abortControllerRef = useRef(null);

  // 新增或更新指定 ID 的 AI 消息（用于流式输出与中断时的状态回写）
  const upsertAiMessage = useCallback(
    (aiId, content, extra = {}) => {
      setMessages((prev) => {
        const aiIndex = prev.findIndex((msg) => msg.id === aiId);
        if (aiIndex >= 0) {
          const newMessages = [...prev];
          newMessages[aiIndex] = {
            ...prev[aiIndex],
            content,
            timestamp: new Date().toLocaleTimeString(),
            ...extra,
          };
          return newMessages;
        }
        return [
          ...prev,
          {
            id: aiId,
            type: "ai",
            content,
            timestamp: new Date().toLocaleTimeString(),
            ...extra,
          },
        ];
      });
    },
    [setMessages]
  );

  const handleSend = useCallback(
    async (overrideText) => {
      const text = overrideText !== undefined ? overrideText : inputValue;
      if (!text.trim() || !selectedApi || !selectedModel) return;

      const useImageApi = isImageModel(selectedModel) || activePreset === "image";

      const userMessage = {
        id: Date.now(),
        type: "user",
        content: text,
        timestamp: new Date().toLocaleTimeString(),
        attachments: attachments.length > 0 ? [...attachments] : undefined,
        mode: selectedMode,
        localMode: isLocalMode,
        preset: activePreset,
      };

      setMessages((prev) => [...prev, userMessage]);
      if (overrideText === undefined) setInputValue("");
      setAttachments([]);
      // 生图模式只对本次发送生效，避免之后所有对话都被路由到生图接口
      if (useImageApi) setActivePreset(null);
      setIsLoading(true);

      const aiMessageId = Date.now() + 1;
      let aiContent = "";
      let aiImages = [];

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        if (useImageApi) {
          aiImages = await generateImages({
            baseUrl: selectedApi.value,
            apiKey: selectedApi.apiKey,
            model: selectedModel,
            prompt: text,
            signal: controller.signal,
            onRetry: (e) => message.warning(`生图失败（${e.message}），正在自动重试...`),
          });

          aiContent = `生图成功！共生成 ${aiImages.length} 张图片`;

          setMessages((prev) => [
            ...prev,
            {
              id: aiMessageId,
              type: "ai",
              content: aiContent,
              images: aiImages,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        } else {
          const historyMessages = messages
            .filter((m) => m.type === "user" || m.type === "ai")
            .map((m) => ({
              role: m.type === "user" ? "user" : "assistant",
              content: m.content,
            }));

          await streamChatCompletion({
            baseUrl: selectedApi.value,
            apiKey: selectedApi.apiKey,
            model: selectedModel,
            messages: [
              {
                role: "system",
                content: `当前模式: ${selectedMode}${isLocalMode ? "，本地电脑已接入" : ""}${activePreset ? `，任务类型: ${PRESET_PROMPTS[activePreset].title}` : ""}。请根据用户输入提供相应服务。`
              },
              ...historyMessages,
              { role: "user", content: text }
            ],
            signal: controller.signal,
            onDelta: (fullText) => {
              aiContent = fullText;
              upsertAiMessage(aiMessageId, aiContent);
            },
          });
        }
      } catch (error) {
        if (error.name === "AbortError") {
          if (aiContent || aiImages.length) {
            upsertAiMessage(
              aiMessageId,
              (aiContent || "") + "\n\n*（已停止生成）*",
              aiImages.length ? { images: aiImages } : {}
            );
          }
          return;
        }

        console.log("error", error);
        let errorMessage = "抱歉，暂时无法连接到AI服务。";

        if (error.message?.includes("TLS") || error.message?.includes("SSL")) {
          errorMessage = "SSL/TLS连接失败，请检查网络环境或尝试使用HTTP协议。";
        } else if (error.message?.includes("403")) {
          errorMessage = "API密钥无效或权限不足，请检查密钥配置。";
        } else if (error.message) {
          errorMessage = `请求失败: ${error.message}`;
        }

        setMessages((prev) => [
          ...prev,
          {
            id: aiMessageId,
            type: "ai",
            content: errorMessage,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      } finally {
        abortControllerRef.current = null;
        setIsLoading(false);
        onReplyDone(aiContent, aiMessageId);
      }
    },
    [
      inputValue,
      attachments,
      selectedApi,
      selectedModel,
      selectedMode,
      isLocalMode,
      activePreset,
      messages,
      onReplyDone,
      upsertAiMessage,
    ]
  );

  return { handleSend, abortControllerRef };
};
