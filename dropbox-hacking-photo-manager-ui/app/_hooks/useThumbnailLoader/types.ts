const _ALLOWED_SIZES = [
  "w32h32",
  "w64h64",
  "w128h128",
  "w256h256",
  "w480h320",
  "w640h480",
  "w960h640",
  "w1024h768",
  "w2048h1536",
] as const;

const _ALLOWED_MODES = ["bestfit", "fitone_bestfit", "strict"] as const;

const _ALLOWED_FORMATS = ["jpeg", "png"] as const;

type ThumbnailSize = (typeof _ALLOWED_SIZES)[number];
type Mode = (typeof _ALLOWED_MODES)[number];
type Format = (typeof _ALLOWED_FORMATS)[number];

export type ThumbnailLoaderRequest = {
  readonly rev: string;
  readonly thumbnailSize: ThumbnailSize;
  readonly mode: Mode;
  readonly format: Format;
};

export interface ThumbnailLoader {
  getThumbnail(revOrRequest: ThumbnailLoaderRequest): Promise<string | null>;
}
