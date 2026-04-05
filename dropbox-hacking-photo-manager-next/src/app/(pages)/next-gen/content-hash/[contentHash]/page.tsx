"use client";

import Navigate from "@components/Navigation";
import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import logRender from "@lib/logRender";
import React, { useEffect, type Usable } from "react";

// import { PrevNextFileNav } from "../PrevNextFileNav";
import { ShowContentHashResult } from "../ShowContentHashResult";

const NGContentHash = ({
  params: pathParams,
}: {
  params: Usable<{ readonly contentHash: string }>;
}) => {
  const { contentHash } = React.use(pathParams);
  //  context?: { date: string; contentHash: string };
  // const context: { date: string; contentHash: string } | undefined = undefined;

  const latestValue = useLatestValueFromServerFeed({
    type: "rx.ng.content_hash",
    contentHash,
  });

  useEffect(() => {
    document.title = "DPMNG - Content hash";
  }, []);

  return (
    <>
      <Navigate />
      {/* {context && (
        <PrevNextFileNav
          key={`${context.date} ${context.contentHash}`}
          context={context}
        />
      )} */}

      {latestValue ?
        <>
          <ShowContentHashResult
            contentHash={contentHash}
            latestValue={latestValue}
          />
        </>
      : "Loading..."}
    </>
  );
};

export default logRender(NGContentHash);
