import type { files } from "dropbox";

import type { Photo } from "./types.js";

export type ClosestToResponse = {
  readonly items: readonly {
    readonly distanceInMeters: number;
    readonly photo: Photo;
  }[];
  readonly truncated: boolean;
};

export type PhotoDbEntry = Partial<{
  readonly description: string;
  readonly tags: string[];
  readonly rotate: number;
  readonly gps: readonly [number, number];
}>;

export type NamedFile = Readonly<files.FileMetadata> & {
  readonly path_lower: string;
  readonly path_display: string;
  readonly content_hash: string;
};
