"use client";

import Navigate from "@components/Navigation";
import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import { useEffect } from "react";

const BasicCounts = () => {
  const latestValue = useLatestValueFromServerFeed({
    type: "rx.ng.basic-counts",
  });

  useEffect(() => {
    document.title = "DPMNG - Basic counts";
  }, []);

  return (
    <>
      <Navigate />

      <main style={{ margin: "2em" }}>
        <h1>Basic Counts</h1>

        {latestValue ?
          <pre>{JSON.stringify(latestValue ?? null, null, 2)}</pre>
        : "loading..."}
      </main>
    </>
  );
};

export default BasicCounts;
