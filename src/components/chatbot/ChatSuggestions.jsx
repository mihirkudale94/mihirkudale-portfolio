const INITIAL_SUGGESTIONS = ["Experience", "Projects", "Skills", "Contact"];

export function ChatSuggestions({ loading, suggestions, messageCount, onSuggestionClick }) {
  const showContextual = !loading && suggestions.length > 0;
  const showInitial = !loading && suggestions.length === 0 && messageCount <= 1;

  if (!showContextual && !showInitial) return null;

  const items = showContextual ? suggestions : INITIAL_SUGGESTIONS;
  const label = showContextual ? "Ask next" : "Get started";

  return (
    <div className="px-4 py-2.5 border-t border-slate-100 bg-white">
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">{label}</p>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {items.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onSuggestionClick(q)}
            className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors whitespace-nowrap"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
