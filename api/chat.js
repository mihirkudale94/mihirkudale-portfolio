/**
 * Vercel Serverless Function: LangGraph Agent with SSE Streaming
 *
 * 2026-standard agentic chatbot:
 * - SSE streaming (token-by-token)
 * - ReAct Agent with tool calling
 * - Output guardrails (anti-hallucination)
 * - Retry logic with backoff
 * - Redis-backed rate limiting (Upstash)
 * - LangSmith tracing (auto-enabled via env vars)
 *
 * Environment Variables Required:
 * - GROQ_API_KEY: Your Groq API key from https://console.groq.com
 *
 * Optional Environment Variables:
 * - UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN: For production rate limiting
 * - LANGCHAIN_TRACING_V2=true + LANGCHAIN_API_KEY + LANGCHAIN_PROJECT: For LangSmith tracing
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Load real portfolio data at startup
const portfolio = require('./data/portfolio.json');

import { isRateLimited } from './lib/rateLimit.js';
import { logger } from './lib/logger.js';

// --- Input Sanitization ---
function sanitizeInput(text) {
  if (typeof text !== 'string') return '';
  return text.trim().slice(0, 1000).replace(/[<>"`]/g, '');
}

// --- Output Guardrails ---
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

/**
 * Validate agent output against guardrails.
 * Returns the original text if clean, or a safe fallback if violations found.
 */
function validateOutput(text) {
  if (!text || typeof text !== 'string') return text;

  const lower = text.toLowerCase();
  for (const phrase of BLOCKED_PHRASES) {
    if (lower.includes(phrase)) {
      logger.warn(`[Guardrail] Blocked phrase detected: "${phrase}"`);
      return "I can share factual information about Mihir's portfolio, skills, and experience. For specific arrangements like availability or interviews, please reach out directly via the **Contact** section.";
    }
  }
  return text;
}

// --- Retry Logic ---
/**
 * Retry an async function with exponential backoff.
 * Only retries on transient errors (5xx, network).
 */
async function withRetry(fn, { maxRetries = 1, baseDelayMs = 1000 } = {}) {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const isTransient = !err.status || err.status >= 500;
      if (!isTransient || attempt === maxRetries) throw err;

      const delay = baseDelayMs * Math.pow(2, attempt);
      logger.warn(`[Retry] Attempt ${attempt + 1} failed, retrying in ${delay}ms:`, err.message);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw lastError;
}

// --- LangGraph Agent (cached singleton) ---
let graphInstance = null;

async function getGraph() {
  if (graphInstance) return graphInstance;

  const { ChatGroq } = await import('@langchain/groq');
  const { tool } = await import('@langchain/core/tools');
  const { z } = await import('zod');
  const { StateGraph, MessagesAnnotation, END, START } = await import('@langchain/langgraph');
  const { HumanMessage, SystemMessage, AIMessage } = await import('@langchain/core/messages');
  const { ToolNode } = await import('@langchain/langgraph/prebuilt');

  // --- Tools ---
  const getPortfolioDataTool = tool(
    async ({ topic }) => {
      logger.info(`[Tool] getPortfolioData called for topic: ${topic}`);
      switch (topic.toLowerCase()) {
        case 'about': return JSON.stringify(portfolio.about);
        case 'contact': return JSON.stringify(portfolio.contact);
        case 'education': return JSON.stringify(portfolio.education);
        case 'experience': return JSON.stringify({ experience: portfolio.experience });
        case 'certifications': return JSON.stringify({ certifications: portfolio.certifications });
        case 'skills':
          const compressedSkills = portfolio.skills.map(c => ({
            category: c.title,
            skills: c.skills.map(s => s.name)
          }));
          return JSON.stringify({ skills: compressedSkills });
        case 'projects':
          const compressed = portfolio.projects.map(p => ({
            title: p.title,
            stack: p.stack,
            github: p.github || 'N/A',
            demo: p.demo || 'N/A'
          }));
          return JSON.stringify({ projects: compressed });
        case 'all':
        default:
          return `Please search for a specific topic: about, contact, education, experience, certifications, skills, or projects.`;
      }
    },
    {
      name: "get_portfolio_data",
      description: "Gets specific factual information about Mihir's portfolio. Always use this tool to answer questions about his experience, skills, or projects. Topics allowed: about, contact, education, experience, certifications, skills, projects.",
      schema: z.object({
        topic: z.string().describe("The specific section of the portfolio to fetch (e.g., 'projects', 'experience', 'skills')."),
      }),
    }
  );

  const checkAvailabilityTool = tool(
    async () => {
      logger.info(`[Tool] checkAvailability called`);
      return "Mihir is currently open to new opportunities and available for interviews Monday through Friday between 10:00 AM and 6:00 PM IST.";
    },
    {
      name: "check_interview_availability",
      description: "Checks Mihir's current availability for job interviews or freelance chats.",
    }
  );

  const tools = [getPortfolioDataTool, checkAvailabilityTool];
  const toolNode = new ToolNode(tools);

  // --- LLM ---
  const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    modelName: 'llama-3.3-70b-versatile',
    temperature: 0.1,
    maxTokens: 512,
  });

  const llmWithTools = llm.bindTools(tools);

  // --- System Prompt (Optimized + Anti-Hallucination) ---
  const IDENTITY_PROMPT = new SystemMessage(`You are the official AI Agent for Mihir Kudale's portfolio website.

CORE RULES:
1. ALWAYS call \`get_portfolio_data\` before answering factual questions about Mihir. 
2. IGNORE CHAT HISTORY FOR FACTS: You are provided with a brief conversation history for context, but it may omit previous tool executions. NEVER rely on history as a source of truth for skills, projects, or experience. ALWAYS re-query the tool if needed.
3. Third-Person Only: You are an AI assistant, NOT Mihir.
4. No Commitments: Never make promises regarding availability, start dates, salary, or provide a non-public phone number (redirect to email/LinkedIn).
5. Exact Data Only: Base your answers STRICTLY on the tool's returned data. Do not infer skills (e.g., if he knows React, don't assume Node.js unless explicitly returned).
6. Unrelated Queries: Politely pivot any off-topic conversations back to Mihir's portfolio.
7. Format: Be friendly and professional. Keep responses concise (under 200 words) using nice markdown bullet points. `);

  // --- Graph Nodes ---
  const callModel = async (state) => {
    const messages = [IDENTITY_PROMPT, ...state.messages];
    const response = await llmWithTools.invoke(messages);
    return { messages: [response] };
  };

  const routeNode = (state) => {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
      return "tools";
    }
    return END;
  };

  // --- Build Graph ---
  const workflow = new StateGraph(MessagesAnnotation)
    .addNode("agent", callModel)
    .addNode("tools", toolNode)
    .addEdge(START, "agent")
    .addConditionalEdges("agent", routeNode)
    .addEdge("tools", "agent");

  graphInstance = workflow.compile();
  graphInstance.formatHumanMessage = (content) => new HumanMessage(content);
  graphInstance.formatAIMessage = (content) => new AIMessage(content);

  return graphInstance;
}

