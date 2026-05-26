import MaybeVisibleThumbnail from "@components/ContentTile/MaybeVisibleThumbnail";
import TagList from "@components/tags/TagList";
import type { ContentHashCollectionWithDay } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";

export default function Result({ c }: { c: ContentHashCollectionWithDay }) {
  return (
    <div style={{ fontSize: "8pt", textAlign: "center" }}>
      {/* <ContentTile
        file={c}
        focused={false}
        observableVisibleItems={undefined}
        selected={false}
        onSelected={function (selected: boolean): void {
          throw new Error("Function not implemented.");
        }}
        date={""}
      /> */}

      <div>{c.timestamp.replace("T", " ")}</div>
      <MaybeVisibleThumbnail
        namedFile={c.namedFiles[0]}
        photo={c.photo ?? {}}
        visible={true}
        routeState={{
          route: "route/next-gen/content-hash",
          contentHash: c.contentHash,
        }}
      />
      <div>{c.day.description}</div>
      <div>{c.photo?.description}</div>
      <TagList data={(c.photo?.tags ?? []).map((tag) => ({ tag }))} />
    </div>
  );
}
