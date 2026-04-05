import generateId from "@lib/generateId";
import * as React from "react";
import { PropsWithChildren, useContext, useMemo } from "react";

import { context, type Multiplexer } from "./context";
import { GivenFixedAccepter } from "./GivenFixedAccepter";

const useMultiplexer = (): Multiplexer | undefined => useContext(context);
export default useMultiplexer;

export const DefaultMultiplexerProvider = (
  props: PropsWithChildren<{ accepter: (accept: Multiplexer) => void }>,
): React.ReactElement | null => {
  const instanceId = useMemo(() => generateId(3, "mxc:defaultProvider"), []);
  const key = useMemo(
    () => generateId(3, "mxc:defaultProvider:key"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.accepter],
  );
  console.log("mxc defaultProvider", instanceId, key);

  return <GivenFixedAccepter key={key} {...props} />;
};
