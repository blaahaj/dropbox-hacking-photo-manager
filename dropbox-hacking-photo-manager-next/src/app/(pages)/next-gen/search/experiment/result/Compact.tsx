import MaybeVisibleThumbnail from "@components/ContentTile/MaybeVisibleThumbnail";
import TagList from "@components/tags/TagList";
import type { ContentHashCollectionWithDay } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";

export { default as styles } from "./Compact.module.css";

export default function Compact({
  c,
  // selected,
}: {
  c: ContentHashCollectionWithDay;
  // selected: boolean;
}) {
  return (
    <>
      <div>{c.timestamp.replace("T", " ")}</div>
      <MaybeVisibleThumbnail
        namedFile={c.namedFiles[0]}
        thumbnailOpts={{ thumbnailSize: "w128h128" }}
        photo={c.photo ?? {}}
        visible={true}
        routeState={{
          route: "route/next-gen/content-hash",
          contentHash: c.contentHash,
        }}
      />

      <div>{c.day.description}</div>
      <div>{c.photo?.description}</div>
      <TagList
        style={{ justifyContent: "center", scale: 0.8 }}
        data={(c.photo?.tags ?? []).map((tag) => ({ tag }))}
      />
    </>
  );
}
