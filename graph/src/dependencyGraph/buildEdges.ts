import { join, resolve } from "node:path";

import { compileTS } from "./compileTS.js";
import { resolveSpec } from "./resolveSpec.js";
import { scanFilesInDir } from "./scanFilesInDir.js";

export const buildEdges = async (baseDir: string, appDir: string) => {
  const files = await scanFilesInDir(join(baseDir, appDir));
  const paths = files.map((r) => join(r.dir, r.name));

  const r = await compileTS(
    paths.filter((n) => n.match(/\.tsx?$/)),
    baseDir,
    appDir,
  );

  const keyPaths = Object.entries(r.paths ?? {})
    .toSorted((a, b) => b[0].length - a[0].length)
    .map(([k, v]) => ({ k, v: v.map((s) => resolve(baseDir, s)) }));

  const edges: { from: string; to: string }[] = [];

  for (const e of r.imports) {
    if (e.moduleSpec.includes("/+")) continue;

    const resolved = resolveSpec(
      e.moduleSpec,
      e.filename,
      paths,
      keyPaths,
      baseDir,
    );

    if (resolved.startsWith(`${baseDir}/${appDir}/`)) {
      edges.push({
        from: e.filename.replace(baseDir, "."),
        to: resolved.replace(baseDir, "."),
      });
    }
  }

  return { edges };
};
