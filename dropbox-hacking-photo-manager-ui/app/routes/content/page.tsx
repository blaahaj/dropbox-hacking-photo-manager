import Navigate from "@components/Navigation";
import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import logRender from "@lib/logRender";
import { useEffect } from "react";

import type { Route } from "./+types";
import { ShowContentHashResult } from "./ShowContentHashResult";

const NGContentHash = ({ params }: Route.ComponentProps) => {
  const contentHash = params.contentHash;
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

      <main style={{ margin: "2em" }}>
        {/* {context && (
        <PrevNextFileNav
          key={`${context.date} ${context.contentHash}`}
          context={context}
        />
      )} */}

        {latestValue ? (
          <>
            <ShowContentHashResult
              contentHash={contentHash}
              latestValue={latestValue}
            />
          </>
        ) : (
          "Loading..."
        )}
      </main>
    </>
  );
};

export default logRender(NGContentHash);
