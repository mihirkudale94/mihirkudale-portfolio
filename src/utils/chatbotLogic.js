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

/** Words that signal the visitor is asking about built work, not about a skill. */
const PROJECT_CONTEXT = ["project", "projects", "work", "worked", "built", "build", "dashboard", "dashboards", "portfolio", "show", "made", "created", "example", "examples"];

/** True when the message names a stack AND is asking about work built with it. */
function stackProjectQuery(normalized, stackTerms) {
  const namesStack = stackTerms.some((t) => matches(normalized, t));
  return namesStack && PROJECT_CONTEXT.some((w) => matches(normalized, w));
}

/**
 * Score an intent against the input: the length of its longest matching keyword.
 * Longer matches are more specific, so "python projects" (15) beats "help" (4),
 * which stops generic keywords from swallowing specific questions.
 * An intent may instead supply test() for context-sensitive matching.
 * Returns 0 when nothing matches.
 */
function scoreIntent(normalized, intent) {
  let best = 0;
  for (const kw of intent.keywords ?? []) {
    if (matches(normalized, kw) && kw.length > best) best = kw.length;
  }
  // test() is a strong, context-aware signal, but it must not suppress the
  // intent's keywords — an intent can carry both.
  if (intent.test && intent.test(normalized)) best = Math.max(best, 100);
  return best;
}

/**
 * Skill names normalised the same way as user input, so "Node.js" can match
 * the normalised "node js". Built lazily: normalizeInput depends on consts
 * declared further down this module, so calling it at load time would hit the
 * temporal dead zone.
 */
let knownSkillsCache = null;
function getKnownSkills() {
  if (!knownSkillsCache) {
    knownSkillsCache = categories
      .flatMap((c) => (c.skills ?? []).map((sk) => normalizeInput(sk.name)))
      .filter(Boolean);
  }
  return knownSkillsCache;
}

/**
 * True when the message names a technology but is NOT asking to see built work.
 * "does he know python" is a skills question; "python projects" is not.
 */
function skillQuery(normalized) {
  if (PROJECT_CONTEXT.some((w) => matches(normalized, w))) return false;
  return getKnownSkills().some((sk) => matches(normalized, sk));
}

/** Stopwords that must never on their own identify a project. */
const TITLE_STOPWORDS = new Set(["the", "and", "for", "with", "using", "project", "projects", "data", "analysis", "dashboard", "app", "system", "model", "prediction", "tell", "about", "your", "his", "what", "show"]);

/**
 * Find a project whose title is named in the message.
 * Requires two distinctive title words to match (or one long, rare one),
 * so "dashboard" alone cannot select an arbitrary project.
 */
function findNamedProject(normalized) {
  let best = null;
  let bestHits = 0;
  for (const p of allProjects) {
    const words = normalizeInput(p.title)
      .split(" ")
      .filter((w) => w.length > 2 && !TITLE_STOPWORDS.has(w));
    if (!words.length) continue;
    const hits = words.filter((w) => matches(normalized, w)).length;
    const strong = hits >= 2 || (hits === 1 && words.length === 1 && words[0].length >= 6);
    if (strong && hits > bestHits) {
      bestHits = hits;
      best = p;
    }
  }
  return best;
}

