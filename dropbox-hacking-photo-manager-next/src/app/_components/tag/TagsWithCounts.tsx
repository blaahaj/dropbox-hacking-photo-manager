import logRender from "@lib/logRender";
import { type CSSProperties } from "react";
import styles from "./tag.module.css";
import Tag from "./Tag";

const TagsWithCounts = ({
  tags,
  style,
}: {
  tags: Record<string, number>;
  style?: CSSProperties;
}) => {
  return (
    <div className={"tags"} style={style}>
      {Object.entries(tags)
        .toSorted((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([tag, count], index) => (
          <Tag key={index} tag={tag} count={count} linked={false} />
        ))}
    </div>
  );
};

export default logRender(TagsWithCounts, false);
