/**
 * Input and output guardrails for the chat agent.
 *
 * Kept free of framework and network dependencies so the rules can be unit
 * tested directly — these are the behaviours most likely to regress silently
 * when the system prompt or model changes.
 */

const MAX_INPUT_LENGTH = 1000;

/**
 * Patterns that indicate an attempt to override the agent's instructions.
 * Each entry is labelled so a detection can be logged without echoing the
 * visitor's raw text.
 */
const INJECTION_PATTERNS = [
    { label: 'ignore-instructions', re: /\b(ignore|disregard|forget)\b[^.!?]{0,30}\b(previous|prior|above|earlier|all)\b[^.!?]{0,20}\b(instruction|prompt|rule|direction)/i },
    { label: 'forget-rules', re: /\b(forget|drop|discard)\b[^.!?]{0,20}\byour\b[^.!?]{0,20}\b(rules|instructions|guidelines|constraints)/i },
    { label: 'system-override', re: /\b(system|developer)\b[^.!?]{0,20}\b(prompt|instruction)\b[^.!?]{0,20}\b(override|bypass|replace)/i },
    { label: 'reveal-prompt', re: /\b(reveal|show|print|repeat|output|display)\b[^.!?]{0,30}\b(system|initial|original|your)\b[^.!?]{0,20}\b(prompt|instructions)/i },
    { label: 'roleplay-override', re: /\byou are (now|no longer)\b/i },
    { label: 'persona-injection', re: /\b(act|behave|pretend|respond) as (if you are |though you are )?(a |an )?(dan|jailbroken|unrestricted|unfiltered)/i },
    { label: 'jailbreak-keyword', re: /\b(jailbreak|developer mode enabled|do anything now)\b/i },
    { label: 'fake-system-turn', re: /^\s*(system|assistant)\s*:/i },
];

/**
 * Phrases the agent must never produce — commitments Mihir alone can make,
 * or a first-person impersonation of him.
 */
const BLOCKED_PHRASES = [
    'i promise',
    'guaranteed',
    'mihir will start',
    'mihir can start',
    'he will join',
    'he can join on',
    'salary expectation',
    'compensation',
    'i am mihir',
    'as mihir, i',
    'my name is mihir',
];

const GUARDRAIL_REPLY =
    "I can share factual information about Mihir's portfolio, skills, and experience. For specific arrangements like availability or interviews, please reach out directly via the **Contact** section.";

const INJECTION_REPLY =
    "I can only share factual details about Mihir's skills, projects, and work experience. For specific requests, please check the Contact section.";

/** Trim and bound the visitor's message. Output escaping is handled by the UI. */
export function sanitizeInput(text) {
    if (typeof text !== 'string') return '';
    return text.trim().slice(0, MAX_INPUT_LENGTH);
}

/**
 * @param {string} text
 * @returns {string|null} the matched pattern label, or null when clean
 */
export function detectPromptInjection(text) {
    if (!text || typeof text !== 'string') return null;
    for (const { label, re } of INJECTION_PATTERNS) {
        if (re.test(text)) return label;
    }
    return null;
}

/**
 * @param {string} text
 * @returns {{ text: string, blockedPhrase: string|null }}
 */
export function validateOutput(text) {
    if (!text || typeof text !== 'string') return { text, blockedPhrase: null };

    const lower = text.toLowerCase();
    for (const phrase of BLOCKED_PHRASES) {
        if (lower.includes(phrase)) {
            return { text: GUARDRAIL_REPLY, blockedPhrase: phrase };
        }
    }
    return { text, blockedPhrase: null };
}

export { GUARDRAIL_REPLY, INJECTION_REPLY, BLOCKED_PHRASES, MAX_INPUT_LENGTH };
