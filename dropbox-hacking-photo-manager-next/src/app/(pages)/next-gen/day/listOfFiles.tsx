"use client";

import GeoMap from "@components/map/GeoMap";
import logRender from "@lib/logRender";
import type { ContentHashCollection } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import * as L from "leaflet";
import React, { useDeferredValue, useMemo, useState } from "react";

import FilesTable from "./filesTable";
import MultiGPSEditor from "./MultiGPSEditor";
import MultiTagEditor from "./MultiTagEditor";

import styles from "./listOfFiles.module.css";

const ListOfFiles = ({
  files,
  date,
}: {
  files: readonly ContentHashCollection[];
  date: string;
}) => {
  const [selectedContentHashes, setSelectedContentHashes] = useState<
    ReadonlySet<string>
  >(() => new Set());

  const prev = useDeferredValue(selectedContentHashes);

  console.log(
    `GeoMap curr=${selectedContentHashes.size} prev=${prev.size} is=${Object.is(selectedContentHashes, prev)}`,
  );

  const forMap = useMemo(
    () =>
      new Map(
        files.flatMap((t) =>
          t.gps.effective ?
            [
              [
                t.namedFiles[0].content_hash,
                {
                  position: new L.LatLng(
                    t.gps.effective.lat,
                    t.gps.effective.long,
                  ),

                  highlighted: selectedContentHashes.has(
                    t.namedFiles[0].content_hash,
                  ),
                },
              ],
            ]
          : [],
        ),
      ),
    [files, selectedContentHashes],
  );

  const mapListeners = useMemo<Parameters<typeof GeoMap>[0]["listeners"]>(
    () => ({
      onClickMarker: (e, key) => {
        setSelectedContentHashes((before) => {
          console.log("on click marker", key, e);
          const copy = new Set(before);
          if (copy.has(key)) copy.delete(key);
          else copy.add(key);
          return copy;
        });
      },
    }),
    [],
  );

  const countSelected = files.filter((f) =>
    selectedContentHashes.has(f.namedFiles[0].content_hash),
  ).length;
  const countAll = files.length;

  const setAll = useMemo(
    () => (which: "all" | "none", checked: boolean) => {
      if ((which === "all") === checked) {
        setSelectedContentHashes(
          new Set(files.map((f) => f.namedFiles[0].content_hash)),
        );
      } else {
        setSelectedContentHashes(new Set());
      }
    },
    [files],
  );

  return (
    <>
      <div className={styles.fileListTools}>
        <div>
          <div className={styles.matchingItemsCount}>
            {files.length} {files.length === 1 ? "item" : "items"}
          </div>

          <div
            className={`selectedFileCount ${selectedContentHashes.size === 0 ? "noneSelected" : "someSelected"}`}
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

      <FilesTable
        files={files}
        selectedContentHashes={selectedContentHashes}
        onSelectedContentHashes={(t) => setSelectedContentHashes(t)}
        date={date}
      />

      <GeoMap positions={forMap} listeners={mapListeners} />

      <p>
        With GPS: {forMap.size} {"//"} Without GPS: {files.length - forMap.size}
      </p>
    </>
  );
};

export default logRender(ListOfFiles);
