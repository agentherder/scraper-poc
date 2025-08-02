import { qa } from "@/scrape/dom";
import { type ScrapedMessage } from "@/scrape/types";
import { genId } from "@/store";

export const scrapeChatgptMessages = (
  conversation_id: string,
  doc: ParentNode = document,
  now: () => number = Date.now,
): ScrapedMessage[] => {
  const turns = qa(doc, "[data-testid^='conversation-turn-']");
  if (!turns?.length) {
    return scrapeNodeMessages(conversation_id, doc, now);
  }
  const messages: ScrapedMessage[] = [];
  for (const turnEl of turns) {
    messages.push(...scrapeNodeMessages(conversation_id, turnEl, now));
  }
  return messages;
};

const scrapeNodeMessages = (
  thread_id: string,
  parentNode: ParentNode,
  now: () => number,
): ScrapedMessage[] => {
  const msgEls = qa(parentNode, "[data-message-id]");
  const messages: ScrapedMessage[] = [];
  if (!msgEls) return messages;
  for (const msgEl of msgEls) {
    const role = msgEl.getAttribute("data-message-author-role") || undefined;
    messages.push({
      id: genId(),
      thread_id,
      external_id: msgEl.getAttribute("data-message-id") || undefined,
      role,
      model: msgEl.getAttribute("data-message-model-slug") || undefined,
      content: (role === "user" ? msgEl.textContent : msgEl.innerHTML) || "",
      source: role === "user" ? "innerText" : "innerHTML",
      element: msgEl instanceof HTMLElement ? new WeakRef(msgEl) : undefined,
      scraped_at: now(),
    });
  }
  return messages;
};
