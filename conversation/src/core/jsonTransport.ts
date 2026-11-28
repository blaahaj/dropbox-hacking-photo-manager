import type { JSONValue } from "@blaahaj/json";

import { generateId2 } from "./id.js";
import type { Connectable, MessageRouter } from "./types.js";

export const transportAsJson = <I extends JSONValue, O extends JSONValue>(
  stringConnector: Connectable<string, string>,
): Connectable<I, O> => {
  const connectorId = generateId2("transportAsJson");

  console.debug(`transportAsJson(${stringConnector.id}) -> ${connectorId}`);

  const outerConnector: Connectable<I, O> = {
    connect: (objectReceiver) => {
      const stringReceiverId = generateId2("transportAsJson:connect:rx");
      const senderId = generateId2("transportAsJson:connect:tx");

      const stringReceiver: MessageRouter<string> = {
        push: (message) => objectReceiver.push(JSON.parse(message) as I),
        end: () => objectReceiver.end(),
        id: stringReceiverId,
      };

      const stringSender = stringConnector.connect(stringReceiver);

      const objectSender: MessageRouter<O> = {
        push: (message) => stringSender.push(JSON.stringify(message)),
        end: () => stringSender.end(),
        id: senderId,
      };

      console.debug(
        `connect(${connectorId}) OR=${objectReceiver.id} OS=${senderId} SR=${stringReceiverId} SS=${stringSender.id}`,
      );

      return objectSender;
    },
    id: connectorId,
  };

  return outerConnector;
};
