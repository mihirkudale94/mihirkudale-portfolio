const INITIAL_SUGGESTIONS = ["Why hire me?", "Key Projects & Metrics", "Certifications", "Contact"];

export function ChatSuggestions({ loading, suggestions, messageCount, onSuggestionClick }) {
  const showContextual = !loading && suggestions.length > 0;
  const showInitial = !loading && suggestions.length === 0 && messageCount <= 1;

  if (!showContextual && !showInitial) return null;

  const items = showContextual ? suggestions : INITIAL_SUGGESTIONS;
  const label = showContextual ? "Ask next" : "Get started";

  return (
    <div className="px-4 py-2.5 border-t border-glass-border bg-bg-primary">
      <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wide mb-2">{label}</p>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {items.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onSuggestionClick(q)}
            className="flex-shrink-0 px-3 py-1.5 text-xs font-bold rounded-lg border border-glass-border text-text-secondary bg-bg-secondary hover:bg-accent-primary-light/10 hover:border-accent-primary-light/20 hover:text-accent-primary transition-colors whitespace-nowrap cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
