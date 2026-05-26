import ContentTile from "@components/ContentTile";
import type { ContentHashCollectionWithDay } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";

export default function Result({ c }: { c: ContentHashCollectionWithDay }) {
  return (
    <ContentTile
      file={c}
      focused={false}
      selected={false}
      onSelected={() => null}
      date={""}
    />
  );
}
