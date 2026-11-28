import GeoMap, { type PathSpec } from "@components/map/GeoMap";
import { useLeaflet } from "@hooks/useLeaflet";
import logRender from "@lib/logRender";
import type { ContentHashCollectionWithDay } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import { useMemo, useState } from "react";

import { interpolateGPS } from "./interpolate";
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

  const L = useLeaflet();

  const r = useMemo(
    () =>
      interpolateGPS(
        files.toSorted(
          (a, b) =>
            a.timestamp.localeCompare(b.timestamp) ||
            a.contentHash.localeCompare(b.contentHash),
        ),
      ),
    [files],
  );

  const forMap = useMemo<PathSpec[]>(() => {
    if (!L) return [];

    const pathSpec = r.items.map((item) => ({
      contentHash: item.c.contentHash,
      position: new L.LatLng(item.gps.lat, item.gps.long),
      highlighted: selectedContentHashes.has(item.c.contentHash),
      interpolated: item.interpolated,
    }));

    return [pathSpec];
  }, [L, r, selectedContentHashes]);

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

  // console.log(JSON.stringify({ forMap: [...forMap.entries()] }, null, 2));

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

      <GeoMap paths={forMap} listeners={mapListeners} />

      <p>
        With GPS: {r.counts.with} {"//"} Interpolated: {r.counts.interpolated}{" "}
        {"//"} Without GPS: {r.counts.without}
      </p>
    </div>
  );
};

export default logRender(ListOfContent);
