import { memo, Suspense, lazy } from "react";

const ReactMarkdown = lazy(() => import("react-markdown").then((m) => ({ default: m.default })));

export const ChatMessage = memo(function ChatMessage({ msg }) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[85%]">
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
                <span className="inline-block w-1.5 h-4 bg-blue-500 rounded-sm animate-pulse" />
              )}
              {msg.isStreaming && msg.content && (
                <span className="inline-block w-1.5 h-4 bg-blue-500 rounded-sm animate-pulse ms-0.5 align-middle" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
