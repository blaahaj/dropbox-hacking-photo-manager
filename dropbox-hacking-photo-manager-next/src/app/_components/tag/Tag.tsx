import logRender from "@lib/logRender";
import styles from "./tag.module.css";
import SamePageLink from "@components/samePageLink";

const Tag = ({
  tag,
  linked,
  count,
}: {
  tag: string;
  linked: boolean;
  count?: number;
}) => {
  const inner = (
    <>
      {tag}
      {count === undefined ? undefined : <> ({count})</>}
    </>
  );

  return linked ?
      <SamePageLink
        routeState={{
          route: "route/next-gen/search",
          filterText: `tag=${tag}`,
        }}
        className={`${styles.tag} tag-${tag}`}
      >
        {inner}
      </SamePageLink>
    : <a className={`${styles.tag} tag-${tag}`}>{inner}</a>;
};

export default logRender(Tag, false);
