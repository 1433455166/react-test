import { message } from "antd";

const IMAGE_MODEL_PATTERNS = [
  /image/i,
  /grok-imagine/i,
  /dall/i,
  /sd/i,
  /stable.diffusion/i,
  /midjourney/i,
  /flux/i,
];

export const isImageModel = (modelId) => {
  if (!modelId) return false;
  return IMAGE_MODEL_PATTERNS.some((p) => p.test(modelId));
};

/**
 * 调用生图接口并解析图片列表，失败自动重试（最多两次）。
 *
 * @param {Object} options
 * @param {string} options.baseUrl   API 基础地址，需以 "/" 结尾
 * @param {string} options.apiKey    API 密钥
 * @param {string} options.model     模型 ID
 * @param {string} options.prompt    生图提示词
 * @param {AbortSignal} [options.signal] 用于中断请求
 * @param {number} [options.maxAttempts=2] 最大尝试次数
 * @param {(error: Error) => void} [options.onRetry] 重试前的回调（用于 UI 提示）
 * @returns {Promise<string[]>} 图片 URL（或 base64 data URL）数组
 */
export const generateImages = async ({
  baseUrl,
  apiKey,
  model,
  prompt,
  signal,
  maxAttempts = 2,
  onRetry,
}) => {
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(`${baseUrl}v1/images/generations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          prompt,
          n: 1,
          size: "1024x1024",
        }),
        signal,
      });

      if (!response.ok) {
        let errMsg = `HTTP error! status: ${response.status}`;
        try {
          const errData = await response.json();
          errMsg = errData.error?.message || errData.message || errMsg;
        } catch (_) {
          // 错误响应体不是 JSON 时使用默认错误信息
        }
        throw new Error(errMsg);
      }

      const data = await response.json();
      const images = (data.data || [])
        .map((item) => {
          if (item.b64_json) {
            return `data:image/png;base64,${item.b64_json}`;
          }
          return item.url || null;
        })
        .filter(Boolean);

      if (images.length === 0) {
        throw new Error("生图接口未返回图片数据，请稍后重试或更换模型");
      }

      return images;
    } catch (e) {
      if (e.name === "AbortError") throw e;
      lastError = e;
      if (attempt < maxAttempts) {
        onRetry?.(e);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  throw lastError;
};
