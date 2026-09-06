import { useState, useRef, useCallback, useEffect } from "react";
import { chatbotConfig } from "../constants/chatbot";
import { getChatbotReplyAsync } from "../utils/chatbotLogic";

function executeAction(action) {
  if (!action?.action) return;
  switch (action.action) {
    case 'SCROLL_TO_SECTION': {
      const el = document.getElementById(action.payload?.sectionId);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      break;
    }
    case 'COPY_TO_CLIPBOARD': {
      navigator.clipboard?.writeText(action.payload?.text ?? '').catch(() => {});
      break;
    }
    case 'OPEN_URL': {
      const url = action.payload?.url;
      if (url && url.startsWith('https://')) window.open(url, '_blank', 'noopener,noreferrer');
      break;
    }
    default:
      break;
  }
}

// Session-scoped so a refresh keeps the thread but closing the tab starts fresh.
const STORAGE_KEY = "mk-chat-session-v1";
const MAX_PERSISTED = 40;

function loadPersisted() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.messages) || !Array.isArray(parsed?.rawHistory)) return null;
    if (parsed.messages.length === 0) return null;
    return parsed;
  } catch {
    // Private mode, disabled storage, or corrupt JSON — start clean.
    return null;
  }
}

function persistSession(messages, rawHistory) {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        // Only known fields: isStreaming is transient and would restore a stuck spinner.
        messages: messages.slice(-MAX_PERSISTED).map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          source: m.source ?? null,
        })),
        rawHistory: rawHistory.slice(-MAX_PERSISTED),
      })
    );
  } catch {
    // Quota exceeded or storage unavailable — persistence is best effort.
  }
}

function clearPersisted() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to do if storage is unavailable.
  }
}

function nextMessageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getFollowUpSuggestions(userText) {
  const t = userText.toLowerCase();
  if (t.includes("google") || t.includes("microsoft") || t.includes("hire") || t.includes("why"))
    return ["Key Projects & Metrics", "Certifications", "Experience at Amazon?", "Technical Skills"];
  if (t.includes("skill") || t.includes("tech") || t.includes("stack"))
    return ["Show Python projects", "Power BI dashboards", "Microsoft Certifications"];
  if (t.includes("project") || t.includes("built") || t.includes("dashboard"))
    return ["What tech stack?", "Any live dashboards?", "Experience at Amazon?"];
  if (t.includes("experience") || t.includes("work") || t.includes("job") || t.includes("amazon"))
    return ["Why hire me?", "Education background?", "Availability?"];
  if (t.includes("education") || t.includes("degree") || t.includes("university"))
    return ["Microsoft Certifications", "Work experience?", "Technical Skills"];
  if (t.includes("contact") || t.includes("email") || t.includes("linkedin"))
    return ["About me?", "Availability?", "View projects"];
  if (t.includes("certif"))
    return ["Microsoft Certifications", "What tools does he use?", "Work experience?"];
  return ["Why hire me?", "Key Projects & Metrics", "Certifications", "Contact"];
}

