// import assert from "node:assert";
// import { readFile } from "node:fs/promises";
// import { resolve } from "node:path";

// const findImports = async (file: string) => {
//   if (!file.match(/\.tsx?$/)) return;

//   let text = await readFile(file, "utf-8");
//   const importFrom = [] as string[];

//   if (file.endsWith("/routes.ts")) {
//     // Look for e.g.: route("tags", "routes/tags/index.tsx")
//     for (const m of text.matchAll(/"([^"]*\.tsx)"/g)) {
//       importFrom.push(m[1]);
//     }
//   }

//   // FIXME: a much better approach would be to use the genuine TS parser,
//   // something like the way eslint does it.

//   while (true) {
//     if (text === "") break;

//     const pragmaMatch = text.match(/^"use client";\s*/);
//     if (pragmaMatch) {
//       text = text.substring(pragmaMatch[0].length);
//       continue;
//     }

//     const commentMatch = text.match(/^\/\/.*?\n/);
//     if (commentMatch) {
//       text = text.substring(commentMatch[0].length);
//       continue;
//     }

//     const wsMatch = text.match(/^\s+/);
//     if (wsMatch) {
//       text = text.substring(wsMatch[0].length);
//       continue;
//     }

//     const importMatch = text.match(/^import ((?s:.*?));/);
//     if (importMatch) {
//       const statement = importMatch[1].replaceAll(/\s+/g, " ");

//       const fromMatch = statement.match(/from (["'])(.*?)\1/);
//       if (fromMatch) {
//         importFrom.push(fromMatch[2]);
//       }

//       text = text.substring(importMatch[0].length);
//       continue;
//     }

//     // console.log(JSON.stringify(text).substring(0, 300));
//     break;
//   }

//   return { file, importFrom };
// };

// export const findImportsTwo = async (files: string[]) => {
//   const imports = (
//     await Promise.all(files.map((file) => findImports(file)))
//   ).filter((t) => t !== undefined);

//   const importPaths = JSON.parse(
//     await readFile("dropbox-hacking-photo-manager-ui/tsconfig.json", "utf-8"),
//   ).compilerOptions.paths as Record<string, string>;

//   const importPathsPrepared = Object.entries(importPaths).map(
//     ([from, toList]) => {
//       let to = toList[0];
//       assert(from.endsWith("/*"));
//       assert(to.endsWith("/*"));
//       from = from.substring(0, from.length - 1);
//       to = to.substring(0, to.length - 1);
//       return {
//         from,
//         to: resolve("dropbox-hacking-photo-manager-ui/.", to) + "/",
//       } as const;
//     },
//   );

//   return { imports, importPathsPrepared };
// };
