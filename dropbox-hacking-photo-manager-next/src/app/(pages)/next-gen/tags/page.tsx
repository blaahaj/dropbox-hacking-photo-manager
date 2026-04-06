"use client";

import Navigate from "@components/Navigation";
import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import logRender from "@lib/logRender";
import { useEffect } from "react";

import TagList from "@components/tags/TagList";

const Page = () => {
  const latestValue = useLatestValueFromServerFeed({
    type: "rx.ng.tags",
  });

  useEffect(() => {
    document.title = "DPMNG - tags";
  }, []);

  return (
    <>
      <Navigate />

      <h1>Tags</h1>

      {latestValue ?
        <TagList
          data={latestValue.tags.map(([tag, count]) => ({
            tag,
            count,
          }))}
          linked={true}
        />
      : "loading..."}
    </>
  );
};

export default logRender(Page);
