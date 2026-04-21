import { useCallback } from "react";
import { Send } from "lucide-react";
import { chatbotConfig } from "../../constants/chatbot";

export function ChatInput({ inputRef, input, onChange, onSend, loading }) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSend();
      }
    },
    [onSend]
  );

  return (
    <div className="p-4 border-t border-slate-200 bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
      <div className="flex gap-3">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about my work..."
          maxLength={chatbotConfig.maxInputLength}
          className="flex-1 rounded-xl bg-slate-100/80 px-4 py-3 text-[15px] font-medium text-slate-800 placeholder-slate-400 border border-transparent focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-50/50 transition-all"
          disabled={loading}
          aria-label="Chat message"
        />
        <button
          type="button"
          onClick={onSend}
          disabled={!input.trim() || loading}
          className="flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-white shadow-[0_4px_14px_rgba(37,99,235,0.2)] hover:bg-blue-700 hover:shadow-[0_6px_20px_rgba(37,99,235,0.3)] disabled:opacity-50 disabled:pointer-events-none transition-all focus:outline-none active:scale-95"
          aria-label="Send message"
        >
          <Send className="w-5 h-5 -ms-0.5" />
        </button>
      </div>
    </div>
  );
}
