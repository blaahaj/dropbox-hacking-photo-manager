import type { JSONValue } from "@blaahaj/json";
import generateId from "@lib/generateId";
import {
  type IDHolder,
  multiplexer as buildMultiplexer,
  transportAsJson,
  type WrappedPayload,
} from "dropbox-hacking-photo-manager-shared";
import React, {
  type PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react";

import { type Multiplexer, Provider } from "./context";
import { fromBrowserWebSocket } from "./fromBrowserWebSocket";

export const NonRetryingSocketWrapper = ({
  accepter,
  onDead,
  children,
}: PropsWithChildren<{
  accepter: (accept: Multiplexer) => void;
  onDead: () => void;
}>) => {
  const instanceId = useMemo(
    () => generateId(3, "NonRetryingSocketWrapper"),
    [],
  );
  console.log("mxc NonRetryingSocketWrapper", instanceId);

  // const [socket, setSocket] = useState<WebSocket>();
  const [multiplexer, setMultiplexer] = useState<Multiplexer>();

  useEffect(() => {
    const id = generateId(3, "NonRetryingSocketWrapper:effect");
    console.log(
      "mxc NonRetryingSocketWrapper",
      id,
      instanceId,
      "create socket",
    );
    const s = new WebSocket("http://localhost:4000/api/ws2");
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

      const io = buildMultiplexer(jsonTransport, accepter);
      console.log("Made io", io);
      setMultiplexer(() => io);
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
      setMultiplexer(undefined);
      onDead();
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
  }, [accepter, instanceId, onDead]);

  console.log(
    "mxc NonRetryingSocketWrapper",
    instanceId,
    "providing",
    multiplexer,
  );

  return <Provider value={multiplexer}>{children}</Provider>;
};
