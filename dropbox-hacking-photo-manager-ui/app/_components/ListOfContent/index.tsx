import GeoMap from "@components/map/GeoMap";
import { useLeaflet } from "@hooks/useLeaflet";
import logRender from "@lib/logRender";
import type { ContentHashCollectionWithDay } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import { useDeferredValue, useMemo, useState } from "react";

import ListOfTiles from "./ListOfTiles";
import Tools from "./Tools";

const ListOfContent = ({
  files,
}: {
  files: readonly ContentHashCollectionWithDay[];
}) => {
  const [selectedContentHashes, setSelectedContentHashes] = useState<
    ReadonlySet<string>
  >(() => new Set());

  const prev = useDeferredValue(selectedContentHashes);
  const L = useLeaflet();

  console.log(
    `GeoMap curr=${selectedContentHashes.size} prev=${prev.size} is=${Object.is(selectedContentHashes, prev)}`,
  );

  const forMap = useMemo<
    Map<string, { position: L.LatLng; highlighted: boolean }>
  >(
    () =>
      L
        ? new Map(
            files.flatMap((t) =>
              t.gps.effective
                ? [
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
          )
        : new Map(),
    [L, files, selectedContentHashes],
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

  const countAll = files.length;

  const selectedFiles: readonly ContentHashCollectionWithDay[] = files.filter(
    (f) => selectedContentHashes.has(f.contentHash),
  );

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
    <div>
      <Tools
        countAll={countAll}
        setAll={setAll}
        selectedFiles={selectedFiles}
      />

      <ListOfTiles
        files={files}
        selectedContentHashes={selectedContentHashes}
        onSelectedContentHashes={(t) => setSelectedContentHashes(t)}
      />

      <GeoMap positions={forMap} listeners={mapListeners} />

      <p>
        With GPS: {forMap.size} {"//"} Without GPS: {files.length - forMap.size}
      </p>
    </div>
  );
};

export default logRender(ListOfContent);
