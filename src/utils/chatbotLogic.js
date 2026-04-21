/**
 * Chatbot logic – SSE streaming with rule-based fallback.
 * 
 * 2026 Standard: Streams AI tokens from the backend SSE endpoint.
 * Falls back to local rule-based matching when the API is unavailable.
 * 
 * Config: src/constants/chatbot.js
 */
import { aboutMeData } from "../constants/aboutme";
import { contactConfig } from "../constants/contacts";
import { educationList } from "../constants/education";
import { categories } from "../constants/skills";
import { allProjects } from "../constants/projects";
import { certifications } from "../constants/certifications";
import { experiences } from "../constants/workexperience";
import { testimonials } from "../constants/testimonials";
import { homeData } from "../constants/home";

// Safely extract data with fallbacks
const name = aboutMeData?.intro?.name ?? "Mihir";
const title = aboutMeData?.intro?.title ?? "Software Developer";
const focus = aboutMeData?.intro?.focus ?? "Data Analytics and AI";
const email = contactConfig?.socials?.email?.replace("mailto:", "") ?? "";
const location = contactConfig?.locationText ?? "";
const linkedin = contactConfig?.socials?.linkedin ?? "";
const github = contactConfig?.socials?.github ?? "";
const availability = contactConfig?.availabilityText ?? "";

