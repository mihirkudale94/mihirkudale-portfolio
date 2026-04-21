import { useState, useRef, useCallback } from "react";
import { chatbotConfig } from "../constants/chatbot";
import { getChatbotReplyAsync } from "../utils/chatbotLogic";

function nextMessageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getFollowUpSuggestions(userText) {
  const t = userText.toLowerCase();
  if (t.includes("skill") || t.includes("tech") || t.includes("stack"))
    return ["Show Python projects", "Power BI dashboards", "Any ML experience?"];
  if (t.includes("project") || t.includes("built") || t.includes("dashboard"))
    return ["What tech stack?", "Any live demos?", "Experience at Amazon?"];
  if (t.includes("experience") || t.includes("work") || t.includes("job") || t.includes("amazon"))
    return ["What are his skills?", "Education background?", "Open to opportunities?"];
  if (t.includes("education") || t.includes("degree") || t.includes("university"))
    return ["Certifications?", "Work experience?", "What are his skills?"];
  if (t.includes("contact") || t.includes("hire") || t.includes("email") || t.includes("linkedin"))
    return ["Download resume?", "Availability?", "View projects"];
  if (t.includes("certif"))
    return ["What tools does he use?", "Any Microsoft certs?", "Work experience?"];
  return ["Skills", "Projects", "Experience", "Contact"];
}

export function useChatMessages(initialMessages) {
  const [messages, setMessages] = useState(initialMessages);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [slowResponse, setSlowResponse] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const slowTimerRef = useRef(null);
  // Stable ref so dispatchMessage always reads latest messages without
  // needing them in its dependency array (avoids stale closure)
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const dispatchMessage = useCallback(async (text) => {
    if (!text || loading) return;

    setSuggestions([]);
    setLoading(true);
    setSlowResponse(false);

    // Capture history before any state updates
    const conversationHistory = messagesRef.current.slice(-20).map((msg) => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    }));

    setMessages((prev) => [...prev, { id: nextMessageId(), role: "user", content: text }]);

    slowTimerRef.current = setTimeout(() => setSlowResponse(true), 6000);

    const botMsgId = nextMessageId();

    setMessages((prev) => [
      ...prev,
      { id: botMsgId, role: "bot", content: "", source: null, isStreaming: true },
    ]);
    setStreaming(true);

    try {
      const { reply, source } = await getChatbotReplyAsync(
        text,
        conversationHistory,
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
        }
      );

      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id !== botMsgId) return msg;
          return { ...msg, content: reply || msg.content, source, isStreaming: false };
        })
      );

      setSuggestions(getFollowUpSuggestions(text));
    } catch (error) {
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
      clearTimeout(slowTimerRef.current);
      setSlowResponse(false);
      setLoading(false);
      setStreaming(false);
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

  return {
    messages,
    loading,
    streaming,
    slowResponse,
    suggestions,
    sendMessage,
    handleSuggestionClick,
  };
}
