import { useLeaflet } from "@hooks/useLeaflet";
import logRender from "@lib/logRender";
import { useEffect, useMemo, useRef, useState } from "react";

import styles from "./page.module.css";

type P = {
  position: L.LatLng;
  highlighted: boolean;
};

export type Positions = ReadonlyMap<string, P>;

const findBoundingBox = (
  positions: readonly L.LatLng[],
  L: typeof import("leaflet"),
): { center: L.LatLng; halfDiagonal: number } => {
  let minLat = +Infinity;
  let maxLat = -Infinity;
  let minLng = +Infinity;
  let maxLng = -Infinity;

  for (const position of positions) {
    if (position.lat < minLat) minLat = position.lat;
    if (position.lat > maxLat) maxLat = position.lat;
    if (position.lng < minLng) minLng = position.lng;
    if (position.lng > maxLng) maxLng = position.lng;
  }

  const center = new L.LatLng((minLat + maxLat) / 2, (minLng + maxLng) / 2);

  const halfDiagonal = center.distanceTo({ lat: maxLat, lng: maxLng });

  return { center, halfDiagonal };
};

const findInitialZoom = (halfDiagonal: number) => {
  let initialZoom = 18 - Math.ceil(Math.log(halfDiagonal / 100) / Math.log(2));
  if (initialZoom < 0) initialZoom = 0;
  if (initialZoom > 19) initialZoom = 19;
  return initialZoom;
};

const GeoMapWrapper = ({
  positions,
  listeners,
}: {
  positions: Positions;
  listeners?: Partial<{
    onClickMarker: (e: L.LeafletMouseEvent, key: string) => void;
  }>;
}) => {
  const L = useLeaflet();

  console.dir({ positions: [...positions.entries()] });

  if (positions.size === 0 || !L) return null;

  return <GeoMap positions={positions} listeners={listeners} L={L} />;
};

const GeoMap = ({
  positions,
  listeners,
  L,
}: {
  positions: Positions;
  listeners?: Partial<{
    onClickMarker: (e: L.LeafletMouseEvent, key: string) => void;
  }>;
  L: typeof import("leaflet");
}) => {
  const { center, halfDiagonal } = findBoundingBox(
    [...positions.values()].map((p) => p.position),
    L,
  );

  const initialZoom = findInitialZoom(halfDiagonal);

  const eleRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    const theMap = L.map(eleRef.current!);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(theMap);

    L.control.scale({ maxWidth: 550 }).addTo(theMap);

    console.log("Setting theMap to", theMap);
    mapRef.current = theMap;

    return () => {
      console.log("Unsetting theMap");
      mapRef.current = null;
      theMap.remove();
    };
  }, [L]);

  useEffect(() => {
    mapRef.current?.setView({ lat: center.lat, lng: center.lng }, initialZoom);
  }, [center.lat, center.lng, initialZoom]);

  const iconA = useMemo(
    () =>
      new L.Icon.Default({
        imagePath: "https://unpkg.com/leaflet@1.9.4/dist/images/",
        className: styles.iconA,
      }),
    [L],
  );
  const iconB = useMemo(
    () =>
      new L.Icon.Default({
        imagePath: "https://unpkg.com/leaflet@1.9.4/dist/images/",
        className: styles.iconB,
      }),
    [L],
  );
  console.dir({ iconA, iconB, styles });
  const markersRef = useRef(new Map<string, P & { marker: L.Marker }>());

  const [enableMarkers, setEnableMarkers] = useState(false);

  useEffect(() => {
    const theMap = mapRef.current;
    const markers = markersRef.current;
    console.log(
      `markers updater theMap=${!!theMap} markers=${!!markers} enable=${enableMarkers}`,
    );

    Object.defineProperty(window, "theMap", {
      value: theMap,
      configurable: true,
    });
    Object.defineProperty(window, "L", { value: L, configurable: true });

    if (!theMap || !markers || !enableMarkers) return;

    console.dir({
      positions: [...positions.entries()],
      markers: [...markers.entries()],
    });

    for (const [id, details] of [...markers.entries()]) {
      if (!positions.has(id)) {
        details.marker.remove();
        markers.delete(id);
        console.debug("Removed marker", id, details.marker);
      }
    }

    for (const [id, newDetails] of [...positions.entries()]) {
      const oldDetails = markers.get(id);

      if (!oldDetails) {
        const marker = L.marker(newDetails.position, {
          riseOnHover: true,
          title: id,
          icon: new L.Icon.Default({
            imagePath: "https://unpkg.com/leaflet@1.9.4/dist/images/",
            className: newDetails.highlighted ? styles.iconB : styles.iconA,
          }),
        });
        console.dir({ addedMarker: marker });
        marker.addTo(theMap);
        console.dir({ theMap });

        marker.addEventListener("click", (e) =>
          listeners?.onClickMarker?.(e, id),
        );

        markers.set(id, {
          ...newDetails,
          marker,
        });
        console.debug("Added marker", id, marker);
      } else {
        const marker = oldDetails.marker;
        if (!newDetails.position.equals(oldDetails.position, 5)) {
          marker.setLatLng(newDetails.position);
          oldDetails.position = newDetails.position;
          console.debug("Updated marker position", id, marker);
        }
        if (newDetails.highlighted !== oldDetails.highlighted) {
          marker.setIcon(newDetails.highlighted ? iconB : iconA);
          oldDetails.highlighted = newDetails.highlighted;
          console.debug("Updated marker highlight (icon)", id, marker);
        }
      }
    }
  }, [enableMarkers]);

  // For some reason, without this, the markers don't appear
  useEffect(() => {
    const t = setTimeout(() => setEnableMarkers(true), 0);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={eleRef}
        style={{
          width: "670px",
          height: "670px",
          // border: "1px solid blue",
          // boxSizing: "content-box",
        }}
      />
    </div>
  );
};

export default logRender(GeoMapWrapper);
