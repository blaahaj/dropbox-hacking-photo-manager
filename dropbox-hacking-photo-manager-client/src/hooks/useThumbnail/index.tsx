import useMultiplexer from "@hooks/useMultiplexer";
import type { Connectable } from "dropbox-hacking-photo-manager-shared";
import * as React from "react";
import { createContext, PropsWithChildren, useContext, useMemo } from "react";

import { discardingThumbnailLoader } from "./discardingThumbnailLoader";
import { nullLoader } from "./nullThumbnailLoader";
import type { ThumbnailLoader } from "./types";
import { useThumbnail } from "./useThumbnail";
import { websocketThumbnailLoader } from "./websocketThumbnailLoader";

export const context = createContext<ThumbnailLoader>(nullLoader);
export const useThumbnailLoader = (): ThumbnailLoader => useContext(context);

// WantOut extends ActualOut is fine: e.g. if the transport can
// handle JSONValue, and we want to send number[], then we know
// that there's no problem.
//
// On the other hand, WantIn extends ActualIn is more a statement of hope.
// If the transport can give us an ActualIn (e.g. JSONValue), but we
// can only actually accept WantIn (e.g. number[]), then we are placing
// our trust in the protocol that, of all the JSONValue's that the transport
// *could* send us, it's only ever actually going to be number[].
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

export const defaultProvider = (
  props: PropsWithChildren<unknown>,
): React.ReactElement | null => {
  const mx = useMultiplexer();
  const loader = useMemo(
    () =>
      mx
        ? discardingThumbnailLoader(
            websocketThumbnailLoader(trustInputFormat(mx)),
            30_000,
          )
        : nullLoader,
    [mx],
  );

  return <context.Provider value={loader}>{props.children}</context.Provider>;
};

export default useThumbnail;