/** Match keyword: whole-word for short words so "mihir" doesn't match "hi" */
function matches(normalized, keyword) {
  if (keyword.length <= 3) {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\b${escaped}\\b`, "i").test(normalized);
  }
  return normalized.includes(keyword);
}

// Intent keywords → response builder. Order matters: first match wins.
const intents = [
  {
    keywords: ["hi", "hello", "hey", "hola", "good morning", "good evening", "howdy", "greetings", "sup", "yo"],
    response: () =>
      `Hi! I'm the portfolio assistant for **${name}**. You can ask about skills, projects, experience, education, certifications, testimonials, or how to get in touch. How can I help?`,
  },
  {
    keywords: ["who are you", "what is this", "what can you do", "help"],
    response: () =>
      `I'm a chatbot on ${name}'s portfolio. I can tell you about:\n• **Who ${name} is** – role, focus, background\n• **Skills** – tech stack and tools\n• **Projects** – key work and links\n• **Education** – degrees and institutions\n• **Work experience** – companies and roles\n• **Certifications** – Microsoft, Google, Coursera, etc.\n• **Testimonials** – what others say\n• **Contact** – email, LinkedIn, location\n\nJust ask in your own words!`,
  },
  {
    keywords: ["education", "degree", "college", "university", "study", "studied", "qualification", "masters", "bachelors", "mca", "bca", "diploma"],
    response: () => {
      const lines = (educationList || []).map((e) => {
        const rest = [e.institution, e.university, e.location, e.duration].filter(Boolean).join(", ");
        return `• **${e.degree}** – ${rest}`;
      });
      const text = lines.length ? lines.join("\n") : `${name}'s education details are in the **Education** section.`;
      return `${name}'s education:\n\n${text}\n\nSee the **Education** section on the site for more.`;
    },
  },
  {
    keywords: ["experience", "work experience", "job", "jobs", "companies", "career", "employed", "where have you worked", "experience at"],
    response: () => {
      const lines = (experiences || []).map((exp) => {
        const roleStr = (exp.roles || []).map((r) => `${r.role} (${r.display || ""})`).join(", ");
        return `• **${exp.company}** – ${exp.location || ""}\n  ${roleStr}`;
      });
      const text = lines.length ? lines.join("\n") : `${name}'s work history is in the **Experience** section.`;
      return `${name}'s work experience:\n\n${text}\n\nSee the **Experience** section for more.`;
    },
  },
  {
    keywords: ["certification", "certifications", "certified", "microsoft certified", "google", "coursera", "ibm", "stanford", "deeplearning"],
    response: () => {
      const lines = (certifications || []).map((c) => `• **${c.title}** – ${c.issuer || ""}`);
      const text = lines.length ? lines.join("\n") : `${name} holds several certifications. Check the **Certifications** section.`;
      return `${name}'s certifications include:\n\n${text}\n\nSee the **Certifications** section for links.`;
    },
  },
  {
    keywords: ["testimonial", "testimonials", "recommendation", "review", "what people say", "what others say", "krish naik", "harsh sinha"],
    response: () => {
      const lines = (testimonials || []).map((t) => `**${t.name}** (${t.role || ""}):\n"${(t.quote || "").slice(0, 200)}${(t.quote && t.quote.length > 200) ? "…" : ""}"`);
      const text = lines.length ? lines.join("\n\n") : `See the **Testimonials** section for what others say about ${name}.`;
      return `What people say about ${name}:\n\n${text}\n\nSee the **Testimonials** section for full quotes.`;
    },
  },
  {
    keywords: ["skill", "tech", "technology", "stack", "tools", "what do you use", "languages", "skills"],
    response: () => {
      const list = categories
        .map((cat) => `**${cat.title}:** ${cat.skills.map((s) => s.name).join(", ")}`)
        .join("\n");
      return `Here are ${name}'s main skill areas:\n\n${list}\n\nCheck the **Skills** section on the site for more detail.`;
    },
  },
  {
    keywords: ["python project", "python projects", "show python"],
    response: () => {
      const projects = allProjects.filter((p) => p.stack.includes("Python"));
      const lines = projects.map((p) => `• **${p.title}**`);
      return `${name}'s Python projects:\n\n${lines.join("\n")}\n\nSee the **Projects** section for details.`;
    },
  },
  {
    keywords: ["sql project", "sql projects", "show sql", "database project"],
    response: () => {
      const projects = allProjects.filter((p) => p.stack.includes("SQL"));
      const lines = projects.map((p) => `• **${p.title}**`);
      return `${name}'s SQL projects:\n\n${lines.join("\n")}\n\nSee the **Projects** section for details.`;
    },
  },
  {
    keywords: ["power bi project", "power bi projects", "power bi dashboard", "powerbi", "show power bi"],
    response: () => {
      const projects = allProjects.filter((p) => p.stack.includes("Power BI"));
      const lines = projects.map((p) => `• **${p.title}**`);
      return `${name}'s Power BI dashboards:\n\n${lines.join("\n")}\n\nSee the **Projects** section for demos.`;
    },
  },
  {
    keywords: ["tableau project", "tableau projects", "tableau dashboard", "tableau visualization", "show tableau"],
    response: () => {
      const projects = allProjects.filter((p) => p.stack.includes("Tableau"));
      const lines = projects.map((p) => `• **${p.title}**`);
      return `${name}'s Tableau visualizations:\n\n${lines.join("\n")}\n\nSee the **Projects** section for demos.`;
    },
  },
  {
    keywords: ["project", "projects", "work", "portfolio", "what have you built", "dashboards"],
    response: () => {
      const pythonCount = allProjects.filter((p) => p.stack.includes("Python")).length;
      const sqlCount = allProjects.filter((p) => p.stack.includes("SQL")).length;
      const powerBiCount = allProjects.filter((p) => p.stack.includes("Power BI")).length;
      const tableauCount = allProjects.filter((p) => p.stack.includes("Tableau")).length;

      return `${name} has **${allProjects.length}+ projects** across 4 categories:\n\n` +
        `• **Python** projects (${pythonCount})\n` +
        `• **SQL** projects (${sqlCount})\n` +
        `• **Power BI** dashboards (${powerBiCount})\n` +
        `• **Tableau** visualizations (${tableauCount})\n\n` +
        `Ask about a specific category like:\n` +
        `"Show Python projects" or "Power BI dashboards" or "Tableau projects"`;
    },
  },
  {
    keywords: ["who is mihir", "who is he", "about yourself", "introduce yourself", "tell me about yourself"],
    response: () =>
      `${name} is a **${title}** focused on **${focus}**. ${aboutMeData.intro.description} ${aboutMeData.sections[1].content} Based in **${location}**. ${availability}`,
  },
  {
    keywords: ["contact", "email", "hire", "reach", "get in touch", "linkedin", "github", "availability"],
    response: () =>
      `You can reach ${name} via:\n• **Email:** ${email}\n• **LinkedIn:** [Profile](${linkedin})\n• **GitHub:** [Profile](${github})\n\n${availability} Use the **Contact** section or the email link to start a conversation.`,
  },
  {
    keywords: ["location", "where", "based", "pune", "remote"],
    response: () =>
      `${name} is based in **${location}**. ${availability}`,
  },
  {
    keywords: ["amazon", "ex-amazon", "microsoft certified", "open to opportunities"],
    response: () =>
      `${name} is a former **Amazon** Data Analyst and **Microsoft Certified** (e.g. PL-300, DP-100, AI-102). ${homeData?.badges?.includes("Open to opportunities") ? "Open to opportunities. " : ""}Check **About** and **Certifications** for more.`,
  },
  {
    keywords: ["thanks", "thank you", "bye", "goodbye", "see you", "later"],
    response: () =>
      `You're welcome! Feel free to ask more or reach out to ${name} directly. Good luck!`,
  },
  {
    keywords: ["resume", "cv", "download", "pdf"],
    response: () =>
      `For ${name}'s resume or CV, please reach out directly via **email** (${email}) or connect on **LinkedIn** ([Profile](${linkedin})). You can also review the **About**, **Experience**, and **Skills** sections on this site for a comprehensive overview.`,
  },
];

