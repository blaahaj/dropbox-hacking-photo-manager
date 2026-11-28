import { Digraph } from "ts-graphviz";

export const buildGraph = (
  edges: readonly { readonly from: string; readonly to: string }[],
) => {
  const G = new Digraph();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  G.attributes.graph.set("scale" as any, "5");

  for (const file of new Set(edges.flatMap((e) => [e.from, e.to]))) {
    const label = file
      .split(/(.{30})/g)
      .filter((s) => s !== "")
      .join("\n");

    G.createNode(file, {
      label,
      color: "black",
    });
  }

  const duplicate = [
    ["/logRender.ts", "lr"],
    ["/useLatestValueFromServerFeed.ts", "ulv"],
  ] as const;

  FOO: for (const e of edges) {
    for (const [endsWith, label] of duplicate) {
      if (e.to.endsWith(endsWith)) {
        G.createEdge([e.from, G.createNode(`${e.from}-${label}`, { label })]);
        continue FOO;
      }
    }

    G.createEdge([e.from, e.to]);
  }

  console.log(`${G.nodes.length} nodes, ${G.edges.length} edges`);

  return G;
};
