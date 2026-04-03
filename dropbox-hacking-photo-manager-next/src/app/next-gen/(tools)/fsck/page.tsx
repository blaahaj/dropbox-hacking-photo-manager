"use client";
import Navigate from "@components/navigation";
import { useLatestValueFromServerFeed } from "@/app/_hooks/useLatestValueFromServerFeed";
import logRender from "@/app/_lib/logRender";
import { useEffect } from "react";

const Fsck = () => {
  const latestValue = useLatestValueFromServerFeed({
    type: "rx.ng.fsck",
  });

  useEffect(() => {
    document.title = "DPMNG - fsck";
  }, []);

  return (
    <>
      <Navigate />

      <h1>fsck</h1>

      {latestValue ?
        <pre>{JSON.stringify(latestValue ?? null, null, 2)}</pre>
      : "loading..."}
    </>
  );
};

export default logRender(Fsck);
