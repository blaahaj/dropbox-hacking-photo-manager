import {
  combineLatest,
  map,
  type Observable,
  type ObservedValueOf,
} from "rxjs";

import { isExifableFilename, isMediainfoableFilename } from "../fileTypes.js";
import type { DayMetadata } from "../types.js";
import { type FullDatabaseFeeds } from "./index.js";

export type ListOfDaysRequest = {
  readonly type: "rx.ng.list-of-days";
  readonly withSamples: false;
  readonly groupBy?: "day" | "week" | "28-days" | "calendar-month";
};

const dateToGroupMap: Record<
  NonNullable<ListOfDaysRequest["groupBy"]>,
  (d: string) => string
> = {
  day: (s) => s,
  week: (s) => {
    const d = Temporal.PlainDate.from(s);
    return d.subtract(`P${d.dayOfWeek - 1}D`).toString();
  },
  "28-days": (s) => {
    const d = Temporal.PlainDate.from(s);
    const z = Temporal.PlainDate.from("1970-01-05"); // Monday
    const n = d.since(z).days;
    return d.subtract(`P${n % 28}D`).toString();
  },
  "calendar-month": (s) => `${s.substring(0, 7)}-01`,
};

const template = () => ({
  exifableCount: 0,
  hasExifCount: 0,
  mediaInfoableCount: 0,
  hasMediaInfoCount: 0,
  previewableCount: 0,
  hasGPSCount: 0,
  byDevice: {} as Record<string, number>,
});

export type DaySummaryWithoutSamples = {
  date: string;
  dayMetadata: DayMetadata | null;
  counts: ReturnType<typeof template>;
  photoTags: Record<string, number>;
};

export const provideListOfDaysWithoutSamples = (
  feeds: FullDatabaseFeeds,
  req: ListOfDaysRequest,
): Observable<DaySummaryWithoutSamples[]> =>
  combineLatest([feeds.byContentHash, feeds.daysByDate]).pipe(
    map(([contentMap, days]) => {
      const out = new Map<string, DaySummaryWithoutSamples>();

      const getOrCreate = (groupKey: string) => {
        let item = out.get(groupKey);
        if (item) return item;

        item = {
          date: groupKey,
          dayMetadata: null,
          counts: template(),
          photoTags: {},
        };
        out.set(groupKey, item);
        return item;
      };

      const groupFn = dateToGroupMap[req.groupBy ?? "day"];

      for (const file of contentMap.values()) {
        const item = getOrCreate(groupFn(file.date));

        ++item.counts.previewableCount;

        if (isExifableFilename(file.namedFiles[0].name)) {
          ++item.counts.exifableCount;

          if (file.exif) {
            ++item.counts.hasExifCount;
          }
        }

        if (isMediainfoableFilename(file.namedFiles[0].name)) {
          ++item.counts.mediaInfoableCount;

          if (file.mediaInfo) {
            ++item.counts.hasMediaInfoCount;
          }
        }

        if (file.gps.effective) ++item.counts.hasGPSCount;

        const exifTags = file.exif?.exifData.tags;
        if (exifTags) {
          const device = [exifTags.Make, exifTags.Model, exifTags.Model2]
            .filter(Boolean)
            .join(" ");
          item.counts.byDevice[device] =
            (item.counts.byDevice[device] ?? 0) + 1;
        }

        for (const tag of file.photo?.tags ?? []) {
          item.photoTags[tag] = (item.photoTags[tag] ?? 0) + 1;
        }
      }

      if ((req.groupBy ?? "day") === "day") {
        for (const [date, v] of days) {
          const entry = out.get(date);
          if (!entry) continue;

          entry.dayMetadata = v;
        }
      }

      const r = [...out.values()].toSorted((a, b) =>
        a.date.localeCompare(b.date),
      );

      return r;
    }),
  );

export type NGDaysNoSamplesType = ObservedValueOf<
  ReturnType<typeof provideListOfDaysWithoutSamples>
>;
