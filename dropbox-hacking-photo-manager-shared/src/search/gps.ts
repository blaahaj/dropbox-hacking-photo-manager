import {
  EARTH_RADIUS_METRES,
  greatCircleDistance,
} from "@blaahaj/geometry/latlong";
import { none, some } from "@blaahaj/gotcha/Option";
import { error, ok, tryToResult } from "@blaahaj/gotcha/Result";

import { parseLatLong2 } from "../gps/index.js";
import type { GPSInformation } from "../selectGPS.js";
import type { SearchTerm } from "./types.js";

const things: SearchTerm[] = [
  {
    name: "gps",
    examples: ["gps", "gps:fromOverride", "gps<10000@55N,12E"],
    compiler: (q) => {
      const m = q.match(
        /^gps(?::(?<type>effective|fromOverride|fromContent))?(?:(?<op>[<>])(?<distance>[0-9.]+)@(?<position>.*))?$/,
      );
      if (!m?.groups) return none();

      const { type, op, distance, position } = m.groups;

      if (!op || !distance || !position)
        return some(
          ok(
            (c) =>
              c.gps[(type as keyof GPSInformation) ?? "effective"] !== null,
          ),
        );

      const distanceThreshold = tryToResult(() => Number(distance));
      if (distanceThreshold.isError()) return some(distanceThreshold);

      const threshold = distanceThreshold.value;

      const pos = parseLatLong2(position);
      if (!pos) return some(error(new Error()));

      return some(
        ok((c) => {
          const gps = c.gps[(type as keyof GPSInformation) ?? "effective"];
          if (!gps) return false;

          const actualDistance = greatCircleDistance(
            gps,
            pos,
            EARTH_RADIUS_METRES,
          );
          if (op === "<") return actualDistance < threshold;
          if (op === ">") return actualDistance > threshold;
          return false;
        }),
      );
    },
  },
];

export default things;
