import Navigate from "@components/Navigation";
import TagList from "@components/tags/TagList";
import TagTree from "@components/tags/TagTree";
import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import logRender from "@lib/logRender";
import { useEffect, useState } from "react";

const Page = () => {
  const latestValue = useLatestValueFromServerFeed({
    type: "rx.ng.tags",
  });

  useEffect(() => {
    document.title = "DPMNG - tags";
  }, []);

  const [tree, setTree] = useState(false);

  return (
    <>
      <Navigate />

      <main style={{ margin: "2em" }}>
        <h1>Tags</h1>

        {latestValue ? (
          <div>
            <p>
              <input
                type="checkbox"
                checked={tree}
                onChange={(e) => setTree(e.target.checked)}
              />{" "}
              Show as tree
            </p>

            {tree ? (
              <TagTree
                data={latestValue.tags.map(([tag, count]) => ({
                  tag,
                  count,
                }))}
                linked={true}
              />
            ) : (
              <TagList
                data={latestValue.tags.map(([tag, count]) => ({
                  tag,
                  count,
                }))}
                linked={true}
              />
            )}
          </div>
        ) : (
          "loading..."
        )}
      </main>
    </>
  );
};

export default logRender(Page);
