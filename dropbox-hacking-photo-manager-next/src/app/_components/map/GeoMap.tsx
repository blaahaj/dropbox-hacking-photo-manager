"use client";

import logRender from "@lib/logRender";
import * as L from "leaflet";
import React, { useEffect, useMemo, useRef } from "react";

import styles from "./page.module.css";

type P = {
  position: L.LatLng;
  highlighted: boolean;
};

export type Positions = ReadonlyMap<string, P>;

const findBoundingBox = (
  positions: readonly L.LatLng[],
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
  if (positions.size === 0) return null;

  return <GeoMap positions={positions} listeners={listeners} />;
};

const GeoMap = ({
  positions,
  listeners,
}: {
  positions: Positions;
  listeners?: Partial<{
    onClickMarker: (e: L.LeafletMouseEvent, key: string) => void;
  }>;
}) => {
  const { center, halfDiagonal } = findBoundingBox(
    [...positions.values()].map((p) => p.position),
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

    mapRef.current = theMap;

    return () => void theMap.remove();
  }, []);

  useEffect(() => {
    mapRef.current?.setView({ lat: center.lat, lng: center.lng }, initialZoom);
  }, [center.lat, center.lng, initialZoom]);

  const iconA = useMemo(
    () =>
      new L.Icon.Default({
        imagePath: "https://unpkg.com/leaflet@1.9.4/dist/images/",
        className: styles.iconA,
      }),
    [],
  );
  const iconB = useMemo(
    () =>
      new L.Icon.Default({
        imagePath: "https://unpkg.com/leaflet@1.9.4/dist/images/",
        className: styles.iconB,
      }),
    [],
  );
  const markersRef = useRef(new Map<string, P & { marker: L.Marker }>());

  useEffect(() => {
    const theMap = mapRef.current;
    const markers = markersRef.current;
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
          icon: newDetails.highlighted ? iconB : iconA,
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
        if (!newDetails.position.equals(oldDetails.position, 5)) {
          marker.setLatLng(newDetails.position);
          oldDetails.position = newDetails.position;
        }
        if (newDetails.highlighted !== oldDetails.highlighted) {
          marker.setIcon(newDetails.highlighted ? iconB : iconA);
          oldDetails.highlighted = newDetails.highlighted;
        }
      }
    }
  });

  useEffect(() => {
    const link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute(
      "href",
      "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
    );
    link.setAttribute(
      "integrity",
      "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=",
    );
    link.setAttribute("crossorigin", "");

    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={eleRef}
        style={{
          width: "600px",
          height: "600px",
          // border: "1px solid blue",
          // boxSizing: "content-box",
        }}
      />
    </div>
  );
};

export default logRender(GeoMapWrapper);
