import { open, rename, unlink } from "node:fs/promises";
import { finished } from "node:stream/promises";

import type { BackupConfig } from "./index.js";
import { readableTarGz } from "./readableTar.js";
// import { writeTarGz } from "./writeTar.js";

const openTmpFile = (
  path: string,
): { readonly path: string } & AsyncDisposable => {
  return {
    path,
    [Symbol.asyncDispose]: () => unlink(path).catch(() => undefined),
  };
};

export const backupToLocalTarFile = async (
  backupConfig: BackupConfig,
  localArchive: string,
) => {
  await using tmpFile = openTmpFile(`${localArchive}.tmp`);
  await using fh = await open(tmpFile.path, "w");

  await finished(readableTarGz(backupConfig).pipe(fh.createWriteStream()));
  await fh.close();

  //   await writeTarGz(backupConfig, fh.createWriteStream());
  //   await fh.close();

  await rename(tmpFile.path, localArchive);
};
