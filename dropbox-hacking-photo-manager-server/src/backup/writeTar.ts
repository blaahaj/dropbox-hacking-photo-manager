import { glob, open } from "node:fs/promises";
import { basename } from "node:path";
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

      w.on("finish", () => console.debug(`entry ${jsonFile} w finish`));
      w.on("end", () => console.debug(`entry ${jsonFile} w end`));

      console.debug(`add ${jsonFile} got item writer`);

      fh.createReadStream().pipe(w);

      await new Promise<void>((resolve, reject) => {
        w.on("finish", () => resolve());
        w.on("error", (error) => reject(error));
      });

      console.debug(`add ${jsonFile} done and awaited`);
    }
  }
};

export const writeTar = async (
  backupConfig: BackupConfig,
  writable: NodeJS.WritableStream,
): Promise<void> => {
  const pack = t.pack();
  pack.pipe(writable);

  await addLocalPathsToTar(backupConfig.localPaths, pack);

  console.debug("pack finalize");
  pack.finalize();

  console.debug("pack await end / error");

  await new Promise<void>((resolve, reject) => {
    pack.on("end", () => resolve());
    pack.on("error", (error) => reject(error));
  });

  console.debug("pack saw end / error");
};

export const writeTarGz = async (
  backupConfig: BackupConfig,
  writable: NodeJS.WritableStream,
): Promise<void> => {
  const gz = createGzip();
  gz.pipe(writable);

  await writeTar(backupConfig, gz);
  gz.end();

  console.debug("gz await end / error");

  await new Promise<void>((resolve, reject) => {
    if (gz.readableEnded) resolve();
    else gz.on("end", () => resolve());

    if (gz.errored) reject(gz.errored);
    else gz.on("error", (error) => reject(error));
  });

  console.debug("gz saw end / error");
};
