import logRender from "@lib/logRender";
import React, { type CSSProperties } from "react";

import styles from "../tags/page.module.css";

const TagsWithCounts = ({
  tags,
  style,
}: {
  tags: Record<string, number>;
  style?: CSSProperties;
}) => {
  return (
    <div className={styles.tags} style={style}>
      {Object.entries(tags)
        .toSorted((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([tag, count], index) => (
          <span
            key={index}
            className={`${styles.tag} ${styles[`tag-${tag.replace(/:.*/, "Star")}`]}`}
          >
            {tag} ({count})
          </span>
        ))}
    </div>
  );
};

export default logRender(TagsWithCounts, false);
