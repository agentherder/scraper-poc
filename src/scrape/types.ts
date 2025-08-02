export type ScrapedThread = {
  /** db primary key */
  id: string;
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

export type ScrapedMessage = {
  /** db primary key */
  id: string;
  /** db foreign key */
  thread_id: string;
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
  element?: WeakRef<HTMLElement>;
};
