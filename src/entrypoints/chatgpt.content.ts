import { scrapeChatgptThread } from "@/scrape/chatgpt/thread";
import { browser } from "wxt/browser";
import { defineContentScript } from "wxt/utils/define-content-script";

const STREAM_DEBOUNCE_MS = 1000;

export default defineContentScript({
  matches: ["https://chatgpt.com/*"],
  main(ctx) {
    console.log("Scraper PoC loading chatgpt content script");
    const data = scrapeChatgptThread();
    console.log(data);
    browser.runtime.sendMessage(data);

    const emitCapture = () => {
      const detail = scrapeChatgptThread();
      console.log("Captured", detail);
      window.dispatchEvent(new CustomEvent("AgentHerderCapture", { detail }));
    };

    const bodyObserver = new MutationObserver((muts) => {
      for (const mut of muts) {
        for (const node of mut.addedNodes) {
          const msgEl = node as HTMLElement | undefined;
          if (!msgEl?.matches?.("[data-message-author-role='assistant']"))
            continue;

          // Debounce until streaming appears to be finished
          let timer: ReturnType<typeof ctx.setTimeout> | undefined;
          const msgObserver = new MutationObserver(() => {
            if (timer) clearTimeout(timer);
            timer = ctx.setTimeout(() => {
              // ctx helper cleans up on unload
              emitCapture();
              msgObserver.disconnect();
            }, STREAM_DEBOUNCE_MS);
          });

          msgObserver.observe(msgEl, {
            subtree: true,
            childList: true,
            characterData: true,
          });
        }
      }
    });

    bodyObserver.observe(document.body, { subtree: true, childList: true });
    addEventListener("beforeunload", () => bodyObserver.disconnect());
  },
});
