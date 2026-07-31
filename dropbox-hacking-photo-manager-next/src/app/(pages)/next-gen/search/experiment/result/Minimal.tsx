import MaybeVisibleThumbnail from "@components/ContentTile/MaybeVisibleThumbnail";
import type { ContentHashCollectionWithDay } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";

export { default as styles } from "./Minimal.module.css";

import styles from "./Minimal.module.css";
import type { Formatter } from "./types";

function Result({
  c,
  selected,
  focused: _focused,
}: {
  c: ContentHashCollectionWithDay;
  selected: boolean;
  focused: boolean;
}) {
  return (
    <div style={{ position: "relative" }}>
      <MaybeVisibleThumbnail
        namedFile={c.namedFiles[0]}
        thumbnailOpts={{
          thumbnailSize: "w128h128",
          // mode: "fitone_bestfit",
        }}
        photo={c.photo ?? {}}
        visible={true}
        routeState={{
          route: "route/next-gen/content-hash",
          contentHash: c.contentHash,
        }}
      />

      {selected && (
        <div
          style={{
            position: "absolute",
            display: "block",
            top: "0",
            left: "0",
            color: "blue",
            background: "white",
            fontWeight: "bold",
            width: "32px",
            height: "32px",
            fontSize: "24px",
            borderRadius: "0 0 8px 0",
          }}
        >
          ✓
        </div>
      )}

      {c.gps.effective && (
        <div
          style={{
            position: "absolute",
            top: "4px",
            left: "4px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/gps-pin.dark.svg"
            style={{ width: "12px", height: "24px", opacity: 0.7 }}
            alt="has GPS"
          />
        </div>
      )}

      {c.photo?.tags?.at(0) && (
        <div className={styles.tags}>{c.photo?.tags?.toSorted().join(" ")}</div>
      )}
    </div>
  );
}

export default { styles, Result } satisfies Formatter;
