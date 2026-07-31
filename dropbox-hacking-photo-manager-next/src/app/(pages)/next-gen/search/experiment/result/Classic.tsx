import ContentTile from "@components/ContentTile";
import type { ContentHashCollectionWithDay } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";

import styles from "./Classic.module.css";
import type { Formatter } from "./types";

function Result({
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

export default { styles, Result } satisfies Formatter;
