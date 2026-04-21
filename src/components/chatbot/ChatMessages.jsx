import { useRef, useEffect, useCallback } from "react";
import { ChatMessage } from "./ChatMessage";

export function ChatMessages({
  messages,
  loading,
  streaming,
  slowResponse,
  playingAudioId,
  onPlayAudio,
  onStopAudio,
  prefersReducedMotion,
}) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [prefersReducedMotion]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <div
      className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/30"
      aria-live="polite"
      aria-atomic="false"
    >
      {messages.map((msg) => (
        <ChatMessage
          key={msg.id}
          msg={msg}
          playingAudioId={playingAudioId}
          onPlayAudio={onPlayAudio}
          onStopAudio={onStopAudio}
        />
      ))}

      {loading && !streaming && (
        <div className="flex flex-col items-start gap-1">
          <div className="bg-white rounded-[1.25rem] rounded-bl-sm px-5 py-3.5 border border-slate-100 shadow-sm">
            <span className="inline-flex gap-1.5 align-middle">
              <span className="w-2 h-2 rounded-full bg-blue-500/80 animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 rounded-full bg-blue-500/80 animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 rounded-full bg-blue-500/80 animate-bounce [animation-delay:300ms]" />
            </span>
          </div>
          {slowResponse && (
            <p className="text-xs text-slate-400 font-medium ps-1 animate-pulse">
              Still thinking... first response may take a moment ☕
            </p>
          )}
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
