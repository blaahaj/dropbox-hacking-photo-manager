import {
  type Connectable,
  fromBasicWebSocket,
} from "@blaahaj/conversation/core";
import type { WebsocketRequestHandler } from "express-ws";

type WS = Parameters<WebsocketRequestHandler>[0];

export const fromExpressWebSocket = (
  webSocket: WS,
  id: string,
): Connectable<string, string> =>
  fromBasicWebSocket<WS["readyState"], string, string>(webSocket, id);
