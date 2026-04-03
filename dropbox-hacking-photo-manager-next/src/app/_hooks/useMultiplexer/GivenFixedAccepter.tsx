import generateId from "@/app/_lib/generateId";
import React, { type PropsWithChildren, useMemo, useState } from "react";

import { Provider, type T } from "./context";
import { NonRetryingSocketWrapper } from "./NonRetryingSocketWrapper";

export const GivenFixedAccepter = (
  props: PropsWithChildren<{ accepter: (accept: T) => void }>,
): React.ReactElement | null => {
  const instanceId = useMemo(() => generateId("GivenFixedAccepter"), []);

  const [sleepTimer, setSleepTimer] = useState<number>();
  console.log("mxc GivenFixedAccepter", instanceId, sleepTimer);

  const onDead = useMemo(
    () => () => {
      if (!sleepTimer) {
        console.log(`mxc GivenFixedAccepter ${instanceId} dead!`);
        setSleepTimer(
          setTimeout(() => {
            setSleepTimer(undefined);
          }, 1000) as unknown as number,
        );
      }
    },
    [instanceId, sleepTimer],
  );

  return sleepTimer ?
      <Provider value={undefined}>{props.children}</Provider>
    : <NonRetryingSocketWrapper accepter={props.accepter} onDead={onDead}>
        {props.children}
      </NonRetryingSocketWrapper>;
};