// --- Typo corrections ---
const TYPO_CORRECTIONS = {
  "skilz": "skills", "skils": "skills", "skilss": "skills",
  "tecnology": "technology", "tec": "tech", "tecnologies": "technologies",
  "projet": "project", "projcts": "projects", "projecst": "projects",
  "pyhton": "python", "pythn": "python", "phyton": "python",
  "powerbi": "power bi", "powebi": "power bi", "pwer bi": "power bi",
  "tableu": "tableau", "tabluea": "tableau", "tabelau": "tableau",
  "experiance": "experience", "expereince": "experience", "exprience": "experience",
  "experince": "experience", "experienc": "experience",
  "educaton": "education", "educatn": "education", "eductaion": "education",
  "certifcations": "certifications", "certificatons": "certifications",
  "certifcates": "certifications", "certs": "certifications",
  "contct": "contact", "conact": "contact", "cotact": "contact",
  "emal": "email", "emial": "email", "mail": "email",
  "linkdin": "linkedin", "linkin": "linkedin",
  "mihri": "mihir", "mihr": "mihir",
  "abot": "about", "abut": "about",
  "helo": "hello", "hallo": "hello",
};

const COMPILED_TYPO_REGEXES = Object.entries(TYPO_CORRECTIONS).map(
  ([typo, correction]) => ({
    regex: new RegExp(`\\b${typo}\\b`, "gi"),
    correction
  })
);

/**
 * Normalize user input for intent matching.
 */
export function normalizeInput(text) {
  if (typeof text !== "string") return "";
  let normalized = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  for (const { regex, correction } of COMPILED_TYPO_REGEXES) {
    normalized = normalized.replace(regex, correction);
  }

  return normalized;
}

const FALLBACK_REPLY = `I didn't quite get that. Try asking about **${name}** – for example:
• "What are your skills?"
• "Tell me about your projects"
• "What's your education?"
• "How can I contact you?"
• "What certifications do you have?"`;
const EMPTY_INPUT_REPLY = `Ask about ${name} – e.g. "Who is Mihir?", "Education?", "Work experience?", "Certifications?", or "How to contact?"`;

