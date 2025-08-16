import React from "react";
import { createIndexedDbPersister } from "tinybase/persisters/persister-indexed-db/with-schemas";
import * as UiReact from "tinybase/ui-react/with-schemas";
import { createStore, TablesSchema, ValuesSchema } from "tinybase/with-schemas";

const STORE_ID = "scraper-poc-store";

const tablesSchema = {
  threads: {
    external_id: { type: "string" },
    platform: { type: "string" },
    service: { type: "string" },
    url: { type: "string" },
    title: { type: "string" },
    scraped_at: { type: "number" },
  },
  messages: {
    thread_id: { type: "string" },
    external_id: { type: "string" },
    role: { type: "string" },
    model: { type: "string" },
    content: { type: "string" },
    source: { type: "string" },
    scraped_at: { type: "number" },
  },
} as const satisfies TablesSchema;

const valuesSchema = {
  count: { type: "number", default: 0 },
} as const satisfies ValuesSchema;

/**
 * Initialize and return TinyBase store and persister.
 * For use as the central persisted store in the extension background service worker.
 */
export async function initStore() {
  const store = createStore().setSchema(tablesSchema, valuesSchema);
  const persister = createIndexedDbPersister(store, STORE_ID);
  await persister.startAutoPersisting();
  return { store, persister };
}

type Schemas = [typeof tablesSchema, typeof valuesSchema];
export type StoreUi = UiReact.WithSchemas<Schemas>;

const { Provider, useCreateStore, useCreatePersister } = UiReact as StoreUi;

/**
 * Initialize TinyBase store and persister
 * and place them in the TinyBase React Provider context
 */
export const StoreProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const store = useCreateStore(() =>
    createStore().setSchema(tablesSchema, valuesSchema),
  );

  const persister = useCreatePersister(store, async (s) =>
    createIndexedDbPersister(s, STORE_ID).startAutoPersisting(),
  );

  return (
    <Provider store={store} persister={persister as any}>
      {children}
    </Provider>
  );
};
