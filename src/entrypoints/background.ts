import { isWireEnvelope } from "@/scrape/types";
import { initStore } from "@/store";
import { browser } from "wxt/browser";
import { defineBackground } from "wxt/utils/define-background";

export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });
  const storePromise = initStore();
  browser.runtime.onMessage.addListener(async (message) => {
    if (!isWireEnvelope(message)) return;
    console.log("Received wire envelope", message);
    const { store } = await storePromise;
    store.transaction(() => {
      const thread_id = store.addRow("threads", message.thread);
      message.messages.forEach((message) => {
        store.addRow("messages", { ...message, thread_id });
      });
    });
  });
});
