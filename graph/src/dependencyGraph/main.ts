import { execFile } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { promisify } from "node:util";

import { toDot } from "ts-graphviz";

import { buildEdges } from "./buildEdges.js";
import { buildGraph } from "./buildGraph.js";

const main = async () => {
  process.chdir("../dropbox-hacking-photo-manager-ui");
  const { edges } = await buildEdges(process.cwd(), "app");
  process.chdir("../graph");

  const G = buildGraph(edges);

  console.log("Writing graph.dot");
  await writeFile("graph.dot", toDot(G), "utf-8");
  console.log("Writing graph.twopi.png");
  await promisify(execFile)("twopi", [
    "graph.dot",
    "-T",
    "png",
    "-o",
    "graph.twopi.png",
  ]);
  console.log("Writing graph.dot.png");
  await promisify(execFile)("dot", [
    "graph.dot",
    "-T",
    "png",
    "-o",
    "graph.dot.png",
  ]);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
