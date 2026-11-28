import { none, some } from "@blaahaj/gotcha/Option";
import { ok } from "@blaahaj/gotcha/Result";

import type { SearchTerm } from "./types";

const things: SearchTerm[] = [
  // Format
  {
    name: "image",
    examples: ["image"],
    compiler: (q) => {
      if (q !== "image") return none();
      return some(ok((c) => !!c.exif));
    },
  },
  {
    name: "video",
    examples: ["video"],
    compiler: (q) => {
      if (q !== "video") return none();
      return some(
        ok(
          (c) =>
            !!c.mediaInfo?.mediainfoData.media?.track.some(
              (t) => t.StreamKind === "Video",
            ),
        ),
      );
    },
  },
  {
    name: "audio",
    examples: ["audio"],
    compiler: (q) => {
      if (q !== "audio") return none();
      return some(
        ok(
          (c) =>
            !!c.mediaInfo?.mediainfoData.media?.track.some(
              (t) => t.StreamKind === "Audio",
            ),
        ),
      );
    },
  },
];

export default things;
