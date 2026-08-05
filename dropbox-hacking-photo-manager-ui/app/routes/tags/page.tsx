import Navigate from "@components/Navigation";
import TagList from "@components/tags/TagList";
import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import logRender from "@lib/logRender";
import { useEffect } from "react";

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

      <main style={{ margin: "2em" }}>
        <h1>Tags</h1>

        {latestValue ? (
          <TagList
            data={latestValue.tags.map(([tag, count]) => ({
              tag,
              count,
            }))}
            linked={true}
          />
        ) : (
          "loading..."
        )}
      </main>
    </>
  );
};

export default logRender(Page);
