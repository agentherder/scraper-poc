import { isWireEnvelope } from "@/lib/scrape/types";
import { initStore } from "@/lib/store";
import { buildMessageRowId, buildThreadRowId } from "@/lib/store/id";
import { browser } from "wxt/browser";
import { defineBackground } from "wxt/utils/define-background";

export default defineBackground(() => {
  const storePromise = initStore();

  browser.sidePanel
    ?.setPanelBehavior?.({ openPanelOnActionClick: false })
    .catch(console.error);

  browser.runtime.onMessage.addListener(async (e) => {
    if (!isWireEnvelope(e)) return;

    const { store } = await storePromise;

    if (!e.ok) {
      store.transaction(() => {
        e.notifications?.forEach((notification) => {
          store.addRow("notifications", {
            ...notification,
            created_at: e.scraped_at,
          });
        });
      });
      return;
    }

    store.transaction(() => {
      try {
        const threadId = buildThreadRowId(e.thread);
        const first_seen_at =
          store.getCell("threads", threadId, "first_seen_at") || e.scraped_at;
        store.setRow("threads", threadId, {
          ...e.thread,
          first_seen_at,
          last_seen_at: e.scraped_at,
        });
        e.messages.forEach((message, i) => {
          const messageId = buildMessageRowId(e.thread, message);
          const first_seen_at =
            store.getCell("messages", messageId, "first_seen_at") ||
            e.scraped_at;
          store.setRow("messages", messageId, {
            ...message,
            thread_id: threadId,
            first_seen_at,
            last_seen_at: e.scraped_at,
          });
        });
        e.notifications?.forEach((notification) => {
          store.addRow("notifications", {
            ...notification,
            created_at: e.scraped_at,
          });
        });
      } catch (error) {
        store.addRow("notifications", {
          content: String(error),
          created_at: e.scraped_at,
        });
      }
    });
  });
});
