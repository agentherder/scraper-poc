import { type ScrapedMessage, type ScrapedThread } from "@/scrape/types";
import { genId } from "@/store";
import { scrapeChatgptMessages } from "./messages";

const conversationIdPattern = /^\/c\/([^\/?#]+)(?=\/|$)/;

export const scrapeChatgptThread = (
  doc: ParentNode = document,
  loc: Location = window.location,
  now: () => number = Date.now,
): {
  thread: ScrapedThread;
  messages: ScrapedMessage[];
} => {
  const idMatches = conversationIdPattern.exec(loc.pathname);
  console.log("idMatches", idMatches);
  if (!idMatches) throw Error("No conversation ID found");
  const id = genId();
  const scraped_at = now();
  const messages = scrapeChatgptMessages(id, doc, () => scraped_at);
  const title = (window.document.title || messages[0]?.content || "")
    .trim()
    .slice(0, 255);
  const thread: ScrapedThread = {
    id: genId(),
    external_id: decodeURIComponent(idMatches[1]),
    platform: "openai",
    service: "chatgpt",
    url: loc.href,
    title,
    scraped_at,
  };
  return { thread, messages };
};
