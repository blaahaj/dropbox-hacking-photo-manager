import type { ContentHashCollectionWithDay } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import { type ReactNode, useMemo } from "react";

import styles from "./index.module.css";
import MultiGPSEditor from "./MultiGPSEditor";
import MultiTagEditor from "./MultiTagEditor";

function Tools({
  countAll,
  countSelected,
  setAll,
  files,
  selectedContentHashes,
}: {
  countAll: number;
  countSelected: number;
  setAll: (which: "all" | "none", checked: boolean) => void;
  files: readonly ContentHashCollectionWithDay[];
  selectedContentHashes: ReadonlySet<string>;
}): ReactNode {
  return (
    <div className={styles.fileListTools}>
      <div>
        <div className={styles.matchingItemsCount}>
          {files.length} {files.length === 1 ? "item" : "items"}
        </div>

        <div
          className={`${styles.selectedFileCount} ${selectedContentHashes.size === 0 ? "noneSelected" : "someSelected"}`}
        >
          {selectedContentHashes.size === 1 && "1 item selected"}
          {selectedContentHashes.size !== 1 &&
            `${selectedContentHashes.size} items selected`}
        </div>

        <div className="allSelected">
          <input
            type="checkbox"
            disabled={countAll === 0}
            checked={countSelected === countAll}
            onChange={useMemo(
              () => (e) => setAll("all", e.target.checked),
              [setAll],
            )}
          />{" "}
          all
        </div>
        <div className="noneSelected">
          <input
            type="checkbox"
            disabled={countAll === 0}
            checked={countSelected === 0}
            onChange={useMemo(
              () => (e) => setAll("none", e.target.checked),
              [setAll],
            )}
          />{" "}
          none
        </div>
      </div>

      <MultiTagEditor
        key={[...selectedContentHashes].toSorted().join(" ") + "-tags"}
        contentHashes={selectedContentHashes}
        files={files.filter((f) => selectedContentHashes.has(f.contentHash))}
      />
      <MultiGPSEditor
        key={[...selectedContentHashes].toSorted().join(" ") + "-gps"}
        contentHashes={selectedContentHashes}
        files={files.filter((f) => selectedContentHashes.has(f.contentHash))}
      />
    </div>
  );
}

export default Tools;
