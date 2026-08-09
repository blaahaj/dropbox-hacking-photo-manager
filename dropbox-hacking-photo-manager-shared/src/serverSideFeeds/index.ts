import type {
  DayMetadata,
  GPSInformation,
  NamedFile,
  PhotoDbEntry,
} from "dropbox-hacking-photo-manager-shared";
import { type Observable } from "rxjs";

// RVE-add-feed

export * from "./closestTo.js";
export * from "./contentHash.js";
export * from "./dayFiles.js";
export * from "./exifExplorer.js";
export * from "./feedMap.js";
export * from "./fileId.js";
export * from "./fileRev.js";
export * from "./fsck.js";
export * from "./listOfDays.js";
export * from "./tags.js";
export * from "./thumbnail.js";
export * from "./video.js";

import * as exifDb from "@blaahaj/dropbox-hacking-exif-db";
import * as mediaInfoDb from "@blaahaj/dropbox-hacking-mediainfo-db/types";

export const imageFilenamePattern = /\.(jpg|jpeg|png|heic)$/;
export const videoFilenamePattern = /\.(mp4|mov)$/;

export type ContentHashCollection = {
  readonly contentHash: string;
  readonly namedFiles: readonly NamedFile[];
  readonly exif: exifDb.ExifFromHash | null;
  readonly mediaInfo: mediaInfoDb.MediainfoFromHash | null;
  readonly photo: PhotoDbEntry | null;
  readonly gps: GPSInformation;
  readonly duration: number | null;
  readonly timestamp: string;
  readonly date: string;
};

export type ContentHashCollectionWithDay = ContentHashCollection & {
  readonly day: DayMetadata;
};

export type FullDatabaseFeeds = {
  exifsByContentHash: Observable<
    ReadonlyMap<exifDb.ContentHash, exifDb.ExifFromHash>
  >;
  mediaInfoByContentHash: Observable<
    ReadonlyMap<mediaInfoDb.ContentHash, mediaInfoDb.MediainfoFromHash>
  >;
  daysByDate: Observable<ReadonlyMap<string, DayMetadata>>;
  allFilesByRev: Observable<ReadonlyMap<string, NamedFile>>;
  photosByContentHash: Observable<ReadonlyMap<string, PhotoDbEntry>>;
  byContentHash: Observable<ReadonlyMap<string, ContentHashCollection>>;
};
