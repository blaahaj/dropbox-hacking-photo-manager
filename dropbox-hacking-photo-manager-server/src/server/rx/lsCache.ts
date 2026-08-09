import { State, StateDir } from "@blaahaj/dropbox-hacking-ls-cache";
import { files } from "dropbox";
import type { NamedFile } from "dropbox-hacking-photo-manager-shared";
import { filter, map } from "rxjs";

import { jsonFileObservableViaLoader } from "./util.js";

export const buildAllFilesByRev = (dbDir: string) =>
  jsonFileObservableViaLoader<State>(
    dbDir,
    async () => {
      const db = new StateDir(dbDir);
      await db.load();
      return db.getState();
    },
    100,
  )
    .pipe(filter((s) => s.tag === "ready"))
    .pipe(
      map((s) =>
        [...s.entries.values()].filter((item) => item[".tag"] === "file"),
      ),
    )
    .pipe(map((t): files.FileMetadata[] => t))
    .pipe(
      map((arr) =>
        arr.filter(
          (
            item,
          ): item is typeof item & {
            path_lower: string;
            path_display: string;
            content_hash: string;
          } =>
            item.path_lower !== undefined &&
            item.path_display !== undefined &&
            item.content_hash !== undefined,
        ),
      ),
    )
    .pipe(
      map((arr) => {
        const out = new Map<string, NamedFile>();
        for (const item of arr) out.set(item.rev, item);
        return out;
      }),
    );
