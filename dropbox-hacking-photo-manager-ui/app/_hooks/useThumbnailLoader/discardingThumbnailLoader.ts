import {} from "dropbox-hacking-photo-manager-shared";

import { type ThumbnailLoader, type ThumbnailLoaderRequest } from "./types";

export class DiscardingThumbnailLoader implements ThumbnailLoader {
  constructor(
    private readonly backend: ThumbnailLoader,
    private readonly discardAfter: number,
  ) {}

  private readonly byRev = new Map<
    string,
    { timeout: NodeJS.Timeout; promise: Promise<string | null> }
  >();

  public getThumbnail(req: ThumbnailLoaderRequest): Promise<string | null> {
    const key = `${req.rev}\0${req.thumbnailSize}\0${req.mode}\0${req.format}`;

    const r = this.byRev.get(key);
    if (r) {
      clearTimeout(r.timeout);
      r.timeout = setTimeout(() => {
        this.byRev.delete(key);
      }, this.discardAfter);
      return r.promise;
    } else {
      const promise = this.backend.getThumbnail(req);
      this.byRev.set(key, {
        promise,
        timeout: setTimeout(() => {
          this.byRev.delete(key);
        }, this.discardAfter),
      });
      return promise;
    }
  }
}

export const discardingThumbnailLoader = (
  backend: ThumbnailLoader,
  discardAfter: number,
): ThumbnailLoader => new DiscardingThumbnailLoader(backend, discardAfter);
