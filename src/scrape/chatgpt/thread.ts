import { type WireMessage, type WireThread } from "@/scrape/types";
import { scrapeChatgptMessages } from "./messages";

const conversationIdPattern = /^\/c\/([^\/?#]+)(?=\/|$)/;

export const scrapeChatgptThread = (
  doc: ParentNode = document,
  loc: Location = window.location,
  now: () => number = Date.now,
): {
  thread: WireThread;
  messages: WireMessage[];
} => {
  const idMatches = conversationIdPattern.exec(loc.pathname);
  console.log("idMatches", idMatches);
  if (!idMatches) throw Error("No conversation ID found");
  const scraped_at = now();
  const messages = scrapeChatgptMessages(doc, () => scraped_at);
  const title = (window.document.title || messages[0]?.content || "")
    .trim()
    .slice(0, 255);
  const thread: WireThread = {
    external_id: decodeURIComponent(idMatches[1]),
    platform: "openai",
    service: "chatgpt",
    url: loc.href,
    title,
    scraped_at,
  };
  return { thread, messages };
};
