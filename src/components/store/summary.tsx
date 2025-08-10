import { StoreUi } from "@/store";
import * as UiReact from "tinybase/ui-react/with-schemas";

const { useRowCount } = UiReact as StoreUi;

export function StoreSummary() {
  const threadCount = useRowCount("threads");
  const messageCount = useRowCount("messages");
  return (
    <div>
      <h2 className="text-lg font-bold">Store Summary</h2>
      <p>Threads: {threadCount}</p>
      <p>Messages: {messageCount}</p>
    </div>
  );
}
