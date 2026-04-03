import type { JSONValue } from "@blaahaj/json";
import generateId from "@lib/generateId";
import {
  type Connectable,
  type IDHolder,
  multiplexer,
  transportAsJson,
  type WrappedPayload,
} from "dropbox-hacking-photo-manager-shared";
import React, {
  type PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Provider } from "./context";
import { fromBrowserWebSocket } from "./fromBrowserWebSocket";

type T = Connectable<JSONValue, JSONValue>;

export const NonRetryingSocketWrapper = (
  props: PropsWithChildren<{
    accepter: (accept: T) => void;
    onDead: () => void;
  }>,
) => {
  const instanceId = useMemo(
    () => generateId(3, "NonRetryingSocketWrapper"),
    [],
  );
  console.log("mxc NonRetryingSocketWrapper", instanceId);

  // const [socket, setSocket] = useState<WebSocket>();
  const [t, setT] = useState<T>();

  useEffect(() => {
    const id = generateId(3, "NonRetryingSocketWrapper:effect");
    console.log(
      "mxc NonRetryingSocketWrapper",
      id,
      instanceId,
      "create socket",
    );
    const s = new WebSocket("/api/ws2");
    // setSocket(s);

    const openListener = () => {
      console.log(
        "mxc NonRetryingSocketWrapper",
        id,
        instanceId,
        "open",
        s?.readyState,
      );

      const stringTransport = fromBrowserWebSocket(s, id);

      const jsonTransport = transportAsJson<
        IDHolder & WrappedPayload<JSONValue>,
        IDHolder & WrappedPayload<JSONValue>
      >(stringTransport);

      const io = multiplexer(jsonTransport, props.accepter);
      console.log("Made io", io);
      setT(() => io);
    };

    const errorListener = (errorEvent: Event) => {
      console.error(
        `mxc NonRetryingSocketWrapper`,
        id,
        instanceId,
        "error",
        errorEvent,
        s?.readyState,
      );
    };

    const closeListener = (closeEvent: CloseEvent) => {
      console.info(
        `mxc NonRetryingSocketWrapper`,
        id,
        instanceId,
        "close",
        closeEvent,
        s?.readyState,
      );
      setT(undefined);
      props.onDead();
    };

    s.addEventListener("open", openListener);
    s.addEventListener("error", errorListener);
    s.addEventListener("close", closeListener);

    return () => {
      console.log(
        "mxc NonRetryingSocketWrapper",
        id,
        instanceId,
        "cleanup",
        s?.readyState,
      );

      s.removeEventListener("open", openListener);
      s.removeEventListener("error", errorListener);
      s.removeEventListener("close", closeListener);

      s?.close();
    };
  }, []);

  console.log("mxc NonRetryingSocketWrapper", instanceId, "providing", t);

  return <Provider value={t}>{props.children}</Provider>;
};
