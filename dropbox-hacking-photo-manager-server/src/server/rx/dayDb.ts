import type { DayMetadata } from "dropbox-hacking-photo-manager-shared";
import { map, type Observable } from "rxjs";

import DayDb from "../dayDb.js";
import { jsonFileObservableViaLoader } from "./util.js";

export const buildDaysByDate = (
  dbDir: string,
): Observable<ReadonlyMap<string, DayMetadata>> =>
  jsonFileObservableViaLoader<DayMetadata[]>(
    dbDir,
    () => new DayDb(dbDir).days(),
    100,
  ).pipe(map((array) => new Map(array.map((t) => [t.date, t]))));
