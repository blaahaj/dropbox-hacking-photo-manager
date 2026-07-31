import ContentTile from "@components/ContentTile";
import type { ContentHashCollectionWithDay } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";

export { default as styles } from "./Classic.module.css";

export default function Classic({
  c,
  onSelected,
  selected,
  focused,
}: {
  c: ContentHashCollectionWithDay;
  onSelected: (selected: boolean) => void;
  selected: boolean;
  focused: boolean;
}) {
  return (
    <ContentTile
      file={c}
      day={c.day}
      focused={focused}
      selected={selected}
      onSelected={onSelected}
      date={""}
    />
  );
}
