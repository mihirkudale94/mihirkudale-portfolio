import { memo, Suspense, lazy } from "react";
import { ChatFeedback } from "./ChatFeedback";

const ReactMarkdown = lazy(() => import("react-markdown").then((m) => ({ default: m.default })));

export const ChatMessage = memo(function ChatMessage({ msg, question }) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[85%]">
        <div
          className={`rounded-[1.25rem] px-4 py-3 text-[15px] shadow-sm ${
            isUser
              ? "bg-accent-primary text-white rounded-br-sm shadow-[0_4px_14px_rgba(37,99,235,0.15)]"
              : "bg-bg-primary text-text-secondary rounded-bl-sm border border-glass-border leading-relaxed font-medium"
          }`}
        >
          {isUser ? (
            <span>{msg.content}</span>
          ) : (
            <div className="prose prose-sm max-w-none break-words [&_a]:break-all text-text-secondary font-medium leading-[1.6] [&_a]:text-accent-primary [&_a]:underline [&_strong]:text-text-primary [&_strong]:font-bold">
              {msg.content ? (
                <Suspense fallback={<span>{msg.content}</span>}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </Suspense>
              ) : (
                <span className="inline-block w-1.5 h-4 bg-accent-primary rounded-sm animate-pulse" />
              )}
              {msg.isStreaming && msg.content && (
                <span className="inline-block w-1.5 h-4 bg-accent-primary rounded-sm animate-pulse ms-0.5 align-middle" />
              )}
            </div>
          )}
        </div>
        {!isUser &&
          !msg.isStreaming &&
          msg.content &&
          msg.id !== "msg-welcome" &&
          msg.source !== "error" && (
            <ChatFeedback question={question} answer={msg.content} />
          )}
      </div>
    </div>
  );
});
