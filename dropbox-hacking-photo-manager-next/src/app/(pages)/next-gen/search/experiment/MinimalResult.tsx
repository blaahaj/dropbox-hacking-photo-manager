import ContentTile from "@components/ContentTile";
import MaybeVisibleThumbnail from "@components/ContentTile/MaybeVisibleThumbnail";
import type { ContentHashCollectionWithDay } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";

import type { ResultsStyle } from "./page";

export default function Result({
  c,
  resultsStyle,
}: {
  c: ContentHashCollectionWithDay;
  resultsStyle: ResultsStyle;
}) {
  if (resultsStyle === "classic")
    return (
      <ContentTile
        file={c}
        focused={false}
        selected={false}
        onSelected={() => null}
        date={""}
      />
    );

  return (
    <div style={{ fontSize: "8pt", textAlign: "center" }}>
      <MaybeVisibleThumbnail
        namedFile={c.namedFiles[0]}
        photo={c.photo ?? {}}
        visible={true}
        routeState={{
          route: "route/next-gen/content-hash",
          contentHash: c.contentHash,
        }}
      />
    </div>
  );
}
