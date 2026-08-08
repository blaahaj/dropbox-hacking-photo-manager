import { Dropbox } from "dropbox";
import { type PhotoDbEntry } from "dropbox-hacking-photo-manager-shared";
import type { FullDatabaseFeeds } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";

import type { ThumbnailFetcher } from "./api/websocket/thumbnailFetcher.js";
import DayDb from "./dayDb.js";
import type { PhotoDb } from "./rx/photoDb.js";

export type Context = {
  get dropboxClient(): Promise<Dropbox>;
  readonly dayDb: DayDb;
  readonly close: () => Promise<void>;

  photoRxUpdater: (args: {
    contentHash: string;
    entry: PhotoDbEntry;
  }) => Promise<void>;
  photoRxTransformer: (
    transform: (old: PhotoDb) => Promise<PhotoDb>,
  ) => Promise<void>;

  fullDatabaseFeeds: FullDatabaseFeeds;
  thumbnailFetcher: ThumbnailFetcher;
};
