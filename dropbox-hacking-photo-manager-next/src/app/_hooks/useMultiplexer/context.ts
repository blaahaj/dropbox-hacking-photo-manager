import type { JSONValue } from "@blaahaj/json";
import type { Connectable } from "dropbox-hacking-photo-manager-shared";
import { createContext } from "react";

export type Multiplexer = Connectable<JSONValue, JSONValue>;
export const context = createContext<Multiplexer | undefined>(undefined);
export const Provider = context.Provider;
