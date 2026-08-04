import {
  EARTH_RADIUS_METRES,
  greatCircleDistance,
} from "@blaahaj/geometry/latlong";

import { parseLatLong2 } from "../gps/index.js";
import type { GPSInformation } from "../selectGPS";
import type { ContentHashCollectionWithDay } from "../serverSideFeeds";

export type V2CompiledNode = (c: ContentHashCollectionWithDay) => boolean;
export type V2Compiler = (
  q: string,
  stack: V2CompiledNode[],
) => V2CompiledNode | Error | undefined;

export type V2Thing = {
  readonly name: string;
  readonly examples: string[];
  readonly compiler: V2Compiler;
};

export const v2Things: readonly V2Thing[] = [
  // Booleans
  {
    name: "or",
    examples: ["|"],
    compiler: (q, stack) => {
      if (q !== "|") return;

      const x = stack.pop();
      const y = stack.pop();
      if (!x || !y) return new Error("Stack underrun in `|`");

      return (c) => x(c) || y(c);
    },
  },
  {
    name: "and",
    examples: ["&"],
    compiler: (q, stack) => {
      if (q !== "&") return;

      const x = stack.pop();
      const y = stack.pop();
      if (!x || !y) return new Error("Stack underrun in `&`");

      return (c) => x(c) && y(c);
    },
  },
  {
    name: "not",
    examples: ["!"],
    compiler: (q, stack) => {
      if (q !== "!") return;

      const x = stack.pop();
      if (!x) return new Error("Stack underrun in `!`");

      return (c) => !x(c);
    },
  },

  // Tags
  {
    name: "tag count",
    examples: ["tags=0", "tags>5"],
    compiler: (q) => {
      const m = q.match(/^tags(?<op>[=<>])(?<n>\d+)$/);
      if (!m?.groups) return;

      const { op, n } = m.groups;
      const opStr = op === "=" ? "===" : op;

      return eval(`(c) => (c.photo?.tags?.length ?? 0) ${opStr} ${n}`);
    },
  },

  {
    name: "various text matching",
    examples: [
      "tag=selfie",
      "text~car",
      "text:day^Hol",
      "text:photo=foo",
      "device~iphone",
    ],
    compiler: (q) => {
      const m = q.match(
        /^(?<prop>tag|text|text:day|text:photo|device)(?<op>[=~^])(?<arg>.*)$/,
      );
      if (!m?.groups) return;

      const { prop, op } = m.groups;
      const arg = JSON.stringify(m.groups.arg.toLocaleLowerCase());

      const texts = {
        tag: "(c.photo?.tags ?? [])",
        text: "[c.day.description, c.photo?.description ?? '']",
        "text:day": "[c.day.description]",
        "text:photo": "[c.photo?.description ?? '']",
        device:
          "[c.exif?.exifData.tags?.Make, c.exif?.exifData.tags?.Model, c.exif?.exifData.tags?.Model2]",
      }[prop]!;

      const lowerT = "(t ?? '').toLocaleLowerCase()";

      return eval(
        {
          "=": `(c) => ${texts}.some(t => ${lowerT} === ${arg})`,
          "~": `(c) => ${texts}.some(t => ${lowerT}.includes(${arg}))`,
          "^": `(c) => ${texts}.some(t => ${lowerT}.startsWith(${arg}))`,
        }[op]!,
      );
    },
  },

  // Format
  {
    name: "image",
    examples: ["image"],
    compiler: (q) => {
      if (q !== "image") return;
      return (c) => !!c.exif;
    },
  },
  {
    name: "video",
    examples: ["video"],
    compiler: (q) => {
      if (q !== "video") return;
      return (c) =>
        !!c.mediaInfo?.mediainfoData.media?.track.some(
          (t) => t.StreamKind === "Video",
        );
    },
  },
  {
    name: "audio",
    examples: ["audio"],
    compiler: (q) => {
      if (q !== "audio") return;
      return (c) =>
        !!c.mediaInfo?.mediainfoData.media?.track.some(
          (t) => t.StreamKind === "Audio",
        );
    },
  },

  // GPS
  {
    name: "gps",
    examples: ["gps", "gps:fromOverride", "gps<10000@55N,12E"],
    compiler: (q) => {
      const m = q.match(
        /^gps(?::(?<type>effective|fromOverride|fromContent))?(?:(?<op>[<>])(?<distance>[0-9.]+)@(?<position>.*))?$/,
      );
      if (!m?.groups) return;

      const { type, op, distance, position } = m.groups;

      if (!op || !distance || !position)
        return (c) =>
          c.gps[(type as keyof GPSInformation) ?? "effective"] !== null;

      const distanceThreshold = (() => {
        try {
          return Number(distance);
        } catch (err) {
          return err as Error;
        }
      })();
      if (distanceThreshold instanceof Error) return distanceThreshold;

      const pos = parseLatLong2(position);
      if (!pos) return new Error();

      return (c) => {
        const gps = c.gps[(type as keyof GPSInformation) ?? "effective"];
        if (!gps) return false;

        const actualDistance = greatCircleDistance(
          gps,
          pos,
          EARTH_RADIUS_METRES,
        );
        if (op === "<") return actualDistance < distanceThreshold;
        if (op === ">") return actualDistance > distanceThreshold;
        return false;
      };
    },
  },

  // Duration
  {
    name: "duration",
    examples: ["duration>30", "duration<5.5"],
    compiler: (q) => {
      const m = q.match(/^duration(?<op>[<>])(?<n>\d+(?:\.\d+))$/);
      if (!m?.groups) return;

      const { op, n } = m.groups;
      return eval(
        `(c) => c.duration !== null && c.duration ${op} ${Number(n)}`,
      );
    },
  },

  // Date
  {
    name: "date",
    examples: ["date>2020", "date<2020-02"],
    compiler: (q) => {
      const m = q.match(/^date([><])(\d\d\d\d.*)$/);
      if (!m) return;

      if (m[1] === ">") return (c) => c.timestamp > m[2];
      if (m[1] === "<") return (c) => c.timestamp < m[2];
    },
  },

  // TODO: ISO, focal length, exposure, frame rate, width/height

  // if (filter.type === "path") {
  //   return (c) =>
  //     c.namedFiles.some((namedFile) =>
  //       namedFile.path_lower.includes(filter.path),
  //     );
  // }

  // if (filter.type === "file-id")
  //   return (c) => c.namedFiles.some((namedFile) => namedFile.id === filter.id);

  // if (filter.type === "file-rev")
  //   return (c) =>
  //     c.namedFiles.some((namedFile) => namedFile.rev === filter.rev);
];

export const v2CompileQueryFromThings = (q: string): V2CompiledNode | Error => {
  const stack: V2CompiledNode[] = [];

  for (const part of q.trim().split(" ")) {
    let compiledNode: V2CompiledNode | undefined;

    for (const thing of v2Things) {
      const c = thing.compiler(part, stack);
      if (c === undefined) continue;
      if (c instanceof Error) return c;

      compiledNode = c;
      break;
    }

    if (!compiledNode) return new Error(`Unrecognised term ${part}`);

    stack.push(compiledNode);
  }

  if (stack.length < 1) return new Error(`Stack underrun`);
  if (stack.length > 1) return new Error(`Stack overrun`);

  return stack[0];
};
