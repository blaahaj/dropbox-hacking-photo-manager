import { ExifFromHash } from "@blaahaj/dropbox-hacking-exif-db";
import type { ReadonlyDeep } from "type-fest";

import type { NamedFile } from "./ws.js";

export type DayMetadata = {
  readonly date: string;
  readonly description: string;
};

export type Photo = {
  readonly namedFile: NamedFile;
  readonly exif: ReadonlyDeep<ExifFromHash>;
};

export type DayMetadataResponse = {
  readonly day_metadata: DayMetadata;
};
