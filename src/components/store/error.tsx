import { StoreUi } from "@/lib/store";
import { AlertCircleIcon } from "lucide-react";
import * as UiReact from "tinybase/ui-react/with-schemas";
import { Alert, AlertDescription } from "../ui/alert";

const { useValue } = UiReact as StoreUi;

export function StoreError() {
  const error = useValue("error");
  if (!error) return null;
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}
