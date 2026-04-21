/**
 * Chatbot orchestrator — wires hooks and sub-components together.
 *
 * Hooks:
 *   useChatMessages  — message state, send logic, suggestions
 *   useAudio         — TTS playback
 *   usePrefersReducedMotion — accessibility
 *
 * Sub-components (src/components/chatbot/):
 *   ChatHeader · ChatMessages · ChatSuggestions · ChatInput · ChatToggleButton
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { chatbotConfig } from "../constants/chatbot";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useAudio } from "../hooks/useAudio";
import { useChatMessages } from "../hooks/useChatMessages";
import { ChatHeader } from "./chatbot/ChatHeader";
import { ChatMessages } from "./chatbot/ChatMessages";
import { ChatSuggestions } from "./chatbot/ChatSuggestions";
import { ChatInput } from "./chatbot/ChatInput";
import { ChatToggleButton } from "./chatbot/ChatToggleButton";

function nextMessageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const initialMessages = [
  { id: nextMessageId(), role: "bot", content: chatbotConfig.welcomeMessage },
];

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const dialogRef = useRef(null);

  const prefersReducedMotion = usePrefersReducedMotion();
  const { playingAudioId, handlePlayAudio, handleStopAudio } = useAudio();
  const { messages, loading, streaming, slowResponse, suggestions, sendMessage, handleSuggestionClick } =
    useChatMessages(initialMessages);

  // Focus input when panel opens
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Focus trap for accessibility
  useEffect(() => {
    if (!open || !dialogRef.current) return;
    const dialog = dialogRef.current;
    const focusable = dialog.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleTab = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };

    dialog.addEventListener("keydown", handleTab);
    return () => dialog.removeEventListener("keydown", handleTab);
  }, [open]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setInput("");
    handleStopAudio();
  }, [handleStopAudio]);

  // Escape to close
  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === "Escape" && open) handleClose(); };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  const handleSend = useCallback(() => {
    sendMessage(input);
    setInput("");
  }, [input, sendMessage]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="chatbot-title"
            className="fixed bottom-24 right-6 z-[100] flex flex-col w-[min(380px,calc(100vw-3rem))] h-[min(540px,72vh)] rounded-[1.5rem] bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden"
          >
            <ChatHeader onClose={handleClose} />
            <ChatMessages
              messages={messages}
              loading={loading}
              streaming={streaming}
              slowResponse={slowResponse}
              playingAudioId={playingAudioId}
              onPlayAudio={handlePlayAudio}
              onStopAudio={handleStopAudio}
              prefersReducedMotion={prefersReducedMotion}
            />
            <ChatSuggestions
              loading={loading}
              suggestions={suggestions}
              messageCount={messages.length}
              onSuggestionClick={handleSuggestionClick}
            />
            <ChatInput
              inputRef={inputRef}
              input={input}
              onChange={setInput}
              onSend={handleSend}
              loading={loading}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!open && <ChatToggleButton onOpen={() => setOpen(true)} />}
      </AnimatePresence>
    </>
  );
}

export default Chatbot;
