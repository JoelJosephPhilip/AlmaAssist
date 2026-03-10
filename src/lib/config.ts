/* Centralized configuration constants — single source of truth for the entire app */

// ——— OpenRouter AI ———
export const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
export const OPENROUTER_MODEL = "nvidia/nemotron-nano-9b-v2:free";
export const OPENROUTER_KEY_PREFIX = "sk-or-";
export const OPENROUTER_MAX_TOKENS = 2048;
export const OPENROUTER_TEST_MAX_TOKENS = 5;

// ——— Upload limits ———
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export const MAX_TEXT_LENGTH = 500_000;          // ~500 KB (~100 pages)
export const MAX_QUESTIONS = 20;
export const MAX_REFERENCE_DOCS = 8;

// ——— Context truncation ———
export const COMPACT_CONTEXT_CHARS = 40_000;  // ~10K tokens — works with limited credits
export const FULL_CONTEXT_CHARS = 200_000;    // ~50K tokens — needs sufficient credits
