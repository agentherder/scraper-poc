import React from "react";
import { createLocalPersister } from "tinybase/persisters/persister-browser/with-schemas";
import * as UiReact from "tinybase/ui-react/with-schemas";
import {
  createMergeableStore,
  TablesSchema,
  ValuesSchema,
} from "tinybase/with-schemas";

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

type Schemas = [typeof tablesSchema, typeof valuesSchema];

const Ui = UiReact as UiReact.WithSchemas<Schemas>;

export const { useValue, useSetValueCallback } = Ui;

const { Provider, useCreateStore, useCreatePersister } = Ui;

export const StoreProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const store = useCreateStore(() =>
    createMergeableStore().setSchema(tablesSchema, valuesSchema),
  );

  useCreatePersister(
    store,
    (s) => createLocalPersister(s, "scraper-poc-store"),
    [],
    (p) => p.load().then((p) => p.startAutoPersisting),
  );

  return <Provider store={store}>{children}</Provider>;
};
