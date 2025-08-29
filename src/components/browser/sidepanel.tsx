import { browser } from "wxt/browser";
import { Button } from "../ui/button";

export function OpenSidepanelButton() {
  const openSidepanel = async () => {
    try {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (tab?.id != null) {
        await browser.sidePanel.open({ tabId: tab.id });
        return;
      }

      if (tab?.windowId != null) {
        await browser.sidePanel.open({ windowId: tab.windowId });
        return;
      }
    } catch (error) {
      console.error("Failed to open sidepanel:", error);
    }
  };

  return <Button onClick={openSidepanel}>Open sidepanel</Button>;
}
