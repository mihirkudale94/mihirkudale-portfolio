/**
 * Chatbot configuration – single source of truth for UI and behavior.
 * Change here to tune limits, copy, and timing without touching component logic.
 */
export const chatbotConfig = {
  /** Display name in header */
  botName: "Mihir's AI Assistant",

  /** First message shown when chat opens */
  welcomeMessage:
    "Hi! I'm the assistant for this portfolio. Ask me about **Mihir** – skills, projects, education, work experience, certifications, or how to get in touch.",

  /** Max characters accepted per message (prevents abuse and keeps responses fast) */
  maxInputLength: 500,

  /** Delay (ms) before showing bot reply – set to 0 for instant response */
  replyDelayMs: 0,
};
