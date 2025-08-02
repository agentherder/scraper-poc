import { useSetValueCallback, useValue } from "@/store";

function App() {
  const count = useValue("count");
  const incrementCount = useSetValueCallback(
    "count",
    (_, store) => store.getValue("count") + 1,
  );

  return (
    <div className="flex w-64 flex-col items-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Scraper PoC</h1>
      <button
        onClick={incrementCount}
        className="rounded-md bg-amber-700 px-2 py-1 text-white"
      >
        count is {count}
      </button>
    </div>
  );
}

export default App;