// Intent keywords → response builder. Order matters: first match wins.
const intents = [
  {
    // Highest priority: a specific project was named, so answer about that project.
    test: (n) => findNamedProject(n) !== null,
    response: (n) => {
      const p = findNamedProject(n);
      const links = [
        p.github ? `[GitHub](${p.github})` : null,
        p.demo ? `[Live demo](${p.demo})` : null,
      ].filter(Boolean).join(" • ");
      return `**${p.title}**

${p.description}

**Stack:** ${(p.stack || []).join(", ")}` +
        (links ? `
${links}` : "") +
        `

See the **Projects** section for the rest.`;
    },
  },
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
    keywords: ["certification", "certifications", "certified", "microsoft certified", "google certification", "google certificate", "coursera", "deeplearning"],
    response: () => {
      const lines = (certifications || []).map((c) => `• **${c.title}** – ${c.issuer || ""}`);
      const text = lines.length ? lines.join("\n") : `${name} holds several certifications. Check the **Certifications** section.`;
      return `${name}'s certifications include:\n\n${text}\n\nSee the **Certifications** section for links.`;
    },
  },
  {
    keywords: ["testimonial", "testimonials", "recommendation", "recommendations", "review", "reviews", "people say", "others say", "say about", "feedback", "endorsement", "endorsements", "vouch", "references", "krish naik", "harsh sinha"],
    response: () => {
      const lines = (testimonials || []).map((t) => `**${t.name}** (${t.role || ""}):\n"${(t.quote || "").slice(0, 200)}${(t.quote && t.quote.length > 200) ? "…" : ""}"`);
      const text = lines.length ? lines.join("\n\n") : `See the **Testimonials** section for what others say about ${name}.`;
      return `What people say about ${name}:\n\n${text}\n\nSee the **Testimonials** section for full quotes.`;
    },
  },
  {
    keywords: ["skill", "tech", "technology", "stack", "tools", "what do you use", "languages", "skills", "cloud", "know"],
    test: (n) => ["skill", "tech", "technology", "stack", "tools", "languages", "cloud"].some((k) => matches(n, k)) || skillQuery(n),
    response: () => {
      const list = categories
        .map((cat) => `**${cat.title}:** ${cat.skills.map((s) => s.name).join(", ")}`)
        .join("\n");
      return `Here are ${name}'s main skill areas:\n\n${list}\n\nCheck the **Skills** section on the site for more detail.`;
    },
  },
  {
    test: (n) => stackProjectQuery(n, ["python"]),
    response: () => {
      const projects = allProjects.filter((p) => p.stack.includes("Python"));
      const lines = projects.map((p) => `• **${p.title}**`);
      return `${name}'s Python projects:\n\n${lines.join("\n")}\n\nSee the **Projects** section for details.`;
    },
  },
  {
    test: (n) => stackProjectQuery(n, ["sql", "database"]),
    response: () => {
      const projects = allProjects.filter((p) => p.stack.includes("SQL"));
      const lines = projects.map((p) => `• **${p.title}**`);
      return `${name}'s SQL projects:\n\n${lines.join("\n")}\n\nSee the **Projects** section for details.`;
    },
  },
  {
    test: (n) => stackProjectQuery(n, ["power bi", "powerbi"]),
    response: () => {
      const projects = allProjects.filter((p) => p.stack.includes("Power BI"));
      const lines = projects.map((p) => `• **${p.title}**`);
      return `${name}'s Power BI dashboards:\n\n${lines.join("\n")}\n\nSee the **Projects** section for demos.`;
    },
  },
  {
    test: (n) => stackProjectQuery(n, ["tableau"]),
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
    keywords: ["why hire", "why hire me", "why hire mihir", "why hire you", "benefits", "reasons to hire", "should we hire", "should i hire", "should they hire", "hire him", "hire mihir", "good fit", "right fit", "stand out"],
    response: () =>
      `Here are the top reasons to hire **${name}**:\n\n` +
      `1. **Analytics & FAANG Impact**: Former **Amazon Data Analyst** with hands-on experience in business intelligence, SQL query tuning, and large-scale data analytics.\n` +
      `2. **Microsoft Certified Professional**: Holds DP-100 (Azure Data Scientist), PL-300 (Power BI Analyst), and AI-102 (Azure AI Engineer) certifications, proving enterprise cloud and AI competency.\n` +
      `3. **Technical Versatility**: Proficient in the entire data and intelligence lifecycle — from **Data Engineering**, **Data Analytics**, and **Data Science & AI** (Python, Machine Learning, LLMs) to **Web Integration** (React, Node).\n` +
      `4. **Strong Academic Foundation**: Holds an MCA (Master of Computer Applications) and BCA degree.\n\n` +
      `You can read more in the **About** and **Experience** sections, or connect directly via **[LinkedIn](${linkedin})**!`,
  },
  {
    keywords: ["contact", "email", "reach", "get in touch", "linkedin", "github", "availability"],
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
      `${name} doesn't host a resume publicly. The best way to review his full profile is on **[LinkedIn](${linkedin})** — it has his complete experience, certifications, and recommendations. You can also explore this portfolio site section by section!`,
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
export async function getChatbotReplyAsync(userMessage, conversationHistory = [], onToken = null, signal = null) {
  try {
    const normalized = normalizeInput(userMessage);
    if (!normalized) {
      return { reply: EMPTY_INPUT_REPLY, source: 'rule-based', messages: [{ role: 'assistant', content: EMPTY_INPUT_REPLY }] };
    }

    // Try SSE streaming API first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      if (signal) {
        if (signal.aborted) {
          controller.abort();
        } else {
          signal.addEventListener('abort', () => controller.abort());
        }
      }

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
        if (response.status === 429) {
          const rateLimitMsg = "Rate limit exceeded. You have sent too many messages recently. Please wait a moment before trying again.";
          return {
            reply: rateLimitMsg,
            source: 'api',
            messages: [{ role: 'assistant', content: rateLimitMsg }]
          };
        }
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
      return { reply: data.reply, source: data.source || 'api', action: null, messages: data.messages || [] };

    } catch (apiError) {
      if (apiError.name === 'AbortError') {
        if (signal?.aborted) {
          throw apiError;
        }
        console.warn('API request timed out, using rule-based fallback');
      } else {
        console.warn('API unavailable, using rule-based fallback:', apiError.message);
      }
      return getDefaultReply(normalized);
    }
  } catch (error) {
    if (error.name === 'AbortError' && signal?.aborted) {
      throw error;
    }
    console.error('Chat logic error:', error);
    const errText = "Something went wrong on my side. Please try again or use the Contact section.";
    return {
      reply: errText,
      source: 'error',
      messages: [{ role: 'assistant', content: errText }]
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
  let pendingAction = null;
  let inactivityTimer = null;
  let streamMessages = [];

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => reader.cancel(), 15000);
  };

  try {
    resetInactivityTimer();
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      resetInactivityTimer();
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
              case 'action':
                // Store action to be executed by the frontend
                pendingAction = data;
                break;
              case 'guardrail':
                // Replace entire content with safe version
                fullContent = data.content;
                onToken(null, data.content); // Signal full replacement
                break;
              case 'done':
                source = data.source || 'api';
                streamMessages = data.messages || [];
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

    clearTimeout(inactivityTimer);
    return { reply: fullContent, source, action: pendingAction, messages: streamMessages };
  } catch (err) {
    clearTimeout(inactivityTimer);
    if (fullContent.length > 0) {
      return { reply: fullContent, source: 'api', action: pendingAction, messages: streamMessages };
    }
    throw err;
  }
}

/**
 * Get rule-based reply (fallback logic)
 */
function getDefaultReply(normalized) {
  // Best match, not first match: pick the intent whose matched keyword is most
  // specific. First-match-wins let generic keywords ("help", "hey", "work")
  // intercept questions that a later, more specific intent answers properly.
  let bestIntent = null;
  let bestScore = 0;
  for (const intent of intents) {
    const score = scoreIntent(normalized, intent);
    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent;
    }
  }

  if (bestIntent) {
    const text = bestIntent.response(normalized);
    return { reply: text, source: 'rule-based', messages: [{ role: 'assistant', content: text }] };
  }
  return { reply: FALLBACK_REPLY, source: 'rule-based', messages: [{ role: 'assistant', content: FALLBACK_REPLY }] };
}

