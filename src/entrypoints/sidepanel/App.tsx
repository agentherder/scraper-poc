import { Button } from "@/components/ui/button";
import { StoreUi } from "@/store";
import * as UiReact from "tinybase/ui-react/with-schemas";

const { useValue, useSetValueCallback, TablesView } = UiReact as StoreUi;

function App() {
  const count = useValue("count");
  const incrementCount = useSetValueCallback(
    "count",
    (_, store) => store.getValue("count") + 1,
  );

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Scraper PoC</h1>
      <Button onClick={incrementCount}>count is {count}</Button>
      <TablesView />
    </div>
  );
}

export default App;
