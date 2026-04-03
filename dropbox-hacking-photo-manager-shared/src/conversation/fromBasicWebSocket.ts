import { generateId2 } from "./id.js";
// import { spyOnConnector } from "./spy.js";
import type { Connectable } from "./types.js";

export interface BasicWebSocket<S, I, O> {
  readonly OPEN: S;
  readonly readyState: S;
  addEventListener(eventName: "close", listener: () => void): void;
  addEventListener(
    eventName: "message",
    listener: (message: { data: I }) => void,
  ): void;
  removeEventListener(eventName: "close", listener: () => void): void;
  removeEventListener(
    eventName: "message",
    listener: (message: { data: I }) => void,
  ): void;
  send(message: O): void; // TODO error handling
  close(): void;
}

export const fromBasicWebSocket = <S, I, O>(
  webSocket: BasicWebSocket<S, I, O>,
  socketId: string,
): Connectable<I, O> => {
  const id = generateId2("fromBasicWebSocket");
  console.debug(`fromBasicWebSocket(${socketId}) -> ${id}`);

  const connector: Connectable<I, O> = {
    connect: (receiver) => {
      if (webSocket.readyState !== webSocket.OPEN)
        throw new Error("Socket is not OPEN");

      const closeListener = () => {
        webSocket.removeEventListener("close", closeListener);
        webSocket.removeEventListener("message", messageListener);
        receiver.end();
      };

      const messageListener = (message: { data: I }) => {
        receiver.push(message.data);
      };

      webSocket.addEventListener("close", closeListener);
      webSocket.addEventListener("message", messageListener);

      const senderId = generateId2("fromBasicWebSocket:connect:tx");
      console.debug(`connect(${id}) -> R=${receiver.id} S=${senderId}`);

      return {
        push: (payload) => webSocket.send(payload),
        end: () => webSocket.close(),
        id: senderId,
      };
    },
    id: id,
  };

  return connector;
  // return spyOnConnector(connector);
};
