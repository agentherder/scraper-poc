/**
 * Thread and messagescaptured by the content script
 * to be sent to the background service worker
 * via chrome.runtime.sendMessage
 */
export type WireEnvelope =
  | {
      is_scraper_poc_message: true;
      ok: true;
      scraped_at: number;
      thread: WireThread;
      messages: WireMessage[];
      errors: string[];
    }
  | {
      is_scraper_poc_message: true;
      ok: false;
      scraped_at: number;
      thread?: never;
      messages?: never;
      errors: string[];
    };

export type WireThread = {
  /** e.g. openai, anthropic, google, xai */
  platform: string;
  /** e.g. chatgpt, claude, gemini, grok */
  service: string;
  /** platform assigned thread id*/
  external_id: string;
  url: string;
  title?: string;
};

export type WireMessage = {
  /** platform assigned message id */
  external_id: string;
  /** e.g. user, assistant */
  role?: string;
  /** e.g. gpt-4o, claude-4-sonnet */
  model?: string;
  content: string;
  /** e.g. innerText, innerHTML */
  source: string;
};

export function isWireEnvelope(x: unknown): x is WireEnvelope {
  if (!x || typeof x !== "object") return false;
  if (!("is_scraper_poc_message" in x)) return false;
  if (x.is_scraper_poc_message !== true) return false;
  if (!("ok" in x)) return false;
  if (typeof x.ok !== "boolean") return false;
  if (!("scraped_at" in x)) return false;
  if (typeof x.scraped_at !== "number") return false;
  // skip exhaustive check for now
  return true;
}
