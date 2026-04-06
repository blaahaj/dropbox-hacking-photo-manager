import generateId from "@lib/generateId";
import React, { type PropsWithChildren, useMemo, useState } from "react";

import { type Multiplexer,Provider } from "./context";
import { NonRetryingSocketWrapper } from "./NonRetryingSocketWrapper";

export const GivenFixedAccepter = (
  props: PropsWithChildren<{ accepter: (accept: Multiplexer) => void }>,
): React.ReactElement | null => {
  const instanceId = useMemo(() => generateId(3, "GivenFixedAccepter"), []);

  const [sleepTimer, setSleepTimer] = useState<number>();
  console.log("mxc GivenFixedAccepter", instanceId, sleepTimer);

  const onDead = () => {
    if (!sleepTimer) {
      console.log(`mxc GivenFixedAccepter ${instanceId} dead!`);
      setSleepTimer(
        setTimeout(() => {
          setSleepTimer(undefined);
        }, 1000) as unknown as number,
      );
    }
  };

  return sleepTimer ?
      <Provider value={undefined}>{props.children}</Provider>
    : <NonRetryingSocketWrapper accepter={props.accepter} onDead={onDead}>
        {props.children}
      </NonRetryingSocketWrapper>;
};
