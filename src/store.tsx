import React from "react";
import { createLocalPersister } from "tinybase/persisters/persister-browser/with-schemas";
import * as UiReact from "tinybase/ui-react/with-schemas";
import { createStore, getUniqueId } from "tinybase/with-schemas";

const tablesSchema = {} as const;
const valuesSchema = { count: { type: "number", default: 0 } } as const;
type Schemas = [typeof tablesSchema, typeof valuesSchema];

const Ui = UiReact as UiReact.WithSchemas<Schemas>;

export const { useValue, useSetValueCallback } = Ui;

const { Provider, useCreateStore, useCreatePersister } = Ui;

export const StoreProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const store = useCreateStore(() =>
    createStore().setSchema(tablesSchema, valuesSchema),
  );

  useCreatePersister(
    store,
    (s) => createLocalPersister(s, "scraper-poc-store"),
    [],
    (p) => p.load().then((p) => p.startAutoPersisting),
  );

  return <Provider store={store}>{children}</Provider>;
};

export const genId = () => getUniqueId();
