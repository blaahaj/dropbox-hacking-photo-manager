import { deepStrictEqual } from "node:assert";
import { it, suite } from "node:test";

import type { JSONValue } from "@blaahaj/json";

import { type MessageRouter, transportAsJson } from "../../src/index.js";

const createHarness = () => {
  const stringsSent: (string | undefined)[] = [];
  const stringSender: MessageRouter<string> = {
    push: (message) => stringsSent.push(message),
    end: () => stringsSent.push(undefined),
    id: `[test code]`,
  };

  const objectsReceived: (JSONValue | undefined)[] = [];
  const objectReceiver: MessageRouter<JSONValue> = {
    push: (message) => objectsReceived.push(message),
    end: () => objectsReceived.push(undefined),
    id: `[test code]`,
  };

  let stringReceiver: MessageRouter<string> =
    undefined as unknown as MessageRouter<string>;
  const objectSender = transportAsJson({
    connect: (r) => {
      stringReceiver = r;
      return stringSender;
    },
    id: `[test code]`,
  }).connect(objectReceiver);

  return {
    stringReceiver,
    objectSender,
    stringsSent,
    objectsReceived,
  };
};

void suite("jsonTransport", () => {
  void it("encodes before sending", () => {
    const harness = createHarness();
    harness.objectSender.push([1, "two", { foo: true }, null]);
    deepStrictEqual(harness.stringsSent, ['[1,"two",{"foo":true},null]']);
  });

  void it("passes on sender-end", () => {
    const harness = createHarness();
    harness.objectSender.end();
    deepStrictEqual(harness.stringsSent, [undefined]);
  });

  void it("decodes after receiving", () => {
    const harness = createHarness();
    harness.stringReceiver.push('[1,"two",{"foo":true},null]');
    deepStrictEqual(harness.objectsReceived, [[1, "two", { foo: true }, null]]);
  });

  void it("passes on receiver-end", () => {
    const harness = createHarness();
    harness.stringReceiver.end();
    deepStrictEqual(harness.objectsReceived, [undefined]);
  });
});
