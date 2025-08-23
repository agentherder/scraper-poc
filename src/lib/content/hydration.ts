import type { ContentScriptContext } from "wxt/utils/content-script-context";

export type HydrationOptions = {
  isReady: () => boolean;
  idleMs?: number;
  maxWaitMs?: number;
  root?: Node;
};

export function waitForHydration(
  ctx: ContentScriptContext,
  opts: HydrationOptions,
): Promise<void> {
  const idleMs = opts.idleMs ?? 500;
  const maxWaitMs = opts.maxWaitMs ?? 15_000;
  const root = opts.root ?? document.body;

  return new Promise<void>((resolve) => {
    let idleTimer: ReturnType<typeof ctx.setTimeout> | undefined;
    let maxTimer: ReturnType<typeof ctx.setTimeout> | undefined;
    const observer = new MutationObserver(onMutations);

    function cleanup() {
      observer.disconnect();
      if (idleTimer) clearTimeout(idleTimer);
      if (maxTimer) clearTimeout(maxTimer);
    }

    function finish() {
      cleanup();
      resolve();
    }

    function startIdleWindow() {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = ctx.setTimeout(() => {
        cleanup();
        resolve();
      }, idleMs);
    }

    function onMutations() {
      if (opts.isReady()) startIdleWindow();
    }

    if (opts.isReady()) startIdleWindow();

    observer.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
    });

    maxTimer = ctx.setTimeout(finish, maxWaitMs);

    ctx.addEventListener(window, "beforeunload", cleanup);
  });
}

export function createHydrationScheduler(
  ctx: ContentScriptContext,
  wait: () => Promise<void>,
  fn: () => void,
) {
  let token = 0;
  return () => {
    const current = ++token;
    wait().then(() => {
      if (current !== token || ctx.isInvalid) return;
      fn();
    });
  };
}
