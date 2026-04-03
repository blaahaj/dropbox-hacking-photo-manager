// import type { JSONValue } from "@blaahaj/json";
import useMultiplexer from "@hooks/useMultiplexer";
import { getRxFeed } from "@lib/rxFeed/getRxFeed";
import type {
  Connectable,
  ObservableUpdate,
} from "dropbox-hacking-photo-manager-shared";
import type {
  FeedMap,
  RequestTypeFor,
  ResponseTypeFor,
} from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import { useEffect, useMemo, useState } from "react";

import type { ReadOnlyJSONValue } from "./useMultiplexer/context";

const trustInputFormat = <
  WantIn extends ActualIn,
  WantOut extends ActualOut,
  ActualIn,
  ActualOut,
>(
  io: Connectable<ActualIn, ActualOut>,
): Connectable<WantIn, WantOut> => {
  return io as unknown as Connectable<WantIn, WantOut>;
};

export const useLatestValueFromServerFeed = <
  REQ extends RequestTypeFor<keyof FeedMap>,
  NAME extends REQ["type"],
  RES extends ResponseTypeFor<NAME>,
>(
  request: REQ,
) => {
  const mx = useMultiplexer(); // as Connectable<ObservableUpdate<RES>, REQ>;
  const typedMx = mx
    ? (trustInputFormat(mx) as Connectable<
        ObservableUpdate<RES, ReadOnlyJSONValue>,
        REQ
      > | null)
    : null;

  const observer = useMemo(
    () => (typedMx ? getRxFeed(request, typedMx) : undefined),
    [mx, JSON.stringify(request)],
  );

  const [latestValue, setLatestValue] = useState<RES>();

  useEffect(() => {
    if (observer) {
      const subscription = observer.subscribe(setLatestValue);
      return () => {
        console.log(`useLatestValueFromServerFeed effect-close`);
        subscription.unsubscribe();
        setLatestValue(undefined);
      };
    }
  }, [observer]);

  return latestValue;
};
