import { useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";

/**
 * Thumbs up/down on an assistant answer.
 *
 * Fire-and-forget: the vote is recorded optimistically and a failed request is
 * swallowed, because a broken feedback call should never interrupt a chat.
 */
export function ChatFeedback({ question, answer }) {
  const [rated, setRated] = useState(null);

  const submit = (rating) => {
    if (rated) return;
    setRated(rating);

    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, question, answer }),
    }).catch(() => {
      // Non-essential: the visitor keeps the acknowledgement either way.
    });
  };

  if (rated) {
    return (
      <p className="mt-1.5 text-[11px] font-semibold text-text-tertiary" role="status">
        Thanks for the feedback.
      </p>
    );
  }

  return (
    <div className="mt-1.5 flex items-center gap-1">
      <span className="text-[11px] font-semibold text-text-tertiary me-0.5">Helpful?</span>
      <button
        type="button"
        onClick={() => submit("up")}
        className="p-1 rounded-md text-text-tertiary hover:bg-bg-tertiary hover:text-accent-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
        aria-label="Mark this answer helpful"
      >
        <ThumbsUp className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => submit("down")}
        className="p-1 rounded-md text-text-tertiary hover:bg-bg-tertiary hover:text-accent-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
        aria-label="Mark this answer not helpful"
      >
        <ThumbsDown className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
