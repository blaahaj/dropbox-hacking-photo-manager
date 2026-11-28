import { isGeneralTrack } from "@blaahaj/dropbox-hacking-mediainfo-db";
import { getDropboxClient } from "@blaahaj/dropbox-hacking-util";
import { Dropbox } from "dropbox";
import {
  type NamedFile,
  selectGPS,
} from "dropbox-hacking-photo-manager-shared";
import { isPreviewable } from "dropbox-hacking-photo-manager-shared/fileTypes";
import type { FullDatabaseFeeds } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import { combineLatest } from "rxjs/internal/observable/combineLatest";
import { map } from "rxjs/operators";

import { backupToDropbox, backupToLocalTarFile } from "../backup/index.js";
import { fsCachingThumbnailFetcher } from "./api/websocket/fsCachingThumbnailFetcher.js";
import {
  batchingThumbnailFetcher,
  nullThumbnailFetcher,
} from "./api/websocket/thumbnailFetcher.js";
import { Context } from "./context.js";
import DayDb from "./dayDb.js";
import { buildDaysByDate } from "./rx/dayDb.js";
import { buildExifByContentHash } from "./rx/exifDb.js";
import { buildAllFilesByRev } from "./rx/lsCache.js";
import { buildMediaInfoByContentHash } from "./rx/mediaInfoDb.js";
import { buildForPhotoDb, buildPhotosByContentHash } from "./rx/photoDb.js";
import wrapAsReplay from "./rx/wrapAsReplay.js";

export default (): Context => {
  const exifDbDir = process.env.EXIF_DB_DIR;
  if (exifDbDir === undefined) throw new Error("Need EXIF_DB_DIR");

  const mediaInfoDbDir = process.env.MEDIAINFO_DB_DIR;
  if (mediaInfoDbDir === undefined) throw new Error("Need MEDIAINFO_DB_DIR");

  const lsCacheDir = process.env.LS_CACHE_DIR;
  if (lsCacheDir === undefined) throw new Error("Need LS_CACHE_DIR");

  const dayDbDir = process.env.DAY_DB_DIR;
  if (dayDbDir === undefined) throw new Error("Need DAY_DB_DIR");

  const photoDbDir = process.env.PHOTO_DB_DIR;
  if (photoDbDir === undefined) throw new Error("Need PHOTO_DB_DIR");

  console.log("Building context");

  if (process.env.LOCAL_BACKUP_PATH) {
    void backupToLocalTarFile(
      {
        localPaths: {
          exif: exifDbDir,
          mediaInfo: mediaInfoDbDir,
          ls: lsCacheDir,
          days: dayDbDir,
          photos: photoDbDir,
        },
      },
      process.env.LOCAL_BACKUP_PATH,
    ).then(
      () => console.log("backup local OK"),
      (err) => console.error("backup local error", err),
    );
  }

  if (process.env.REMOTE_BACKUP_PATH) {
    const remoteBackupPath = process.env.REMOTE_BACKUP_PATH;

    void getDropboxClient().then(
      (dbx) =>
        void backupToDropbox(
          {
            localPaths: {
              exif: exifDbDir,
              mediaInfo: mediaInfoDbDir,
              ls: lsCacheDir,
              days: dayDbDir,
              photos: photoDbDir,
            },
          },
          dbx,
          remoteBackupPath,
        ).then(
          () => console.log("backup remote OK"),
          (err) => console.error("backup remote error", err),
        ),
    );
  }

  // RX

  const exifByContentHash = wrapAsReplay(buildExifByContentHash(exifDbDir));
  const mediaInfoByContentHash = wrapAsReplay(
    buildMediaInfoByContentHash(mediaInfoDbDir),
  );
  const daysByDate = wrapAsReplay(buildDaysByDate(dayDbDir));
  const allFilesByRev = wrapAsReplay(buildAllFilesByRev(lsCacheDir));
  const photosByContentHash = wrapAsReplay(
    buildPhotosByContentHash(photoDbDir),
  );

  const previewableFilesByContentHash = wrapAsReplay(
    allFilesByRev.observable().pipe(
      map((t): ReadonlyMap<string, readonly NamedFile[]> => {
        const out = new Map<string, NamedFile[]>();

        for (const namedFile of t
          .values()
          .filter((v) => isPreviewable(v.path_lower))) {
          const list = out.get(namedFile.content_hash);
          if (list) list.push(namedFile);
          else out.set(namedFile.content_hash, [namedFile]);
        }

        for (const list of out.values()) {
          list.sort((a, b) => a.path_lower.localeCompare(b.path_lower));
        }

        return out;
      }),
    ),
  );

  const byContentHash = wrapAsReplay(
    combineLatest([
      previewableFilesByContentHash.observable(),
      exifByContentHash.observable(),
      mediaInfoByContentHash.observable(),
      photosByContentHash.observable(),
    ]).pipe(
      map(
        ([files, exifs, mediaInfos, photos]) =>
          new Map(
            files.entries().map(([k, v]) => {
              const out = {
                namedFiles: v,
                exif: exifs.get(k) ?? null,
                mediaInfo: mediaInfos.get(k) ?? null,
                photo: photos.get(k) ?? null,
              };

              const d =
                out.mediaInfo?.mediainfoData.media?.track.find(
                  isGeneralTrack,
                )?.Duration;

              return [
                k,
                {
                  contentHash: k,
                  ...out,
                  gps: selectGPS(out.photo, out.exif, out.mediaInfo),
                  duration: typeof d === "string" ? Number(d) : null,
                  timestamp: out.namedFiles[0].client_modified,
                  date: out.namedFiles[0].client_modified.substring(0, 10),
                },
              ] as const;
            }),
          ),
      ),
    ),
  );

  const fullDatabaseFeeds: FullDatabaseFeeds = {
    exifsByContentHash: exifByContentHash.observable(),
    mediaInfoByContentHash: mediaInfoByContentHash.observable(),
    daysByDate: daysByDate.observable(),
    allFilesByRev: allFilesByRev.observable(),
    photosByContentHash: photosByContentHash.observable(),
    byContentHash: byContentHash.observable(),
  };

  const photoRx = buildForPhotoDb(photoDbDir);

  const dayDb = new DayDb(dayDbDir);

  const close = async () => {
    exifByContentHash.close();
    mediaInfoByContentHash.close();
    daysByDate.close();
    allFilesByRev.close();
    photosByContentHash.close();
    previewableFilesByContentHash.close();
    byContentHash.close();
  };

  const context = {
    get dropboxClient(): Promise<Dropbox> {
      return getDropboxClient();
    },

    photoRxUpdater: photoRx.update,
    photoRxTransformer: photoRx.transform,

    dayDb,

    fullDatabaseFeeds,
    thumbnailFetcher: nullThumbnailFetcher(),

    close,
  };

  return {
    ...context,
    thumbnailFetcher: fsCachingThumbnailFetcher(
      context,
      batchingThumbnailFetcher(context),
    ),
  };
};
