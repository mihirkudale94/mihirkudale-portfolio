/**
 * Structured JSON logger for Vercel serverless functions.
 * Vercel captures stdout/stderr in production logs — structured JSON
 * makes them searchable and filterable in the dashboard.
 */
function log(level, message, data = {}) {
  const entry = JSON.stringify({
    level,
    message,
    timestamp: new Date().toISOString(),
    ...data,
  });
  if (level === 'error') {
    process.stderr.write(entry + '\n');
  } else {
    process.stdout.write(entry + '\n');
  }
}

export const logger = {
  info:  (msg, data) => log('info',  msg, data),
  warn:  (msg, data) => log('warn',  msg, data),
  error: (msg, data) => log('error', msg, data),
};
