import type { Connectable } from "@blaahaj/conversation/core";
import type { JSONValue } from "@blaahaj/json";
import { createContext } from "react";

export type Multiplexer = Connectable<JSONValue, JSONValue>;
export const context = createContext<Multiplexer | undefined>(undefined);
export const Provider = context.Provider;
