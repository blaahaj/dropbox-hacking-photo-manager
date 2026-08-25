import { none, some } from "@blaahaj/gotcha/Option";
import { error, ok } from "@blaahaj/gotcha/Result";

import type { ContentHashCollectionWithDay } from "../serverSideFeeds";
import type { CompiledSearch, SearchTerm } from "./types";

const props: Readonly<
  Record<string, (c: ContentHashCollectionWithDay) => string[]>
> = {
  tag: (c: ContentHashCollectionWithDay) => c.photo?.tags ?? [],
  text: (c: ContentHashCollectionWithDay) => [
    c.day.description,
    c.photo?.description ?? "",
  ],
  "text:day": (c: ContentHashCollectionWithDay) => [c.day.description],
  "text:photo": (c: ContentHashCollectionWithDay) => [
    c.photo?.description ?? "",
  ],
  device: (c: ContentHashCollectionWithDay) => [
    c.exif?.exifData.tags?.Make ?? "",
    c.exif?.exifData.tags?.Model ?? "",
    c.exif?.exifData.tags?.Model2 ?? "",
  ],
  date: (c: ContentHashCollectionWithDay) => [c.timestamp],
};

const ops = (arg: string) =>
  ({
    "<": (t: string) => t < arg,
    ">": (t: string) => t > arg,
    "=": (t: string) => t === arg,
    "~": (t: string) => t.includes(arg),
    "^": (t: string) => t.startsWith(arg),
  }) as const;

const propNames = Object.keys(props)
  .toSorted()
  .map((s) => RegExp.escape(s))
  .join("|");

const opNames = Object.keys(ops(""))
  .toSorted()
  .map((s) => RegExp.escape(s))
  .join("|");

const pattern = new RegExp(
  `^(?<prop>${propNames})(?<op>${opNames})(?<arg>.*)$`,
);

const things: SearchTerm[] = [
  {
    name: "various text matching",
    examples: [
      "tag=selfie",
      "text~car",
      "text:day^Hol",
      "text:photo=foo",
      "device~iphone",
      "date>2024",
    ],
    compiler: (q) => {
      const m = pattern.exec(q);
      if (!m?.groups) return none();

      const { prop, op } = m.groups;
      const arg = m.groups.arg.toLocaleLowerCase();

      const getValues = props[prop];
      if (!getValues)
        return some(
          error(new Error(`No getValues for '${prop}' (for '${q}')`)),
        );

      const checkValue = ops(arg)[op as "="];
      if (!checkValue)
        return some(error(new Error(`No checkValue for '${op}' (for '${q}')`)));

      const fn: CompiledSearch = (c) =>
        getValues(c).some((s) => checkValue(s.toLocaleLowerCase()));

      return some(ok(fn));
    },
  },
];

export default things;