/**
 * Get a reply via SSE streaming from the AI agent backend,
 * with rule-based fallback when the API is unavailable.
 * 
 * @param {string} userMessage - Raw user input
 * @param {Array} conversationHistory - Previous messages for context
 * @param {Function} onToken - Callback invoked with each streamed token chunk: (token: string) => void
 * @returns {Promise<{reply: string, source: 'api' | 'rule-based' | 'error'}>}
 */
export async function getChatbotReplyAsync(userMessage, conversationHistory = [], onToken = null) {
  try {
    const normalized = normalizeInput(userMessage);
    if (!normalized) {
      return { reply: EMPTY_INPUT_REPLY, source: 'rule-based' };
    }

    // Try SSE streaming API first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      let response;
      try {
        response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMessage,
            conversationHistory,
            stream: !!onToken,
          }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // --- Streaming path ---
      if (onToken && response.headers.get('content-type')?.includes('text/event-stream')) {
        return await consumeSSEStream(response, onToken);
      }

      // --- Non-streaming fallback ---
      const data = await response.json();
      if (data.useRuleBased || !data.reply) {
        return getDefaultReply(normalized);
      }
      return { reply: data.reply, source: data.source || 'api' };

    } catch (apiError) {
      if (apiError.name === 'AbortError') {
        console.warn('API request timed out, using rule-based fallback');
      } else {
        console.warn('API unavailable, using rule-based fallback:', apiError.message);
      }
      return getDefaultReply(normalized);
    }
  } catch (error) {
    console.error('Chat logic error:', error);
    return {
      reply: "Something went wrong on my side. Please try again or use the Contact section.",
      source: 'error',
    };
  }
}

/**
 * Consume an SSE stream from the backend, invoking onToken for each chunk.
 * Returns the full accumulated reply when done.
 */
async function consumeSSEStream(response, onToken) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullContent = '';
  let source = 'api';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Parse SSE events from buffer
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer

      let eventType = '';
      for (const line of lines) {
        if (line.startsWith('event: ')) {
          eventType = line.slice(7).trim();
        } else if (line.startsWith('data: ')) {
          const dataStr = line.slice(6);
          try {
            const data = JSON.parse(dataStr);

            switch (eventType) {
              case 'token':
                fullContent += data.content;
                onToken(data.content);
                break;
              case 'guardrail':
                // Replace entire content with safe version
                fullContent = data.content;
                onToken(null, data.content); // Signal full replacement
                break;
              case 'done':
                source = data.source || 'api';
                break;
              case 'error':
                throw new Error(data.error || 'Stream error');
            }
          } catch (parseErr) {
            if (parseErr.message === 'Stream error' || parseErr.message?.startsWith('API')) {
              throw parseErr;
            }
            // Ignore JSON parse errors for incomplete data
          }
          eventType = '';
        }
      }
    }

    return { reply: fullContent, source };
  } catch (err) {
    // If we got partial content, return it; otherwise throw
    if (fullContent.length > 0) {
      return { reply: fullContent, source: 'api' };
    }
    throw err;
  }
}

/**
 * Get rule-based reply (fallback logic)
 */
function getDefaultReply(normalized) {
  for (const { keywords, response } of intents) {
    const matched = keywords.some((kw) => matches(normalized, kw));
    if (matched) {
      return { reply: response(), source: 'rule-based' };
    }
  }
  return { reply: FALLBACK_REPLY, source: 'rule-based' };
}

/**
 * Synchronous fallback for backward compatibility (rule-based only)
 * @deprecated Use getChatbotReplyAsync instead
 */
export function getChatbotReply(userMessage) {
  try {
    const normalized = normalizeInput(userMessage);
    if (!normalized) return EMPTY_INPUT_REPLY;

    for (const { keywords, response } of intents) {
      const matched = keywords.some((kw) => matches(normalized, kw));
      if (matched) return response();
    }
    return FALLBACK_REPLY;
  } catch {
    return "Something went wrong on my side. Please try again or use the Contact section.";
  }
}
