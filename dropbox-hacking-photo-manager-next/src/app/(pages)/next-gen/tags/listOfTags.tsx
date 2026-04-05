"use client";

import Navigate from "@components/Navigation";
import SamePageLink from "@components/samePageLink";
import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import logRender from "@lib/logRender";
import { useEffect } from "react";

import styles from "./page.module.css";

const ListOfTags = () => {
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
        <ol className={styles.tagList}>
          {latestValue.tags.map(([tag, count]) => (
            <li key={tag}>
              <SamePageLink
                routeState={{
                  route: "route/next-gen/search",
                  filterText: `tag=${tag}`,
                }}
                className={`${styles.tag} ${styles[`tag-${tag.replace(/:.*/, "Star")}`]}`}
              >
                {tag} ({count})
              </SamePageLink>
            </li>
          ))}
        </ol>
      : "loading..."}
    </>
  );
};

export default logRender(ListOfTags);