export function useChatMessages(initialMessages) {
  const [restored] = useState(loadPersisted);
  const [messages, setMessages] = useState(() => restored?.messages ?? initialMessages);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [slowResponse, setSlowResponse] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  const [rawHistory, setRawHistory] = useState(
    () => restored?.rawHistory ?? [{ role: "assistant", content: chatbotConfig.welcomeMessage }]
  );

  // Stable ref to the greeting state so resetChat can restore it
  const initialMessagesRef = useRef(initialMessages);

  const slowTimerRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Stable ref so dispatchMessage always reads latest messages without
  // needing them in its dependency array (avoids stale closure)
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const rawHistoryRef = useRef(rawHistory);
  rawHistoryRef.current = rawHistory;

  // Persist once a turn settles. Skipped mid-stream so a half-written reply
  // is never what a refresh restores.
  useEffect(() => {
    if (streaming || loading) return;
    persistSession(messages, rawHistory);
  }, [messages, rawHistory, streaming, loading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const dispatchMessage = useCallback(async (text) => {
    if (!text || loading) return;

    // Abort any existing active request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setSuggestions([]);
    setLoading(true);
    setSlowResponse(false);

    // Capture history including full tool conversations
    const historyToSend = [...rawHistoryRef.current, { role: "user", content: text }];
    setRawHistory(historyToSend);

    setMessages((prev) => [...prev, { id: nextMessageId(), role: "user", content: text }]);

    slowTimerRef.current = setTimeout(() => setSlowResponse(true), 6000);

    const botMsgId = nextMessageId();

    setMessages((prev) => [
      ...prev,
      { id: botMsgId, role: "bot", content: "", source: null, isStreaming: true },
    ]);
    setStreaming(true);

    try {
      const { reply, source, action, messages: newMessages } = await getChatbotReplyAsync(
        text,
        historyToSend,
        (token, fullReplacement) => {
          clearTimeout(slowTimerRef.current);
          setSlowResponse(false);
          setMessages((prev) =>
            prev.map((msg) => {
              if (msg.id !== botMsgId) return msg;
              return {
                ...msg,
                content: fullReplacement || msg.content + token,
              };
            })
          );
        },
        controller.signal
      );

      if (action) executeAction(action);

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== botMsgId) return msg;
          return { ...msg, content: reply || msg.content, source, isStreaming: false };
        })
      );

      if (newMessages && newMessages.length > 0) {
        setRawHistory((prev) => [...prev, ...newMessages]);
      } else {
        setRawHistory((prev) => [...prev, { role: "assistant", content: reply || "" }]);
      }

      setSuggestions(getFollowUpSuggestions(text));
    } catch (error) {
      if (controller.signal.aborted) {
        // Ignored because request was explicitly cancelled (unmount or override)
        return;
      }
      console.error("Chat error:", error);
      setMessages((prev) => {
        const hasPlaceholder = prev.some((m) => m.id === botMsgId);
        if (hasPlaceholder) {
          return prev.map((msg) => {
            if (msg.id !== botMsgId) return msg;
            return {
              ...msg,
              content: "Something went wrong. Please try again.",
              isStreaming: false,
              source: "error",
            };
          });
        }
        return [
          ...prev,
          {
            id: nextMessageId(),
            role: "bot",
            content: "Something went wrong. Please try again.",
            source: "error",
          },
        ];
      });
    } finally {
      if (!controller.signal.aborted) {
        clearTimeout(slowTimerRef.current);
        setSlowResponse(false);
        setLoading(false);
        setStreaming(false);
      }
    }
  }, [loading]);

  const sendMessage = useCallback(
    (input) => {
      const text = input.trim().slice(0, chatbotConfig.maxInputLength);
      dispatchMessage(text);
    },
    [dispatchMessage]
  );

  const handleSuggestionClick = useCallback(
    (q) => {
      if (loading) return;
      const run = () => dispatchMessage(q);
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(run, { timeout: 100 });
      } else {
        setTimeout(run, 0);
      }
    },
    [loading, dispatchMessage]
  );

  const resetChat = useCallback(() => {
    // Abort any in-flight request so a late response cannot repopulate the
    // cleared thread. dispatchMessage skips its own cleanup when aborted,
    // so every flag is reset explicitly here.
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    clearTimeout(slowTimerRef.current);

    clearPersisted();
    setMessages(initialMessagesRef.current);
    setRawHistory([{ role: "assistant", content: chatbotConfig.welcomeMessage }]);
    setSuggestions([]);
    setLoading(false);
    setStreaming(false);
    setSlowResponse(false);
  }, []);

  return {
    messages,
    loading,
    streaming,
    slowResponse,
    suggestions,
    sendMessage,
    handleSuggestionClick,
    resetChat,
  };
}
