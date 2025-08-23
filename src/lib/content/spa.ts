import type { ContentScriptContext } from "wxt/utils/content-script-context";

export type SpaWatcher = {
  dispose(): void;
};

export function watchSpaNavigation(
  ctx: ContentScriptContext,
  onChange: (newUrl: string) => void,
): SpaWatcher {
  let last = location.href;

  const maybeFire = (newUrl: string) => {
    if (newUrl !== last) {
      last = newUrl;
      onChange(newUrl);
    }
  };

  const onWxt = (evt: any) => {
    const next = evt?.newUrl ?? location.href;
    maybeFire(next);
  };

  const onPop = () => maybeFire(location.href);
  const onHash = () => maybeFire(location.href);

  ctx.addEventListener(window, "wxt:locationchange", onWxt);
  ctx.addEventListener(window, "popstate", onPop);
  ctx.addEventListener(window, "hashchange", onHash);

  return { dispose() {} };
}
