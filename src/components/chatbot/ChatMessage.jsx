import { memo, Suspense, lazy } from "react";
import { Volume2, Square } from "lucide-react";

// Lazy-load ReactMarkdown so it doesn't bloat the main bundle
const ReactMarkdown = lazy(() => import("react-markdown").then((m) => ({ default: m.default })));

/**
 * Single chat message bubble, memoized so streaming token updates
 * only re-render the actively-streaming message, not the whole list.
 */
export const ChatMessage = memo(function ChatMessage({ msg, playingAudioId, onPlayAudio, onStopAudio }) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="flex flex-col max-w-[85%]">
        <div
          className={`rounded-[1.25rem] px-4 py-3 text-[15px] shadow-sm ${
            isUser
              ? "bg-blue-600 text-white rounded-br-sm shadow-[0_4px_14px_rgba(37,99,235,0.2)]"
              : "bg-white text-slate-700 rounded-bl-sm border border-slate-100/80 leading-relaxed font-medium"
          }`}
        >
          {isUser ? (
            <span>{msg.content}</span>
          ) : (
            <div className="prose prose-sm max-w-none break-words [&_a]:break-all text-slate-700 font-medium leading-[1.6] [&_a]:text-blue-600 [&_a]:underline [&_strong]:text-slate-900 [&_strong]:font-bold">
              {msg.content ? (
                <Suspense fallback={<span>{msg.content}</span>}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </Suspense>
              ) : (
                // Empty streaming placeholder — blinking cursor
                <span className="inline-block w-1.5 h-4 bg-blue-500 rounded-sm animate-pulse" />
              )}
              {msg.isStreaming && msg.content && (
                <span className="inline-block w-1.5 h-4 bg-blue-500 rounded-sm animate-pulse ms-0.5 align-middle" />
              )}
            </div>
          )}
        </div>

        {/* TTS button — only on completed bot messages */}
        {!isUser && !msg.isStreaming && msg.content && msg.content !== "Something went wrong. Please try again." && (
          <button
            type="button"
            onClick={() =>
              playingAudioId === msg.id ? onStopAudio() : onPlayAudio(msg.id, msg.content)
            }
            className={`p-1 mt-2 rounded-md border text-slate-500 hover:text-slate-800 transition-colors focus:outline-none ${
              playingAudioId === msg.id
                ? "bg-red-50 text-red-600 border-red-200 hover:text-red-700"
                : "bg-slate-50 border-slate-100 hover:bg-slate-200"
            }`}
            title={playingAudioId === msg.id ? "Stop reading" : "Read aloud"}
            aria-label={playingAudioId === msg.id ? "Stop reading" : "Read aloud"}
          >
            {playingAudioId === msg.id ? (
              <Square className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
});
