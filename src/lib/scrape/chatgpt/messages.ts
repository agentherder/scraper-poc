import { qa } from "@/lib/scrape/dom";
import { type WireMessage } from "@/lib/scrape/types";

const ID_ATTRIBUTE = "data-message-id";
const MESSAGES_SELECTOR = "[data-message-id]";
const ROLE_ATTRIBUTE = "data-message-author-role";
const MODEL_ATTRIBUTE = "data-message-model-slug";

export function scrapeChatgptMessages(doc: ParentNode = document): {
  messages: WireMessage[];
  errors: string[];
} {
  const messages: WireMessage[] = [];
  const errors: string[] = [];
  const msgEls = qa(doc, MESSAGES_SELECTOR);
  if (!msgEls) {
    return {
      messages,
      errors: [`Cannot find messages "${MESSAGES_SELECTOR}"`],
    };
  }
  for (const msgEl of msgEls) {
    const external_id = msgEl.getAttribute(ID_ATTRIBUTE);
    if (!external_id) {
      errors.push(`Cannot find message ID "${ID_ATTRIBUTE}"`);
      continue;
    }
    const role = msgEl.getAttribute(ROLE_ATTRIBUTE) || undefined;
    if (!role) {
      errors.push(`Cannot find message role "${ROLE_ATTRIBUTE}"`);
    }
    const model = msgEl.getAttribute(MODEL_ATTRIBUTE) || undefined;
    if (!model) {
      errors.push(`Cannot find message model "${MODEL_ATTRIBUTE}"`);
    }

    messages.push({
      external_id,
      role,
      model,
      content: (role === "user" ? msgEl.textContent : msgEl.innerHTML) || "",
      source: role === "user" ? "innerText" : "innerHTML",
    });
  }
  return { messages, errors };
}
