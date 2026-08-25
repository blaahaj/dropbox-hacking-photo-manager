import { isVideoTrack } from "@blaahaj/dropbox-hacking-mediainfo-db";
import { none, some } from "@blaahaj/gotcha/Option";
import { error, ok } from "@blaahaj/gotcha/Result";

import type { ContentHashCollectionWithDay } from "../serverSideFeeds";
import type { CompiledSearch, SearchTerm } from "./types";

const props: Readonly<
  Record<string, (c: ContentHashCollectionWithDay) => number[]>
> = {
  tags: (c: ContentHashCollectionWithDay) => [c.photo?.tags?.length ?? 0],
  duration: (c: ContentHashCollectionWithDay) => [c.duration ?? 0],
  width: (c: ContentHashCollectionWithDay) => {
    const videoTrack =
      c.mediaInfo?.mediainfoData.media?.track.find(isVideoTrack);
    return [
      c.exif?.exifData.imageSize?.width,
      ...(videoTrack ? [Number(videoTrack.Width)] : []),
    ].filter((t) => t !== undefined);
  },
  height: (c: ContentHashCollectionWithDay) => {
    const videoTrack =
      c.mediaInfo?.mediainfoData.media?.track.find(isVideoTrack);
    return [
      c.exif?.exifData.imageSize?.height,
      ...(videoTrack ? [Number(videoTrack.Height)] : []),
    ].filter((t) => t !== undefined);
  },
  frameRate: (c: ContentHashCollectionWithDay) => {
    const videoTrack =
      c.mediaInfo?.mediainfoData.media?.track.find(isVideoTrack);
    return [...(videoTrack ? [Number(videoTrack.FrameRate)] : [])].filter(
      (t) => t !== undefined,
    );
  },
  iso: (c: ContentHashCollectionWithDay) =>
    [c.exif?.exifData.tags?.ISO].filter((t) => t !== undefined),
  focalLength: (c: ContentHashCollectionWithDay) =>
    [c.exif?.exifData.tags?.FocalLength].filter((t) => t !== undefined),
  exposure: (c: ContentHashCollectionWithDay) =>
    [
      c.exif?.exifData.tags?.ExposureTime
        ? Number(c.exif?.exifData.tags?.ExposureTime)
        : undefined,
    ].filter((t) => t !== undefined),
};

const ops = (arg: number) =>
  ({
    "<": (t: number) => t < arg,
    "<=": (t: number) => t <= arg,
    ">": (t: number) => t > arg,
    ">=": (t: number) => t >= arg,
    "=": (t: number) => t === arg,
  }) as const;

const propNames = Object.keys(props)
  .toSorted()
  .map((s) => RegExp.escape(s))
  .join("|");

const opNames = Object.keys(ops(0))
  .toSorted()
  .map((s) => RegExp.escape(s))
  .join("|");

const pattern = new RegExp(
  `^(?<prop>${propNames})(?<op>${opNames})(?<argStr>\\d+(?:\\.\\d+)?)$`,
);

const things: SearchTerm[] = [
  {
    name: "various numeric matching",
    examples: [
      "tags=0",
      "tags>5",
      "duration>500",
      "width=800",
      "height>500",
      "iso<200",
      "focalLength>100",
      "exposure>1",
      "frameRate>59",
    ],
    compiler: (q) => {
      const m = pattern.exec(q);
      if (!m?.groups) return none();

      const { prop, op, argStr } = m.groups;
      const arg = Number(argStr);

      const getValues = props[prop];
      if (!getValues)
        return some(
          error(new Error(`No getValues for '${prop}' (for '${q}')`)),
        );

      const checkValue = ops(arg)[op as "="];
      if (!checkValue)
        return some(error(new Error(`No checkValue for '${op}' (for '${q}')`)));

      const fn: CompiledSearch = (c) => getValues(c).some(checkValue);

      return some(ok(fn));
    },
  },
];

export default things;
