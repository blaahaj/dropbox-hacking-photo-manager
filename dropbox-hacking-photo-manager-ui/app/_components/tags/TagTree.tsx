import type { PropsWithChildren } from "react";
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

type TreeNode = {
  debugName: string;
  countHere: number;
  countRecursive: number;
  children: Map<string, TreeNode>;
};

const TagTree = ({
  data,
  linked,
}: {
  data: readonly { readonly tag: string; readonly count?: number }[];
  linked?: boolean;
}) => {
  const rootNode: TreeNode = {
    debugName: "root",
    countHere: 0,
    countRecursive: 0,
    children: new Map(),
  };

  for (const t of data.toSorted(
    (a, b) => a.tag.length - b.tag.length || a.tag.localeCompare(b.tag),
  )) {
    const parts = t.tag.split(":");
    let n = rootNode;

    for (const part of parts) {
      n.countRecursive += t.count || 0;

      let child = n.children.get(part);

      if (!child) {
        child = {
          debugName: n.debugName + ", " + part,
          countHere: 0,
          countRecursive: 0,
          children: new Map(),
        };
        n.children.set(part, child);
      }

      n = child;
    }

    n.countHere = t.count || 0;
    n.countRecursive += t.count || 0;
  }

  const renderNode = (n: TreeNode, name?: string) => (
    <div>
      <p>
        {name && (
          <span
            className={`${styles.tag} ${styles[`tag-${name?.replace(/:.*/, "Star")}`]}`}
            style={{ marginInlineEnd: "0.7em" }}
          >
            <MaybeLinked tag={name} linked={!!linked}>
              {name}
            </MaybeLinked>
          </span>
        )}
        ({n.countHere} / {n.countRecursive})
      </p>
      {n.children.size > 0 && (
        <ol style={{ marginInline: "2em" }}>
          {[...n.children.entries()]
            .toSorted((a, b) => a[0].localeCompare(b[0]))
            .map(([k, v]) => (
              <li key={k}>{renderNode(v, name ? `${name}:${k}` : k)}</li>
            ))}
        </ol>
      )}
    </div>
  );

  return renderNode(rootNode);
};

export default TagTree;
