/**
 * Thread captured by the content script
 * to be sent to the background service worker
 * via chrome.runtime.sendMessage
 */
export type WireThread = {
  /** platform assigned thread id*/
  external_id?: string;
  /** e.g. openai, anthropic, google, xai */
  platform?: string;
  /** e.g. chatgpt, claude, gemini, grok */
  service?: string;
  url?: string;
  title?: string;
  scraped_at: number;
};

/**
 * Message captured by the content script
 * to be sent to the background service worker
 * via chrome.runtime.sendMessage
 */
export type WireMessage = {
  /** platform assigned message id */
  external_id?: string;
  /** e.g. user, assistant */
  role?: string;
  /** e.g. gpt-4o, claude-4-sonnet */
  model?: string;
  content: string;
  /** e.g. innerText, innerHTML */
  source: string;
  scraped_at: number;
};
