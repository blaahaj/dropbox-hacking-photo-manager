import type { CSSProperties, PropsWithChildren } from "react";
import { Link } from "react-router";

import stylesRaw from "./TagList.module.css";

const styles = stylesRaw as typeof stylesRaw &
  Record<`tag-${string}`, string | undefined>;

const MaybeLinked = ({
  tag,
  linked,
  children,
}: PropsWithChildren<{ readonly tag: string; readonly linked: boolean }>) =>
  linked ? (
    <Link to={`/search/experiment?q=${encodeURI(`tag=${tag}`)}`}>
      {children}
    </Link>
  ) : (
    children
  );

const TagList = ({
  data,
  linked,
  style,
}: {
  data: readonly { readonly tag: string; readonly count?: number }[];
  linked?: boolean;
  style?: CSSProperties;
}) => (
  <ol className={styles.tagList} style={style}>
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
