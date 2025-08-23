import { emitCapture } from "@/lib/content/capture";
import {
  createHydrationScheduler,
  waitForHydration,
} from "@/lib/content/hydration";
import { watchSpaNavigation } from "@/lib/content/spa";
import { observeAddedWithQuiet } from "@/lib/content/stream";
import { scrapeChatgptThread } from "@/lib/scrape/chatgpt/thread";
import { defineContentScript } from "wxt/utils/define-content-script";

const STREAM_DEBOUNCE_MS = 1000;
const HYDRATION_IDLE_MS = 500;
const HYDRATION_MAX_WAIT_MS = 15000;

export default defineContentScript({
  matches: ["https://chatgpt.com/*"],
  runAt: "document_idle",
  main(ctx) {
    console.log("Scraper PoC loading chatgpt content script");

    const captureNow = () => {
      const detail = scrapeChatgptThread();
      console.log("Captured", detail);
      emitCapture(detail);
    };

    const hasAnyMessages = () => !!document.querySelector("[data-message-id]");

    const wait = () =>
      waitForHydration(ctx, {
        isReady: hasAnyMessages,
        idleMs: HYDRATION_IDLE_MS,
        maxWaitMs: HYDRATION_MAX_WAIT_MS,
      });

    const scheduleHydrationCapture = createHydrationScheduler(
      ctx,
      wait,
      captureNow,
    );

    scheduleHydrationCapture();

    watchSpaNavigation(ctx, () => scheduleHydrationCapture());

    observeAddedWithQuiet(
      ctx,
      "[data-message-author-role='assistant']",
      () => captureNow(),
      { debounceMs: STREAM_DEBOUNCE_MS, once: true },
    );
  },
});
