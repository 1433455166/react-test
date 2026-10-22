import { Select } from "antd";
import { AudioOutlined, SoundOutlined } from "@ant-design/icons";
import { useState, useRef } from "react";

const GENDER_LABEL = {
  female: "👩 女",
  male: "👨 男",
  unknown: "❓",
};

const GENDER_ORDER = ["female", "male", "unknown"];

const SAMPLE_TEXT = {
  zh: "你好，我是这个语音的示例，很高兴认识你。",
  tw: "你好，我是這個語音的示例，很高興認識你。",
  en: "Hello, this is a sample voice. Nice to meet you.",
  ja: "こんにちは、サンプルボイスです。",
};

const pickSample = (lang) => {
  if (!lang) return SAMPLE_TEXT.zh;
  if (lang.includes("TW") || lang.includes("HK")) return SAMPLE_TEXT.tw;
  if (lang.startsWith("zh")) return SAMPLE_TEXT.zh;
  if (lang.startsWith("ja")) return SAMPLE_TEXT.ja;
  return SAMPLE_TEXT.en;
};

export const VoiceSettings = ({ voices, value, onChange }) => {
  const [previewing, setPreviewing] = useState(null);
  const utterRef = useRef(null);

  const grouped = voices.reduce((acc, v) => {
    if (!acc[v._region]) acc[v._region] = [];
    acc[v._region].push(v);
    return acc;
  }, {});

  const sortedRegions = Object.keys(grouped).sort((a, b) => {
    if (a.includes("台湾") && !b.includes("台湾")) return -1;
    if (!a.includes("台湾") && b.includes("台湾")) return 1;
    if (a.includes("香港") && !b.includes("香港")) return -1;
    if (!a.includes("香港") && b.includes("香港")) return 1;
    return a.localeCompare(b);
  });

  const previewVoice = (e, v) => {
    e.stopPropagation();
    e.preventDefault();

    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    if (previewing === v.name) {
      setPreviewing(null);
      return;
    }

    const utter = new SpeechSynthesisUtterance(pickSample(v.lang));
    utter.rate = 1;
    utter.pitch = 1;
    utter.volume = 1;
    utter.lang = v.lang || "zh-CN";
    if (v._raw) utter.voice = v._raw;

    utter.onend = () => setPreviewing((p) => (p === v.name ? null : p));
    utter.onerror = () => setPreviewing((p) => (p === v.name ? null : p));

    utterRef.current = utter;
    setPreviewing(v.name);
    window.speechSynthesis.speak(utter);
  };

  const previewDefault = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    if (previewing === "default") {
      setPreviewing(null);
      return;
    }

    const zhVoice = voices.find((v) => (v.lang || "").startsWith("zh"));
    const utter = new SpeechSynthesisUtterance(SAMPLE_TEXT.zh);
    utter.rate = 1;
    utter.pitch = 1;
    utter.volume = 1;
    utter.lang = "zh-CN";
    if (zhVoice?._raw) utter.voice = zhVoice._raw;

    utter.onend = () => setPreviewing((p) => (p === "default" ? null : p));
    utter.onerror = () => setPreviewing((p) => (p === "default" ? null : p));

    setPreviewing("default");
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="config-item">
      <label>
        <AudioOutlined style={{ marginRight: 4 }} />
        AI 语音：
      </label>
      <Select
        value={value}
        onChange={onChange}
        style={{ width: 280 }}
        placeholder="默认"
        title="AI 回复的朗读声音（优先推荐台湾女腔）"
        showSearch
        optionFilterProp="label"
        dropdownMatchSelectWidth={false}
      >
        <Select.OptGroup label="━━━ 默认 ━━━">
          <Select.Option value="default">
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span>浏览器默认中文语音</span>
              <span
                onClick={previewDefault}
                style={{
                  marginLeft: "auto",
                  fontSize: 12,
                  opacity: previewing === "default" ? 1 : 0.4,
                  cursor: "pointer",
                  color: previewing === "default" ? "#1677ff" : undefined,
                  padding: "2px 4px",
                  borderRadius: 3,
                }}
              >
                <SoundOutlined spin={previewing === "default"} /> 试听
              </span>
            </span>
          </Select.Option>
        </Select.OptGroup>

        {sortedRegions.map((region) => (
          <Select.OptGroup key={region} label={region}>
            {GENDER_ORDER.flatMap((gender) =>
              grouped[region]
                .filter((v) => v._gender === gender)
                .map((v) => (
                  <Select.Option
                    key={`${v.name}_${v.lang}`}
                    value={v.name}
                    label={`${v.name} ${GENDER_LABEL[v._gender]}`}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", width: "100%", gap: 4 }}>
                      <span>{v.name}</span>
                      <span style={{ fontSize: 11, opacity: 0.6 }}>
                        {GENDER_LABEL[v._gender]}
                      </span>
                      <span style={{ fontSize: 10, opacity: 0.4, marginRight: "auto" }}>
                        {v.lang}
                      </span>
                      <span
                        onClick={(e) => previewVoice(e, v)}
                        style={{
                          fontSize: 12,
                          opacity: previewing === v.name ? 1 : 0.4,
                          cursor: "pointer",
                          color: previewing === v.name ? "#1677ff" : undefined,
                          padding: "2px 4px",
                          borderRadius: 3,
                          flexShrink: 0,
                        }}
                      >
                        <SoundOutlined spin={previewing === v.name} /> 试听
                      </span>
                    </span>
                  </Select.Option>
                ))
            )}
          </Select.OptGroup>
        ))}
      </Select>
    </div>
  );
};