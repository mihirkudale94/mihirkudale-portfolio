import { useRef, useEffect, useCallback } from "react";
import { ChatMessage } from "./ChatMessage";

export function ChatMessages({
  messages,
  loading,
  streaming,
  slowResponse,
  prefersReducedMotion,
}) {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const isAtBottomRef = useRef(true);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    // Allow a 50px threshold to determine if user is at the bottom
    isAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 50;
  };

  const scrollToBottom = useCallback((instant = false) => {
    if (!isAtBottomRef.current) return;
    messagesEndRef.current?.scrollIntoView({
      // Use instant scroll during rapid token streaming to prevent layout thrashing
      behavior: (prefersReducedMotion || instant) ? "auto" : "smooth",
    });
  }, [prefersReducedMotion]);

  useEffect(() => {
    scrollToBottom(streaming);
  }, [messages, streaming, scrollToBottom]);

  useEffect(() => {
    if (loading) {
      isAtBottomRef.current = true; // Auto scroll on new query start
      scrollToBottom(true);
    }
  }, [loading, scrollToBottom]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-5 space-y-5 bg-bg-secondary/30"
      aria-live="polite"
      aria-atomic="false"
    >
      {messages.map((msg) => (
        <ChatMessage key={msg.id} msg={msg} />
      ))}

      {loading && !streaming && (
        <div className="flex flex-col items-start gap-1">
          <div className="bg-bg-primary rounded-[1.25rem] rounded-bl-sm px-5 py-3.5 border border-glass-border shadow-sm">
            <span className="inline-flex gap-1.5 align-middle">
              <span className="w-2 h-2 rounded-full bg-accent-primary/80 animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 rounded-full bg-accent-primary/80 animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 rounded-full bg-accent-primary/80 animate-bounce [animation-delay:300ms]" />
            </span>
          </div>
          {slowResponse && (
            <p className="text-xs text-text-tertiary font-medium ps-1 animate-pulse">
              Still thinking... first response may take a moment ☕
            </p>
          )}
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
