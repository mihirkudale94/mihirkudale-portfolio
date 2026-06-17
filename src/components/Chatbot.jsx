/**
 * Chatbot orchestrator — wires hooks and sub-components together.
 *
 * Hooks:
 *   useChatMessages  — message state, send logic, suggestions
 *   usePrefersReducedMotion — accessibility
 *
 * Sub-components (src/components/chatbot/):
 *   ChatHeader · ChatMessages · ChatSuggestions · ChatInput · ChatToggleButton
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { chatbotConfig } from "../constants/chatbot";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useChatMessages } from "../hooks/useChatMessages";
import { ChatHeader } from "./chatbot/ChatHeader";
import { ChatMessages } from "./chatbot/ChatMessages";
import { ChatSuggestions } from "./chatbot/ChatSuggestions";
import { ChatInput } from "./chatbot/ChatInput";
import { ChatToggleButton } from "./chatbot/ChatToggleButton";
import { useActiveSection } from "../hooks/useActiveSection";

const initialMessages = [
  { id: "msg-welcome", role: "bot", content: chatbotConfig.welcomeMessage },
];

const SECTION_IDS = [
  "home",
  "about",
  "skills",
  "experience",
  "projects",
  "education",
  "certifications",
  "testimonials",
  "contact",
];

const SECTION_SUGGESTIONS = {
  home: ["Why hire me?", "Key Projects & Metrics", "Certifications", "Contact"],
  about: ["Who is Mihir?", "Work experience?", "Availability?"],
  skills: ["Show Python projects", "Power BI dashboards", "Microsoft Certifications"],
  experience: ["Experience at Amazon?", "GovTech role details?", "Why hire me?"],
  projects: ["What tech stack?", "Any live dashboards?", "Amazon Sales project?"],
  education: ["Microsoft Certifications", "Work experience?", "Technical Skills"],
  certifications: ["Microsoft Certified?", "Azure AI Engineer?", "Azure Data Scientist?"],
  testimonials: ["Harsh Sinha testimonial?", "Krish Naik recommendation?", "Why hire me?"],
  contact: ["About me?", "Availability?", "View projects"],
};

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const dialogRef = useRef(null);

  const prefersReducedMotion = usePrefersReducedMotion();
  const { messages, loading, streaming, slowResponse, suggestions, sendMessage, handleSuggestionClick } =
    useChatMessages(initialMessages);

  const activeSection = useActiveSection(SECTION_IDS);
  const activeSuggestions = SECTION_SUGGESTIONS[activeSection] || SECTION_SUGGESTIONS.home;

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
  }, []);

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
            className="fixed bottom-24 right-6 z-[100] flex flex-col w-[min(380px,calc(100vw-3rem))] h-[min(540px,72vh)] rounded-[1.5rem] bg-glass-bg backdrop-blur-2xl border border-glass-border shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] overflow-hidden"
          >
            <ChatHeader onClose={handleClose} />
            <ChatMessages
              messages={messages}
              loading={loading}
              streaming={streaming}
              slowResponse={slowResponse}
              prefersReducedMotion={prefersReducedMotion}
            />
            <ChatSuggestions
              loading={loading}
              suggestions={suggestions}
              initialSuggestions={activeSuggestions}
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
