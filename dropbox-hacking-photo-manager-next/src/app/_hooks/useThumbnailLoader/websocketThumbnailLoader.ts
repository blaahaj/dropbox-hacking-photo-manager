import type { JSONValue } from "@blaahaj/json";
import { getRxFeed } from "@lib/rxFeed/getRxFeed";
import type {
  Connectable,
  ObservableUpdate,
} from "dropbox-hacking-photo-manager-shared";
import type {
  ThumbnailRequest,
  ThumbnailResponse,
} from "dropbox-hacking-photo-manager-shared/serverSideFeeds";

import type { ThumbnailLoader, ThumbnailLoaderRequest } from "./types";

export const websocketThumbnailLoader = (
  mx:
    | Connectable<
        ObservableUpdate<ThumbnailResponse, JSONValue>,
        ThumbnailRequest
      >
    | undefined,
): ThumbnailLoader => ({
  getThumbnail: (req: ThumbnailLoaderRequest) =>
    new Promise<string | null>((resolve, reject) => {
      if (!mx) return resolve(null);

      const subscription = getRxFeed(
        {
          type: "rx.ng.thumbnail2",
          rev: req.rev,
          size: req.thumbnailSize,
          mode: req.mode,
          format: req.format,
        },
        mx,
      ).subscribe({
        next: (v) => {
          resolve(v.thumbnail);
          subscription.unsubscribe();
        },
        error: (e) => reject(e instanceof Error ? e : new Error(e)),
      });
    }),
});
