import type { ContentHashCollectionWithDay } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import type { ReactNode } from "react";

export type Formatter = {
  readonly styles: Readonly<Record<string, string>>;
  // readonly styles: Readonly<
  //   Record<"page" | "result" | "selected" | "focused", string>
  // >;
  readonly Result: (props: {
    readonly c: ContentHashCollectionWithDay;
    readonly onSelected: (value: boolean) => void;
    readonly selected: boolean;
    readonly focused: boolean;
  }) => ReactNode;
};
