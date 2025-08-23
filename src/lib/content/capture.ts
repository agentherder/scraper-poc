import { browser } from "wxt/browser";

export function emitCapture<T>(detail: T, eventName = "AgentHerderCapture") {
  browser.runtime.sendMessage(detail);
  window.dispatchEvent(new CustomEvent<T>(eventName, { detail }));
}
