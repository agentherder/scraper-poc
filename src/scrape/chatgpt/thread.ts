import { WireEnvelope, type WireThread } from "@/scrape/types";
import { scrapeChatgptMessages } from "./messages";

const conversationIdPattern = /^\/c\/([^\/?#]+)(?=\/|$)/;

export function scrapeChatgptThread(
  doc: ParentNode = document,
  loc: Location = window.location,
  now: () => number = Date.now,
): WireEnvelope {
  const idMatches = conversationIdPattern.exec(loc.pathname);
  const scraped_at = now();
  if (!idMatches) {
    return {
      is_scraper_poc_message: true,
      ok: false,
      scraped_at,
      errors: [`Cannot find thread ID in URL "${loc.pathname}"`],
    };
  }
  const { messages, errors } = scrapeChatgptMessages(doc);
  const title = (window.document.title || messages[0]?.content || "")
    .trim()
    .slice(0, 255);
  const thread: WireThread = {
    external_id: decodeURIComponent(idMatches[1]),
    platform: "openai",
    service: "chatgpt",
    url: loc.href,
    title,
  };
  return {
    is_scraper_poc_message: true,
    ok: true,
    scraped_at,
    thread,
    messages,
    errors,
  };
}
