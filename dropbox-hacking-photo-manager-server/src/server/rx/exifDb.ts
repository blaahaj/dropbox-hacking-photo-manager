import { ExifDB, ExifFromHash } from "@blaahaj/dropbox-hacking-exif-db";
import { Observable } from "rxjs";

import { jsonFileObservableViaLoader } from "./util.js";

export const buildExifByContentHash = (
  dbDir: string,
): Observable<ReadonlyMap<string, ExifFromHash>> =>
  jsonFileObservableViaLoader(
    dbDir,
    () =>
      new ExifDB(dbDir)
        .readAll()
        .then(
          (all) =>
            new Map(
              all.entries().filter(([_, v]) => v.exifData.tags !== undefined),
            ),
        ),
    100,
  );
