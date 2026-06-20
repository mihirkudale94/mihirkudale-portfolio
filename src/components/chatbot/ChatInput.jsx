import { Send } from "lucide-react";
import { chatbotConfig } from "../../constants/chatbot";

export function ChatInput({ inputRef, input, onChange, onSend, loading }) {


  const onSubmit = (e) => {
    e.preventDefault();
    onSend();
  };

  return (
    <div className="p-4 border-t border-glass-border bg-bg-primary shadow-[0_-10px_20px_rgba(0,0,0,0.01)]">
      <form onSubmit={onSubmit} className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="text"
          maxLength={chatbotConfig.maxInputLength}
          placeholder="Type a message…"
          value={input}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading}
          className="flex-1 rounded-xl bg-bg-secondary px-4 py-3 text-[15px] font-medium text-text-primary placeholder-text-tertiary border border-transparent focus:border-accent-primary-light focus:bg-bg-primary focus:outline-none focus:ring-4 focus:ring-accent-primary-light/10 transition-all"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-3 rounded-xl bg-accent-primary text-white font-bold hover:bg-accent-primary-light disabled:bg-bg-secondary disabled:text-text-tertiary/40 transition-colors focus:outline-none focus:ring-4 focus:ring-accent-primary-light/20"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
