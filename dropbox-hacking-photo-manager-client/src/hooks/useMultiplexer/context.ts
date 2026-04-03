// import type { JSONValue } from "@blaahaj/json";
import type { Connectable } from "dropbox-hacking-photo-manager-shared";
import { createContext } from "react";

export type ReadOnlyJSONValue =
  | ReadOnlyJSONScalar
  | ReadOnlyJSONArray
  | ReadOnlyJSONObject
  | null;
export type ReadOnlyJSONScalar = string | number | boolean;
export type ReadOnlyJSONArray = readonly ReadOnlyJSONValue[];
export type ReadOnlyJSONObject = {
  readonly [name: string]: ReadOnlyJSONValue;
};

export type T = Connectable<ReadOnlyJSONValue, ReadOnlyJSONValue>;
export const context = createContext<T | undefined>(undefined);
export const Provider = context.Provider;
