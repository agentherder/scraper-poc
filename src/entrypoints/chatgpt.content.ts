import { scrapeChatgptThread } from "@/lib/scrape/chatgpt/thread";
import { qa } from "@/lib/scrape/dom";
import { browser } from "wxt/browser";
import { defineContentScript } from "wxt/utils/define-content-script";

const STREAM_DEBOUNCE_MS = 1000;
const HYDRATION_IDLE_MS = 500;
const HYDRATION_MAX_WAIT_MS = 15000;

export default defineContentScript({
  matches: ["https://chatgpt.com/*"],
  runAt: "document_idle",
  main(ctx) {
    console.log("Scraper PoC loading chatgpt content script");

    const emitCapture = () => {
      const detail = scrapeChatgptThread();
      console.log("Captured", detail);
      // Notify both the extension runtime and any in-page listeners
      browser.runtime.sendMessage(detail);
      window.dispatchEvent(new CustomEvent("AgentHerderCapture", { detail }));
    };

    // Wait for React hydration to complete (heuristic):
    // - Wait until at least one message element exists
    // - Then wait for a short idle period with no DOM mutations
    const waitForHydration = async () =>
      new Promise<void>((resolve) => {
        let idleTimer: ReturnType<typeof ctx.setTimeout> | undefined;
        const startIdle = () => {
          if (idleTimer) clearTimeout(idleTimer);
          idleTimer = ctx.setTimeout(() => {
            observer.disconnect();
            resolve();
          }, HYDRATION_IDLE_MS);
        };

        const hasMessages = () => !!qa(document, "[data-message-id]")?.length;
        const observer = new MutationObserver(() => {
          if (hasMessages()) startIdle();
        });

        // If messages already present, start idle timer immediately
        if (hasMessages()) startIdle();

        observer.observe(document.body, {
          subtree: true,
          childList: true,
          characterData: true,
        });

        // Fallback: don't wait forever
        ctx.setTimeout(() => {
          observer.disconnect();
          resolve();
        }, HYDRATION_MAX_WAIT_MS);
      });

    // Helper: schedule a hydration-aware capture, canceling prior schedules
    const scheduleHydrationCapture = (() => {
      let token = 0;
      return () => {
        const current = ++token;
        waitForHydration().then(() => {
          if (current !== token) return; // superseded by newer schedule
          emitCapture();
        });
      };
    })();

    // Initial capture after hydration
    scheduleHydrationCapture();

    // SPA navigation detection via WXT's locationchange event
    let lastHref = location.href;
    ctx.addEventListener(window, "wxt:locationchange", (evt: any) => {
      const newUrl = evt?.newUrl ?? location.href;
      if (newUrl === lastHref) return;
      lastHref = newUrl;
      scheduleHydrationCapture();
    });

    // Optional belt-and-suspenders: back/forward and hash changes
    ctx.addEventListener(window, "popstate", () => {
      if (location.href !== lastHref) {
        lastHref = location.href;
        scheduleHydrationCapture();
      }
    });
    ctx.addEventListener(window, "hashchange", () => {
      if (location.href !== lastHref) {
        lastHref = location.href;
        scheduleHydrationCapture();
      }
    });

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
