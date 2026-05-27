import MaybeVisibleThumbnail from "@components/ContentTile/MaybeVisibleThumbnail";
import type { ContentHashCollectionWithDay } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";

export default function Result({ c }: { c: ContentHashCollectionWithDay }) {
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
