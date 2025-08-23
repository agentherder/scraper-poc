import type { ContentScriptContext } from "wxt/utils/content-script-context";

export type StreamQuietOptions = {
  debounceMs?: number;
  once?: boolean;
};

export function observeUntilQuiet(
  ctx: ContentScriptContext,
  node: Node,
  onQuiet: () => void,
  opts?: StreamQuietOptions,
): () => void {
  const debounceMs = opts?.debounceMs ?? 1_000;
  const once = opts?.once ?? true;

  let timer: ReturnType<typeof ctx.setTimeout> | undefined;
  const observer = new MutationObserver(() => {
    if (timer) clearTimeout(timer);
    timer = ctx.setTimeout(() => {
      onQuiet();
      if (once) observer.disconnect();
    }, debounceMs);
  });

  observer.observe(node, {
    subtree: true,
    childList: true,
    characterData: true,
  });

  const dispose = () => {
    observer.disconnect();
    if (timer) clearTimeout(timer);
  };

  ctx.addEventListener(window, "beforeunload", dispose);
  return dispose;
}

export function observeAddedWithQuiet(
  ctx: ContentScriptContext,
  selector: string,
  onQuiet: (el: HTMLElement) => void,
  opts?: StreamQuietOptions,
): () => void {
  const disposers = new Map<Element, () => void>();

  const outerObserver = new MutationObserver((muts) => {
    for (const mut of muts) {
      for (const node of Array.from(mut.addedNodes)) {
        const el = node as HTMLElement;
        if (!el?.matches?.(selector)) continue;
        if (disposers.has(el)) continue;
        const dispose = observeUntilQuiet(ctx, el, () => onQuiet(el), opts);
        disposers.set(el, dispose);
      }
    }
  });

  outerObserver.observe(document.body, { subtree: true, childList: true });

  const disposeAll = () => {
    outerObserver.disconnect();
    disposers.forEach((dispose) => dispose());
  };
  ctx.addEventListener(window, "beforeunload", disposeAll);
  return disposeAll;
}
