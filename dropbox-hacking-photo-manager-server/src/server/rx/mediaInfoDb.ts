import {
  MediainfoDB,
  MediainfoFromHash,
} from "@blaahaj/dropbox-hacking-mediainfo-db";
import { type Observable } from "rxjs";

import { jsonFileObservableViaLoader } from "./util.js";

export const buildMediaInfoByContentHash = (
  dbDir: string,
): Observable<ReadonlyMap<string, MediainfoFromHash>> =>
  jsonFileObservableViaLoader(
    dbDir,
    () => new MediainfoDB(dbDir).readAll(),
    100,
  );
