import useVisibilityTracking from "@hooks/useVisibilityTracking";
import logRender from "@lib/logRender";
import type { ContentHashCollection } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import React, { useRef, useState } from "react";

import FileRow from "./FileRow";
import styles from "./filesTable.module.css";

const FilesTable = ({
  files,
  selectedContentHashes,
  onSelectedContentHashes,
  date,
}: {
  files: readonly ContentHashCollection[];
  selectedContentHashes: ReadonlySet<string>;
  onSelectedContentHashes: (selectedContentHashes: ReadonlySet<string>) => void;
  date: string;
}) => {
  const parentRef = useRef<HTMLOListElement>(null);

  const observableVisibleItems = useVisibilityTracking({
    parentRef,
    listItemDataAttribute: "data-rev",
  });

  // console.log([...selectedContentHashes].toSorted().join(" "));

  const [focusedHash, setFocusedHash] = useState<string>();

  return (
    <>
      <ol
        ref={parentRef}
        className={styles.files}
        onKeyDown={(e) => {
          if (files.length === 0) return;
          if (!(!e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey)) return;

          if (e.key === "j") {
            const idx = files.findIndex(
              (item) => item.contentHash === focusedHash,
            );
            const newIndex = (idx + 1) % files.length;
            setFocusedHash(files[newIndex].contentHash);
          }

          if (e.key === "k") {
            const idx = files.findIndex(
              (item) => item.contentHash === focusedHash,
            );
            const newIndex = idx <= 0 ? files.length - 1 : idx - 1;
            setFocusedHash(files[newIndex].contentHash);
          }

          if (e.key === "y" || e.key === "n") {
            const want = e.key === "y";

            const idx = files.findIndex(
              (item) => item.contentHash === focusedHash,
            );
            const focusedFile: ContentHashCollection | undefined = files[idx];

            if (
              focusedFile &&
              selectedContentHashes.has(focusedFile.contentHash) !== want
            ) {
              const copy = new Set(selectedContentHashes);
              if (want) copy.add(focusedFile.contentHash);
              else copy.delete(focusedFile.contentHash);
              onSelectedContentHashes(copy);
            }

            const newIndex = (idx + 1) % files.length;
            setFocusedHash(files[newIndex].contentHash);
          }

          if (e.key === "q") onSelectedContentHashes(new Set());
          if (e.key === "a")
            onSelectedContentHashes(new Set(files.map((f) => f.contentHash)));

          console.log({ key: e });
        }}
      >
        {observableVisibleItems &&
          files.map((f) => (
            <FileRow
              key={f.contentHash}
              file={f}
              focused={f.contentHash === focusedHash}
              observableVisibleItems={observableVisibleItems}
              selected={selectedContentHashes.has(f.contentHash)}
              onSelected={(selected) => {
                const t = new Set(selectedContentHashes);
                if (selected) t.add(f.contentHash);
                else t.delete(f.contentHash);

                onSelectedContentHashes(t);
                setFocusedHash(f.contentHash);
              }}
              date={date}
            />
          ))}
      </ol>
    </>
  );
};

export default logRender(FilesTable);
