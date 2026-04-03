"use client";

import Navigate from "@components/navigation";
import SamePageLink from "@components/samePageLink";
import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import logRender from "@lib/logRender";
import { useEffect } from "react";
import styles from "./listOfTags.module.css";
import Tag from "@components/tag/Tag";

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
        <ol className={styles.listOfTags}>
          {latestValue.tags.map(([tag, count]) => (
            <li key={tag}>
              <Tag tag={tag} linked={true} count={count} />
            </li>
          ))}
        </ol>
      : "loading..."}
    </>
  );
};

export default logRender(ListOfTags);
