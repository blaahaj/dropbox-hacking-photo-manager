import { glob, open } from "node:fs/promises";
import { basename } from "node:path";
import type { Readable } from "node:stream";
import { finished } from "node:stream/promises";
import { createGzip } from "node:zlib";

import type { Pack } from "tar-stream";
import * as t from "tar-stream";

import type { BackupConfig } from "./index.js";

const addLocalPathsToTar = async (
  localPaths: { readonly [K in string]: string },
  pack: Pack,
): Promise<void> => {
  for (const [key, directory] of Object.entries(localPaths)) {
    for await (const jsonFile of glob(`${directory}/*.json`)) {
      await using fh = await open(jsonFile, "r");
      const stats = await fh.stat();

      console.debug(`add ${jsonFile}`);

      const w = pack.entry({
        name: `${key}/${basename(jsonFile)}`,
        size: stats.size,
        mtime: stats.mtime,
      });

      // w.on("finish", () => console.debug(`entry ${jsonFile} w finish`));
      // w.on("end", () => console.debug(`entry ${jsonFile} w end`));

      console.debug(`add ${jsonFile} got item writer`);
      fh.createReadStream().pipe(w);
      await finished(w);
      console.debug(`add ${jsonFile} done and awaited`);
    }
  }
};

export const readableTar = (backupConfig: BackupConfig): Readable => {
  const pack = t.pack();

  // pack.on("data", (chunk) => console.debug(`pack on data`, chunk));
  // pack.on("error", (error) => console.debug(`pack on error`, error));
  // pack.on("end", () => console.debug(`pack on end`));
  // pack.on("close", () => console.debug(`pack on close`));

  addLocalPathsToTar(backupConfig.localPaths, pack).then(
    () => {
      // console.debug("pack finalize");
      pack.finalize();
      // console.debug("pack finalized");
    },
    (error: Error) => pack.destroy(error),
  );

  return pack;
};

export const readableTarGz = (backupConfig: BackupConfig): Readable => {
  const gz = createGzip();
  readableTar(backupConfig).pipe(gz);
  return gz;
};
