"use client";
import { useLatestValueFromServerFeed } from "@/app/_hooks/useLatestValueFromServerFeed";
import { useEffect } from "react";
import Navigate from "@components/navigation";

export default function Test() {
  const latestValue = useLatestValueFromServerFeed({
    type: "rx.ng.basic-counts",
  });

  useEffect(() => {
    document.title = "DPMNG - Basic counts";
  }, []);

  return (
    <main>
      <Navigate />
      <h1>Basic Counts</h1>
      <pre>{JSON.stringify(latestValue, null, 2)}</pre>
    </main>
  );
}
