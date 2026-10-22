import { useState, useRef, useEffect, useCallback } from "react";
import { Modal, message } from "antd";

const DEFAULT_VOICE_LABEL = "浏览器默认中文语音";

const cleanTextForSpeech = (text) => {
  if (!text) return "";
  return text
    .replace(/[#*`_>-]+/g, " ")
    .replace(/\[[^\]]+\]\([^)]+\)/g, (m) => {
      const match = /\[([^\]]+)\]/.exec(m);
      return match ? match[1] : "";
    })
    .replace(/```[\s\S]*?```/g, "这段代码已省略")
    .replace(/\d+\.\s/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const GUESS_GENDER = (name) => {
  if (!name) return "unknown";
  const n = name.toLowerCase();
  const femaleHints = ["female", "woman", "girl", "xiaoxiao", "yaoyao", "tracy", "samantha", "victoria", "aisha", "tingting", "yunxi", "yunyang", "xiaoyi", "xiaohan", "yaqian", "hanhan", "yuna", "moira", "susan", "karen", "allison"];
  const maleHints = ["male", "man", "boy", "yunjian", "yunxi", "yunhao", "kangkang", "darren", "alex", "fred", "james", "tom", "david", "mark", "daniel", "oliver", "george", "peter"];

  for (const h of femaleHints) if (n.includes(h)) return "female";
  for (const h of maleHints) if (n.includes(h)) return "male";
  return "unknown";
};

const GUESS_REGION = (lang, name) => {
  if (!lang) return "🌍 其他";
  if (lang.includes("TW")) return "🇹🇼 台湾";
  if (lang.includes("HK")) return "🇭🇰 香港";
  if (lang.includes("CN")) return "🇨🇳 大陆";
  if (lang.startsWith("zh")) return "🇨🇳 中文";
  return "🌍 其他";
};

export const useVoice = ({ onSend, onFillInput }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [voiceChatMode, setVoiceChatMode] = useState(false);
  const [ttsPlayingId, setTtsPlayingId] = useState(null);
  const [ttsVoices, setTtsVoices] = useState([]);
  const [selectedTtsVoice, setSelectedTtsVoice] = useState("default");

  const recognitionRef = useRef(null);
  const voiceChatRecognitionRef = useRef(null);
  const autoSendTimerRef = useRef(null);
  const pendingTextRef = useRef("");
  const voiceChatActiveRef = useRef(false);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const all = window.speechSynthesis.getVoices();
      console.log("[voice] raw voices:", all.length);
      if (all.length > 0) {
        console.log("[voice] first voice keys:", Object.keys(all[0]));
        console.log("[voice] first 5 details:", all.slice(0, 5).map((v, i) => `#${i} name=${JSON.stringify(v.name)} lang=${JSON.stringify(v.lang)} localService=${v.localService} default=${v.default}`));
        const uniqueNames = [...new Set(all.map((v) => `${v.name}|${v.lang}`))];
        console.log("[voice] unique name|lang combos:", uniqueNames.length, uniqueNames.slice(0, 10));
      }
      if (!all || all.length === 0) return;

      const withMeta = all.map((v) => {
        const name = v.name;
        const lang = v.lang;
        return {
          name,
          lang,
          localService: v.localService,
          default: v.default,
          _raw: v,
          _gender: GUESS_GENDER(name),
          _region: GUESS_REGION(lang, name),
        };
      });

      console.log("[voice] withMeta:", withMeta.map((v) => ({ name: v.name, lang: v.lang, gender: v._gender, region: v._region })));

      const dedup = (list) => {
        const seen = new Set();
        return list.filter((v, i) => {
          const key = `${v.name || "unnamed"}_${v.lang || "nolang"}_${i}`;
          const shortKey = `${v.name || "unnamed"}_${v.lang || "nolang"}`;
          if (seen.has(shortKey)) return false;
          seen.add(shortKey);
          return true;
        });
      };

      const sorted = dedup(withMeta).sort((a, b) => {
        const aLang = a.lang || "";
        const bLang = b.lang || "";
        if (aLang.includes("TW") && !bLang.includes("TW")) return -1;
        if (!aLang.includes("TW") && bLang.includes("TW")) return 1;
        if (aLang.includes("HK") && !bLang.includes("HK")) return -1;
        if (!aLang.includes("HK") && bLang.includes("HK")) return 1;
        if (a._gender === "female" && b._gender !== "female") return -1;
        if (a._gender !== "female" && b._gender === "female") return 1;
        return (a.name || "").localeCompare(b.name || "");
      });

      console.log("[voice] final sorted:", sorted.length);

      setTtsVoices(sorted);
      setSelectedTtsVoice((prev) => {
        if (prev && prev !== "default") return prev;
        const twFemale = sorted.find((v) => (v.lang || "").includes("TW") && v._gender === "female");
        if (twFemale) return twFemale.name;
        const twAny = sorted.find((v) => (v.lang || "").includes("TW"));
        if (twAny) return twAny.name;
        const zhFemale = sorted.find((v) => (v.lang || "").startsWith("zh") && v._gender === "female");
        if (zhFemale) return zhFemale.name;
        return sorted[0]?.name || "default";
      });
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    let retryCount = 0;
    const retryTimer = setInterval(() => {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) {
        loadVoices();
        clearInterval(retryTimer);
      }
      retryCount++;
      if (retryCount > 50) clearInterval(retryTimer);
    }, 200);

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      clearInterval(retryTimer);
    };
  }, []);

  const speakText = useCallback((text, onEnd) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    if (selectedTtsVoice && selectedTtsVoice !== "default") {
      const found = ttsVoices.find((v) => v.name === selectedTtsVoice);
      if (found) {
        utterance.voice = found._raw;
        utterance.lang = found.lang;
      } else {
        utterance.lang = "zh-CN";
      }
    } else {
      const zhVoice = ttsVoices.find((v) => (v.lang || "").startsWith("zh"));
      if (zhVoice) {
        utterance.voice = zhVoice._raw;
        utterance.lang = zhVoice.lang;
      } else {
        utterance.lang = "zh-CN";
      }
    }

    utterance.onend = () => onEnd && onEnd();
    utterance.onerror = () => onEnd && onEnd();
    window.speechSynthesis.speak(utterance);
  }, [selectedTtsVoice, ttsVoices]);

  const stopSpeak = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setTtsPlayingId(null);
  }, []);

  const handleTTSClick = useCallback((item) => {
    if (ttsPlayingId === item.id) {
      stopSpeak();
      return;
    }
    const clean = cleanTextForSpeech(item.content);
    if (!clean) {
      message.warning("没有可朗读的内容");
      return;
    }
    setTtsPlayingId(item.id);
    speakText(clean, () => {
      setTtsPlayingId((prev) => (prev === item.id ? null : prev));
    });
  }, [ttsPlayingId, speakText, stopSpeak]);

  const startVoiceInput = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      Modal.warning({
        title: "语音输入",
        content: "当前浏览器不支持语音识别，请使用 Chrome 或 Edge 浏览器。",
      });
      return;
    }

    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_e) { /* ignore */ }
      recognitionRef.current = null;
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "zh-CN";
    recognition.interimResults = true;
    recognition.continuous = false;

    let finalText = "";

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interim += r[0].transcript;
      }
      onFillInput(finalText + interim);
    };

    recognition.onerror = (event) => {
      console.log("voice input error:", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (finalText) {
        onFillInput(finalText);
      }
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [onFillInput]);

  const clearAutoSendTimer = useCallback(() => {
    if (autoSendTimerRef.current) {
      clearTimeout(autoSendTimerRef.current);
      autoSendTimerRef.current = null;
    }
  }, []);

  const stopVoiceChatInternal = useCallback(() => {
    voiceChatActiveRef.current = false;
    voiceChatRecognitionRef.current?.stop();
    voiceChatRecognitionRef.current = null;
    clearAutoSendTimer();
    pendingTextRef.current = "";
    setIsRecording(false);
    setVoiceChatMode(false);
    message.destroy("voicechat");
    stopSpeak();
  }, [clearAutoSendTimer, stopSpeak]);

  const startVoiceChatRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      Modal.warning({
        title: "语音对话",
        content: "当前浏览器不支持语音识别，请使用 Chrome 或 Edge 浏览器。",
      });
      stopVoiceChatInternal();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "zh-CN";
    recognition.interimResults = true;
    recognition.continuous = true;

    const scheduleAutoSend = (text) => {
      clearAutoSendTimer();
      autoSendTimerRef.current = setTimeout(() => {
        if (voiceChatActiveRef.current && text.trim()) {
          voiceChatActiveRef.current = false;
          clearAutoSendTimer();
          try { recognition.stop(); } catch (_e) { /* ignore */ }
          message.destroy("voicechat");
          setIsRecording(false);
          pendingTextRef.current = "";
          onSend(text.trim());
        }
      }, 2000);
    };

    recognition.onstart = () => {
      setIsRecording(true);
      message.loading({
        content: "🎙️ 语音对话中，请说话...（停顿 2 秒自动发送）",
        key: "voicechat",
        duration: 0,
      });
    };

    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) finalText += result[0].transcript;
        else interimText += result[0].transcript;
      }

      if (finalText) pendingTextRef.current += finalText;
      const text = pendingTextRef.current + interimText;
      onFillInput(text);
      scheduleAutoSend(text);
    };

    recognition.onerror = (event) => {
      console.log("voice chat error:", event.error);
      if (event.error === "no-speech" || event.error === "aborted") {
        setTimeout(() => {
          if (voiceChatActiveRef.current) {
            try { recognition.start(); } catch (_e) { /* ignore */ }
          }
        }, 300);
      } else {
        setIsRecording(false);
        voiceChatActiveRef.current = false;
        clearAutoSendTimer();
        message.destroy("voicechat");
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (voiceChatActiveRef.current) {
        setTimeout(() => {
          try { recognition.start(); } catch (_e) { /* ignore */ }
        }, 500);
      }
    };

    voiceChatRecognitionRef.current = recognition;
    recognition.start();
  }, [onSend, onFillInput, clearAutoSendTimer, stopVoiceChatInternal]);

  const toggleVoiceChat = useCallback(({ canStart }) => {
    if (voiceChatMode) {
      stopVoiceChatInternal();
    } else {
      if (!canStart()) return;
      setVoiceChatMode(true);
      voiceChatActiveRef.current = true;
      startVoiceChatRecognition();
    }
  }, [voiceChatMode, stopVoiceChatInternal, startVoiceChatRecognition]);

  const cleanup = useCallback(() => {
    try { recognitionRef.current?.stop(); } catch (_e) { /* ignore */ }
    recognitionRef.current = null;
    stopVoiceChatInternal();
  }, [stopVoiceChatInternal]);

  const handleAIReplyDone = useCallback((content, aiMessageId) => {
    if (!voiceChatMode) return;
    const contentToSpeak = content || "抱歉，我没能回复你，请重试";
    const clean = cleanTextForSpeech(contentToSpeak);
    if (clean) {
      setTtsPlayingId(aiMessageId);
      speakText(clean, () => {
        setTtsPlayingId(null);
        if (voiceChatMode) {
          voiceChatActiveRef.current = true;
          startVoiceChatRecognition();
        }
      });
    } else {
      voiceChatActiveRef.current = true;
      startVoiceChatRecognition();
    }
  }, [voiceChatMode, speakText, startVoiceChatRecognition]);

  return {
    isRecording,
    voiceChatMode,
    ttsPlayingId,
    ttsVoices,
    selectedTtsVoice,
    setSelectedTtsVoice,
    startVoiceInput,
    toggleVoiceChat,
    stopVoiceChat: stopVoiceChatInternal,
    handleTTSClick,
    speakText,
    stopSpeak,
    cleanup,
    handleAIReplyDone,
    DEFAULT_VOICE_LABEL,
  };
};