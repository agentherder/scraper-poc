import { Button } from "@/components/ui/button";
import { useSetValueCallback, useValue } from "@/store";

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
    </div>
  );
}

export default App;
