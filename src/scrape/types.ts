/**
 * Thread and messagescaptured by the content script
 * to be sent to the background service worker
 * via chrome.runtime.sendMessage
 */
export type WireEnvelope = {
  is_scraper_poc_message: true;
  thread: WireThread;
  messages: WireMessage[];
};

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

export function isWireEnvelope(x: unknown): x is WireEnvelope {
  if (!x || typeof x !== "object") return false;
  return (
    "is_scraper_poc_message" in x &&
    x.is_scraper_poc_message === true &&
    "thread" in x &&
    "messages" in x
  );
}
