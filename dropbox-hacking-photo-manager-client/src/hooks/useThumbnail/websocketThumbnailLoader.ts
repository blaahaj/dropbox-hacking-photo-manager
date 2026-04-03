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

import type { ThumbnailLoader } from "./types";

export const websocketThumbnailLoader = (
  mx:
    | Connectable<
        ObservableUpdate<ThumbnailResponse, JSONValue>,
        ThumbnailRequest
      >
    | undefined,
): ThumbnailLoader => ({
  getThumbnail: (rev: string) =>
    new Promise<string | null>((resolve, reject) => {
      if (!mx) return resolve(null);

      const subscription = getRxFeed(
        {
          type: "rx.ng.thumbnail2",
          rev,
          size: "w128h128",
          mode: "strict",
          format: "jpeg",
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
