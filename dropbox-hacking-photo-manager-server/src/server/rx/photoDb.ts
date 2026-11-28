import { readFile } from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";

import type { PhotoDbEntry } from "dropbox-hacking-photo-manager-shared";
import { map } from "rxjs";
import writeFileAtomic from "write-file-atomic";

import { jsonFileObservable } from "./util.js";

export type PhotoDb = Readonly<Record<string, PhotoDbEntry>>;

export const buildForPhotoDb = (path: string) => {
  return {
    update: async (args: { contentHash: string; entry: PhotoDbEntry }) => {
      const all = JSON.parse(
        await readFile(`${path}/photos.json`, { encoding: "utf-8" }),
      ) as Record<string, PhotoDb[string]>;

      if (isDeepStrictEqual(all[args.contentHash], args.entry)) return;

      all[args.contentHash] = args.entry;

      await writeFileAtomic(`${path}/photos.json`, JSON.stringify(all) + "\n", {
        encoding: "utf-8",
      });
    },
    transform: async (mutate: (current: PhotoDb) => Promise<PhotoDb>) => {
      const oldDb = JSON.parse(
        await readFile(`${path}/photos.json`, { encoding: "utf-8" }),
      ) as PhotoDb;

      const newDb = await mutate(oldDb);

      if (isDeepStrictEqual(oldDb, newDb)) return;

      await writeFileAtomic(
        `${path}/photos.json`,
        JSON.stringify(newDb) + "\n",
        {
          encoding: "utf-8",
        },
      );
    },
  };
};

export const buildPhotosByContentHash = (path: string) =>
  jsonFileObservable<PhotoDb>(`${path}/photos.json`, 100).pipe(
    map((record) => new Map<string, PhotoDbEntry>(Object.entries(record))),
  );
