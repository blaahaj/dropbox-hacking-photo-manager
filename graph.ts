import assert from "node:assert";
import { lstat, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { Digraph, toDot } from "ts-graphviz";

const processFile = async (dir: string, name: string) => {
  return { _: "file", dir, name };
};

const scanFilesInDir = async (
  dir: string,
): Promise<readonly Awaited<ReturnType<typeof processFile>>[]> => {
  const names = await readdir(dir);

  return (
    await Promise.all(
      names.map(async (name) => {
        const stats = await lstat(join(dir, name));

        if (stats.isFile()) {
          return await processFile(dir, name);
        } else if (stats.isDirectory()) {
          return await scanFilesInDir(join(dir, name));
        }
      }),
    )
  )
    .filter((t) => t !== undefined)
    .flat();
};

const findImports = async (file: string) => {
  if (!file.match(/\.tsx?$/)) return;

  let text = await readFile(file, "utf-8");
  const importFrom = [] as string[];

  while (true) {
    if (text === "") break;

    const pragmaMatch = text.match(/^"use client";\s*/);
    if (pragmaMatch) {
      text = text.substring(pragmaMatch[0].length);
      continue;
    }

    const commentMatch = text.match(/^\/\/.*?\n/);
    if (commentMatch) {
      text = text.substring(commentMatch[0].length);
      continue;
    }

    const wsMatch = text.match(/^\s+/);
    if (wsMatch) {
      text = text.substring(wsMatch[0].length);
      continue;
    }

    const importMatch = text.match(/^import ((?s:.*?));/);
    if (importMatch) {
      const statement = importMatch[1].replaceAll(/\s+/g, " ");

      const fromMatch = statement.match(/from (["'])(.*?)\1/);
      if (fromMatch) {
        importFrom.push(fromMatch[2]);
      }

      console.dir({ statement });
      text = text.substring(importMatch[0].length);
      continue;
    }

    // console.log(JSON.stringify(text).substring(0, 300));
    break;
  }

  return { file, importFrom };
};

const main = async () => {
  const files = (await scanFilesInDir("dropbox-hacking-photo-manager-next/src"))
    .map((t) => join(t.dir, t.name))
    .sort();

  const pageEntryPoints = files
    .filter((t) => t.endsWith("/page.tsx") && !t.includes("/_"))
    .map((file) => ({
      file,
      url: file
        .replace("dropbox-hacking-photo-manager-next/src/app/", "./")
        .replace("/page.tsx", "")
        .split("/")
        .filter((n) => !n.startsWith("("))
        .join("/"),
    }));

  const layoutFiles = files.filter((t) => t.endsWith("/layout.tsx"));

  const imports = (
    await Promise.all(files.map((file) => findImports(file)))
  ).filter((t) => t !== undefined);

  const importPaths = JSON.parse(
    await readFile("dropbox-hacking-photo-manager-next/tsconfig.json", "utf-8"),
  ).compilerOptions.paths as Record<string, string>;

  const importPathsPrepared = Object.entries(importPaths).map(
    ([from, toList]) => {
      let to = toList[0] as string;
      assert(from.endsWith("/*"));
      assert(to.endsWith("/*"));
      from = from.substring(0, from.length - 1);
      to = to.substring(0, to.length - 1);
      return {
        from,
        to: resolve("dropbox-hacking-photo-manager-next/.", to) + "/",
      } as const;
    },
  );

  console.dir({ importPathsPrepared });

  const filesResolved = files.map((t) => resolve(t));

  const filesRelative = files.map((t) =>
    t.replace("dropbox-hacking-photo-manager-next/src", "./src"),
  );

  const G = new Digraph();
  G.attributes.graph.set("scale" as any, "5");

  const resolvedNextDir = resolve("dropbox-hacking-photo-manager-next");
  const resolvedPageEntryPoints = pageEntryPoints.map((s) => resolve(s.file));
  for (const file of filesResolved) {
    const label = file
      .replace(resolvedNextDir, ".")
      .split(/(.{30})/g)
      .filter((s) => s !== "")
      .join("\n");

    G.createNode(file, {
      label,
      color: resolvedPageEntryPoints.includes(file) ? "red" : "black",
    });
  }

  for (const i of imports) {
    for (const from of i.importFrom) {
      if (from.endsWith("logRender")) continue;

      const afterPaths = importPathsPrepared.reduce(
        (acc, item) => acc.replace(item.from, item.to),
        from,
      );

      const candidates = [
        `${afterPaths}`,
        `${afterPaths}.tsx`,
        `${afterPaths}.ts`,
        `${afterPaths}/index.tsx`,
        `${afterPaths}/index.ts`,
        resolve(dirname(i.file), from),
        resolve(dirname(i.file), from) + ".ts",
        resolve(dirname(i.file), from) + ".tsx",
      ] as string[];

      const resolvedTo = candidates.find((item) =>
        filesResolved.includes(item),
      );

      console.dir({ file: i.file, from, afterPaths, candidates, resolvedTo });

      if (resolvedTo) {
        G.createEdge([resolve(i.file), resolvedTo]);
      }

      //   let resolved = from;
      //   for (const [prefix, to] of Object.entries(importPaths)) {
      //     if (resolved.startsWith(prefix.replace(/\*$/, ""))) {
      //       resolved = to.replace(/\*$/, "");
      //     }
      //   }
    }
  }

  console.dir(
    {
      // files,
      filesRelative,
      filesResolved,
      //       //  pageEntryPoints,
      //       //  layoutFiles,
      //       imports,
      //       importPaths,
    },
    { depth: 3 },
  );

  //   console.log(toDot(G));
  await writeFile("graph.dot", toDot(G), "utf-8");
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
