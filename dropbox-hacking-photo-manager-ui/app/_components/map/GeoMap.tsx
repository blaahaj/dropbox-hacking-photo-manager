import { useLeaflet } from "@hooks/useLeaflet";
import logRender from "@lib/logRender";
import { useEffect, useMemo, useRef } from "react";

import styles from "./page.module.css";

export type MarkerSpec = {
  contentHash: string;
  position: L.LatLng;
  highlighted: boolean;
  interpolated: boolean;
};

export type PathSpec = readonly MarkerSpec[];

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
  paths,
  listeners,
}: {
  paths: readonly PathSpec[];
  listeners?: Partial<{
    onClickMarker: (e: L.LeafletMouseEvent, key: string) => void;
  }>;
}) => {
  const L = useLeaflet();

  if (paths.every((p) => p.length === 0) || !L) return null;

  return <GeoMap paths={paths} listeners={listeners} L={L} />;
};

const GeoMap = ({
  paths,
  listeners,
  L,
}: {
  paths: readonly PathSpec[];
  listeners?: Partial<{
    onClickMarker: (e: L.LeafletMouseEvent, key: string) => void;
  }>;
  L: typeof import("leaflet");
}) => {
  const positions = new Map(paths.flat().map((m) => [m.contentHash, m]));

  const { center, halfDiagonal } = findBoundingBox(
    paths.flatMap((path) => path.map((p) => p.position)),
    L,
  );

  const initialZoom = findInitialZoom(halfDiagonal);

  const eleRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map>(null);

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
  const iconC = useMemo(
    () =>
      new L.Icon.Default({
        imagePath: "https://unpkg.com/leaflet@1.9.4/dist/images/",
        className: styles.iconC,
      }),
    [L],
  );
  const markersRef = useRef(
    new Map<string, MarkerSpec & { marker: L.Marker }>(),
  );

  // Create the map
  useEffect(() => {
    const theMap = L.map(eleRef.current!);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(theMap);

    L.control.scale({ maxWidth: 550 }).addTo(theMap);

    mapRef.current = theMap;

    return () => {
      mapRef.current = null;
      theMap.remove();
      markersRef.current = new Map();
    };
  }, [L]);

  // If the center moves, zoom to the center
  useEffect(() => {
    mapRef.current?.setView({ lat: center.lat, lng: center.lng }, initialZoom);
  }, [center.lat, center.lng, initialZoom]);

  useEffect(() => {
    const theMap = mapRef.current;
    const markers = markersRef.current;

    // Object.defineProperty(window, "theMap", {
    //   value: theMap,
    //   configurable: true,
    // });
    // Object.defineProperty(window, "L", { value: L, configurable: true });

    if (!theMap || !markers) return;

    for (const [id, details] of [...markers.entries()]) {
      if (!positions.has(id)) {
        details.marker.remove();
        markers.delete(id);
      }
    }

    for (const [id, newDetails] of [...positions.entries()]) {
      const oldDetails = markers.get(id);

      if (!oldDetails) {
        const marker = L.marker(newDetails.position, {
          riseOnHover: true,
          title: id,
          icon: newDetails.highlighted
            ? iconB
            : newDetails.interpolated
              ? iconC
              : iconA,
        });
        marker.addTo(theMap);

        marker.addEventListener("click", (e) =>
          listeners?.onClickMarker?.(e, id),
        );

        markers.set(id, {
          ...newDetails,
          marker,
        });
      } else {
        const marker = oldDetails.marker;
        if (!newDetails.position.equals(oldDetails.position)) {
          marker.setLatLng(newDetails.position);
          oldDetails.position = newDetails.position;
        }
        if (
          newDetails.highlighted !== oldDetails.highlighted ||
          newDetails.interpolated !== oldDetails.interpolated
        ) {
          marker.setIcon(
            newDetails.highlighted
              ? iconB
              : newDetails.interpolated
                ? iconC
                : iconA,
          );
          oldDetails.highlighted = newDetails.highlighted;
          oldDetails.interpolated = newDetails.interpolated;
        }
      }
    }
  }, [L, paths]);

  useEffect(() => {
    const theMap = mapRef.current!;
    const p: L.Path[] = [];

    for (const path of paths) {
      const leafletPath = new L.Polyline(path.map((m) => m.position));
      p.push(leafletPath);
      leafletPath.addTo(theMap);
    }

    return () => p.forEach((lp) => lp.removeFrom(theMap));
  }, [L, paths]);

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
