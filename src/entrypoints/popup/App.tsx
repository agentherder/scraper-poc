import { useSetValueCallback, useValue } from "@/store";

function App() {
  const count = useValue("count");
  const incrementCount = useSetValueCallback(
    "count",
    (_, store) => store.getValue("count") + 1,
  );

  return (
    <div className="w-64 p-4 flex flex-col gap-4 items-center">
      <h1 className="text-2xl font-bold">Scraper PoC</h1>
      <button
        onClick={incrementCount}
        className="bg-amber-700 text-white px-2 py-1 rounded-md"
      >
        count is {count}
      </button>
    </div>
  );
}

export default App;
