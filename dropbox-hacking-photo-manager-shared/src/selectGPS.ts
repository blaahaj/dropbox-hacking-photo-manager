import type { ExifFromHash } from "@blaahaj/dropbox-hacking-exif-db";
import type { MediainfoFromHash } from "@blaahaj/dropbox-hacking-mediainfo-db/types";

import { GPSLatLong, type GPSLatNLongE } from "./gpsLatLong.js";
import type { PhotoDbEntry } from "./ws.js";

export type GPSInformation = {
  readonly effective: GPSLatNLongE | null;
  readonly fromOverride: GPSLatNLongE | null;
  readonly fromContent: GPSLatNLongE | null;
};

export const selectGPS = (
  photo: PhotoDbEntry | null | undefined,
  exif: ExifFromHash | null | undefined,
  mediaInfo: MediainfoFromHash | null | undefined,
): GPSInformation => {
  const fromOverride = photo?.gps
    ? (GPSLatLong.fromTuple(photo.gps).asSigned() ?? null)
    : null;

  const fromContent = exif
    ? (GPSLatLong.fromExif(exif)?.asSigned() ?? null)
    : mediaInfo
      ? (GPSLatLong.fromMediaInfo(mediaInfo)?.asSigned() ?? null)
      : null;

  return {
    effective: fromOverride ?? fromContent,
    fromOverride,
    fromContent,
  } as const;
};
