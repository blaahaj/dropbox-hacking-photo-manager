import {
  type Connectable,
  fromBasicWebSocket,
} from "@blaahaj/conversation/core";

export const fromBrowserWebSocket = (
  webSocket: WebSocket,
  id: string,
): Connectable<string, string> =>
  fromBasicWebSocket<WebSocket["readyState"], string, string>(webSocket, id);
