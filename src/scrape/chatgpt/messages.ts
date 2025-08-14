import { qa } from "@/scrape/dom";
import { type WireMessage } from "@/scrape/types";

export const scrapeChatgptMessages = (
  doc: ParentNode = document,
  now: () => number = Date.now,
): WireMessage[] => {
  const turns = qa(doc, "[data-turn-id]");
  if (!turns?.length) {
    return scrapeNodeMessages(doc, now);
  }
  const messages: WireMessage[] = [];
  for (const turnEl of turns) {
    messages.push(...scrapeNodeMessages(turnEl, now));
  }
  return messages;
};

const scrapeNodeMessages = (
  parentNode: ParentNode,
  now: () => number,
): WireMessage[] => {
  const msgEls = qa(parentNode, "[data-message-id]");
  const messages: WireMessage[] = [];
  if (!msgEls) return messages;
  for (const msgEl of msgEls) {
    const role = msgEl.getAttribute("data-message-author-role") || undefined;
    messages.push({
      external_id: msgEl.getAttribute("data-message-id") || undefined,
      role,
      model: msgEl.getAttribute("data-message-model-slug") || undefined,
      content: (role === "user" ? msgEl.textContent : msgEl.innerHTML) || "",
      source: role === "user" ? "innerText" : "innerHTML",
      scraped_at: now(),
    });
  }
  return messages;
};
