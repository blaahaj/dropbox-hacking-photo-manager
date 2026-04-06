import SamePageLink from "@components/samePageLink";

import styles from "./tags.module.css";
import type { PropsWithChildren } from "react";

const MaybeLinked = ({
  tag,
  linked,
  children,
}: PropsWithChildren<{ readonly tag: string; readonly linked: boolean }>) =>
  linked ?
    <SamePageLink
      routeState={{
        route: "route/next-gen/search",
        filterText: `tag=${tag}`,
      }}
    >
      {children}
    </SamePageLink>
  : children;

const TagList = ({
  data,
  linked,
}: {
  data: readonly { readonly tag: string; readonly count?: number }[];
  linked?: boolean;
}) => (
  <ol className={styles.tagList}>
    {data.map(({ tag, count }, index) => (
      <li
        key={index}
        className={`${styles.tag} ${styles[`tag-${tag.replace(/:.*/, "Star")}`]}`}
      >
        <MaybeLinked tag={tag} linked={!!linked}>
          {tag}
          {count !== undefined && <> ({count})</>}
        </MaybeLinked>
      </li>
    ))}
  </ol>
);

export default TagList;
