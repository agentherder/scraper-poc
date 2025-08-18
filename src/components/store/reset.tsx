import { StoreUi } from "@/lib/store";
import { useCallback } from "react";
import * as UiReact from "tinybase/ui-react/with-schemas";
import { Button } from "../ui/button";

const { useStore } = UiReact as StoreUi;

export function ResetStoreButton() {
  const store = useStore()!;

  const onClick = useCallback(() => {
    if (!confirm("Reset all local TinyBase data?")) return;
    store.transaction(() => {
      store.delTables();
      store.delValues();
    });
  }, [store]);

  return <Button onClick={onClick}>Reset data</Button>;
}
