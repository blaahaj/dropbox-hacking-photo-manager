"use client";

import type { ContentHashCollectionWithDay } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import { type ReactNode, useMemo } from "react";

import styles from "./index.module.css";
import MultiGPSEditor from "./MultiGPSEditor";
import MultiTagEditor from "./MultiTagEditor";

function Tools({
  countAll,
  setAll,
  selectedFiles,
}: {
  countAll: number;
  setAll: (which: "all" | "none", checked: boolean) => void;
  selectedFiles: readonly ContentHashCollectionWithDay[];
}): ReactNode {
  const countSelected = selectedFiles.length;
  const selectedContentHashes = useMemo(
    () =>
      new Set(selectedFiles.map((t) => t.contentHash)) as ReadonlySet<string>,
    [selectedFiles],
  );

  return (
    <div className={styles.fileListTools}>
      <div>
        <div className={styles.matchingItemsCount}>
          {countAll} {countAll === 1 ? "item" : "items"}
        </div>

        <div
          className={`${styles.selectedFileCount} ${countSelected === 0 ? "noneSelected" : "someSelected"}`}
        >
          {countSelected === 1 && "1 item selected"}
          {countSelected !== 1 && `${countSelected} items selected`}
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
        files={selectedFiles}
      />
      <MultiGPSEditor
        key={[...selectedContentHashes].toSorted().join(" ") + "-gps"}
        contentHashes={selectedContentHashes}
        files={selectedFiles}
      />
    </div>
  );
}

export default Tools;
