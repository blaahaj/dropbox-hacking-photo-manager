"use client";

import Navigate from "@components/Navigation";
import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import logRender from "@lib/logRender";
import React, { useEffect } from "react";

const Check = () => {
  const latestValue = useLatestValueFromServerFeed({
    type: "rx.ng.fsck",
  });

  useEffect(() => {
    document.title = "DPMNG - Check";
  }, []);

  return (
    <>
      <Navigate />

      <main style={{ margin: "2em" }}>
        <h1>Check</h1>

        {latestValue ? (
          <pre>{JSON.stringify(latestValue ?? null, null, 2)}</pre>
        ) : (
          "loading..."
        )}
      </main>
    </>
  );
};

export default logRender(Check);
