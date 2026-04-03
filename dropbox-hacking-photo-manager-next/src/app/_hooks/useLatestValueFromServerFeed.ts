import useMultiplexer from "@/app/_hooks/useMultiplexer";
import { getRxFeed } from "@/app/_lib/rxFeed/getRxFeed";
import type {
  IOHandler,
  ObservableUpdate,
} from "dropbox-hacking-photo-manager-shared";
import type {
  FeedMap,
  RequestTypeFor,
  ResponseTypeFor,
} from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import { useEffect, useMemo, useState } from "react";

export const useLatestValueFromServerFeed = <
  REQ extends RequestTypeFor<keyof FeedMap>,
  NAME extends REQ["type"],
  RES extends ResponseTypeFor<NAME>,
>(
  request: REQ,
) => {
  const mx = useMultiplexer() as IOHandler<ObservableUpdate<RES>, REQ>;
  const serialisedReq = JSON.stringify(request);

  const observer = useMemo(
    () => (mx ? getRxFeed(JSON.parse(serialisedReq), mx) : undefined),
    [mx, serialisedReq],
  );

  const [latestValue, setLatestValue] = useState<RES>();

  useEffect(() => {
    if (observer) {
      const subscription = observer.subscribe(setLatestValue);
      return () => {
        console.log(`ULVFSF effect-close`);
        subscription.unsubscribe();
        setLatestValue(undefined);
      };
    }
  }, [observer]);

  return latestValue;
};
