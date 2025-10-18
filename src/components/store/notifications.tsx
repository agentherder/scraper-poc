import { StoreUi } from "@/lib/store";
import { AlertCircleIcon } from "lucide-react";
import * as UiReact from "tinybase/ui-react/with-schemas";
import { Alert, AlertDescription } from "../ui/alert";

const { useSortedRowIds, useRow } = UiReact as StoreUi;

export function StoreNotificationList() {
  const ids = useSortedRowIds("notifications", "created_at");
  if (!ids.length) return null;
  return ids.map((id) => <StoreNotificationItem key={id} id={id} />);
}

function StoreNotificationItem({ id }: { id: string }) {
  const row = useRow("notifications", id);
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertDescription>{row.content}</AlertDescription>
    </Alert>
  );
}