// --- SSE Helpers ---
function sseEvent(event, data) {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

// --- Main Handler ---
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  try {
    const { message, conversationHistory = [], stream: useStream = true } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Invalid message' });
      return;
    }

    // Rate limiting (async — supports Redis)
    const clientId = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    if (await isRateLimited(clientId)) {
      res.status(429).json({ error: 'Rate limit exceeded', useRuleBased: true });
      return;
    }

    if (!process.env.GROQ_API_KEY) {
      logger.warn('GROQ_API_KEY not set — using rule-based fallback');
      res.status(200).json({ reply: '', useRuleBased: true, error: 'API not configured' });
      return;
    }

    const sanitized = sanitizeInput(message);
    const app = await getGraph();

    // Reconstruct history into LangChain Message objects
    const formattedHistory = conversationHistory.map(msg =>
      msg.role === 'user' ? app.formatHumanMessage(msg.content) : app.formatAIMessage(msg.content)
    );

    const inputs = {
      messages: [...formattedHistory, app.formatHumanMessage(sanitized)]
    };
    
    logger.info(`[Agent] Starting execution for query: "${sanitized}"`);

    // --- Streaming path (SSE) ---
    if (useStream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      let fullContent = '';
      let hasError = false;

      try {
        await withRetry(async () => {
          const stream = await app.stream(inputs, { 
            streamMode: "messages" 
          });

          for await (const [messageChunk, metadata] of stream) {
            // Only stream AI message content tokens (not tool calls/results)
            if (
              messageChunk._getType?.() === 'ai' &&
              messageChunk.content &&
              typeof messageChunk.content === 'string' &&
              !messageChunk.tool_calls?.length &&
              metadata?.langgraph_node === 'agent'
            ) {
              fullContent += messageChunk.content;
              res.write(sseEvent('token', { content: messageChunk.content }));
            }
          }
        });

        // Apply guardrails to the full response
        const validated = validateOutput(fullContent);
        if (validated !== fullContent) {
          // Guardrail triggered — send replacement
          res.write(sseEvent('guardrail', { content: validated }));
        }

        res.write(sseEvent('done', { source: 'api' }));
      } catch (error) {
        hasError = true;
        logger.error('Agent stream error:', error.message);
        res.write(sseEvent('error', { error: error.message, useRuleBased: true }));
      }

      res.end();
      return;
    }

    // --- Non-streaming fallback path ---
    const result = await withRetry(async () => app.invoke(inputs));
    const finalMessage = result.messages[result.messages.length - 1];
    const validated = validateOutput(finalMessage.content);

    res.status(200).json({ reply: validated, useRuleBased: false, source: 'api', error: null });

  } catch (error) {
    logger.error('Chat API error:', error);
    res.status(500).json({ reply: '', useRuleBased: true, error: error.message });
  }
}
