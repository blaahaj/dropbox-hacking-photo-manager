import type {
  GPSInformation,
  GPSLatNLongE,
} from "dropbox-hacking-photo-manager-shared";
import type { ContentHashCollectionWithDay } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";

import { groupByPredicate } from "./groupByPredicate";

type GPSInfoPresent = GPSInformation & {
  readonly effective: GPSLatNLongE;
};

type CollectionWithGPS = ContentHashCollectionWithDay & {
  readonly gps: GPSInfoPresent;
};

type R = {
  items: {
    c: ContentHashCollectionWithDay;
    gps: GPSLatNLongE;
    interpolated: boolean;
  }[];
  counts: {
    with: number;
    interpolated: number;
    without: number;
  };
};

export const interpolateGPS = (
  items: readonly ContentHashCollectionWithDay[],
): R => {
  const r: R = {
    items: [],
    counts: {
      with: 0,
      interpolated: 0,
      without: 0,
    },
  };

  const groups = groupByPredicate(
    items,
    (c): c is CollectionWithGPS => !!c.gps.effective,
  );
  console.dir({ groups });
  if (groups.length === 0) return r;

  if (groups.at(0)?.truth === false) {
    r.counts.without += groups.shift()!.items.length;
  }
  if (groups.at(-1)?.truth === false) {
    r.counts.without += groups.pop()!.items.length;
  }

  let mostRecentWithGps: CollectionWithGPS | undefined = undefined;
  while (true) {
    const group = groups.shift();
    if (!group) break;

    if (group.truth) {
      r.items.push(
        ...group.items.map((c) => ({
          c,
          gps: c.gps.effective,
          interpolated: false,
        })),
      );
      r.counts.with += group.items.length;
      mostRecentWithGps = group.items.at(-1);
    } else {
      if (!mostRecentWithGps) throw new Error(`assert: no mostRecentWithGps`);
      if (!mostRecentWithGps.gps.effective)
        throw new Error(`assert: mostRecentWithGps doesn't have GPS`);

      const nextGroup = groups.at(0);
      if (!nextGroup || !nextGroup.truth)
        throw new Error(`assert: no nextWithGps`);

      const nextWithGps = nextGroup?.items.at(0);
      if (!nextWithGps) throw new Error(`assert: no nextWithGps`);

      const startTime = Temporal.Instant.from(
        mostRecentWithGps.timestamp,
      ).epochMilliseconds;
      const startPos = mostRecentWithGps.gps.effective;
      const endTime = Temporal.Instant.from(
        nextWithGps.timestamp,
      ).epochMilliseconds;
      const endPos = nextWithGps.gps.effective;
      const duration = endTime - startTime;

      r.items.push(
        ...group.items
          .filter((c) => !c.namedFiles[0].path_lower.endsWith(".png"))
          .map((c) => {
            const t = Temporal.Instant.from(c.timestamp).epochMilliseconds;
            const coefficient = duration
              ? (t - startTime) / duration
              : startTime;

            // Assume Euclidean space
            const lat =
              startPos.lat + coefficient * (endPos.lat - startPos.lat);
            const long =
              startPos.long + coefficient * (endPos.long - startPos.long);

            return {
              c,
              gps: { lat, long },
              interpolated: true,
            };
          }),
      );

      r.counts.interpolated += group.items.length;
    }
  }

  return r;
};
