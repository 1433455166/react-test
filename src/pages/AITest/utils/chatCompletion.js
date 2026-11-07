/**
 * 调用 OpenAI 兼容的流式对话接口（v1/chat/completions），
 * 逐段解析 SSE 并通过 onDelta 回调返回已累积的回复文本。
 *
 * @param {Object} options
 * @param {string} options.baseUrl   API 基础地址，需以 "/" 结尾
 * @param {string} options.apiKey    API 密钥
 * @param {string} options.model     模型 ID
 * @param {Array<{role: string, content: string}>} options.messages 完整消息列表
 * @param {AbortSignal} [options.signal] 用于中断请求
 * @param {(fullContent: string) => void} [options.onDelta] 每收到新内容时的回调，参数为累积后的完整文本
 * @returns {Promise<string>} 完整回复文本
 */
export const streamChatCompletion = async ({
  baseUrl,
  apiKey,
  model,
  messages,
  signal,
  onDelta,
}) => {
  const response = await fetch(`${baseUrl}v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let sseBuffer = "";
  let done = false;
  let fullContent = "";

  while (!done) {
    const result = await reader.read();
    done = result.done;
    if (done) break;
    const value = result.value;

    sseBuffer += decoder.decode(value, { stream: true });
    const lines = sseBuffer.split("\n");
    // 最后一段可能是不完整的行，留到下一个分片处理
    sseBuffer = lines.pop() ?? "";

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
            fullContent += content;
            onDelta?.(fullContent);
          }
        } catch (e) {
          if (e.name === "AbortError") throw e;
          // 残缺的 JSON 行直接跳过，不要中断整个流
          if (e instanceof SyntaxError) {
            console.log("JSON parse error:", e);
            continue;
          }
          throw e;
        }
      }
    }
  }

  return fullContent;
};
