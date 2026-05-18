"use client";

import { parseLatLong } from "@blaahaj/geometry/parse";
import * as j from "@blaahaj/json";
import logRender from "@lib/logRender";
import { type PhotoDbEntry } from "dropbox-hacking-photo-manager-shared";
import type { DayFilesResult } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import { useMemo, useState } from "react";

import { useLeaflet } from "@/app/useLeaflet";

import styles from "./MultiGPSEditor.module.css";
import places from "./places.json" with { format: "json" };

const isGeoJSONPoint = (t: unknown): t is GeoJSON.Feature<GeoJSON.Point> =>
  typeof t === "object" &&
  t !== null &&
  "type" in t &&
  t.type === "Feature" &&
  "geometry" in t &&
  typeof t.geometry === "object" &&
  t.geometry !== null &&
  "type" in t.geometry &&
  t.geometry.type === "Point";

const parse = (t: string): PhotoDbEntry["gps"] => {
  t = t.trim();
  if (t === "" || t === "none") return undefined;

  const latLong = parseLatLong(t);
  if (latLong) return [latLong.lat, latLong.long];

  try {
    const data = j.protoSafeParse(t);
    if (isGeoJSONPoint(data))
      return [data.geometry.coordinates[1], data.geometry.coordinates[0]];
  } catch {
    //
  }

  // https://www.google.com/maps/@48.0456984,16.2767616,3a,75y,338.45h,115.63t/data=!3m7!1e1!3m5!1sl56WBTP0NO7Kh_LNoGXf9w!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-25.625717715230806%26panoid%3Dl56WBTP0NO7Kh_LNoGXf9w%26yaw%3D338.44996179759255!7i16384!8i8192?hl=en&entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D
  const m0 = t.match(
    /^https:\/\/www\.google\.com\/maps\/@(?<N>.*?),(?<E>.*?),/,
  );
  if (m0?.groups) {
    return [Number(m0.groups.N), Number(m0.groups.E)];
  }

  // https://www.openstreetmap.org/#map=12/55.6740/12.5666
  const m1 = t.match(
    /^https:\/\/www\.openstreetmap\.org\/#map=[0-9]+\/(?<N>.*?)\/(?<E>.*?)$/,
  );
  if (m1?.groups) {
    return [Number(m1.groups.N), Number(m1.groups.E)];
  }

  return undefined;
};

const findBoundingBox = (
  positions: readonly L.LatLng[],
  L: typeof import("leaflet"),
): { center: L.LatLng; halfDiagonal: number } | null => {
  if (positions.length === 0) return null;

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

const useAverageEmbedded = (files: DayFilesResult["files"]) => {
  const L = useLeaflet();

  return useMemo(
    () =>
      L
        ? (findBoundingBox(
            files
              .map((f) => f.gps.fromContent)
              .flatMap((t) => (t ? [new L.LatLng(t.lat, t.long)] : [])),
            L,
          )?.center ?? null)
        : null,
    [L, files],
  );
};

const parseSpec = (spec: string, original: string) => {
  spec = spec.trim();

  if (spec === original) return "no-change";
  if (spec === "" || spec === "none")
    return original === "none" ? "no-change" : "none";

  return parse(spec) ?? "not-valid";
};

const MultiGPSEditor = ({
  contentHashes,
  files,
}: {
  contentHashes: ReadonlySet<string>;
  files: DayFilesResult["files"];
}) => {
  // Each file independently /can/ have an override,
  // and /can/ have an embedded, and therefore /can/
  // have an effective.

  // So let's start simple. We'll /show/ the embedded data,
  // but only /edit/ the overrides.
  const contents = useAverageEmbedded(files);

  const overrides = new Set(
    files.map((f) =>
      f.gps.fromOverride
        ? `${f.gps.fromOverride.lat},${f.gps.fromOverride.long}`
        : "none",
    ),
  );

  const initialText = [...overrides].toSorted().join(" / ");
  const [text, setText] = useState(() => initialText);
  const isSpecValid = parseSpec(text, initialText);
  const isChanged = isSpecValid !== "no-change";

  const doUpdate = () => {
    if (isSpecValid === "no-change" || isSpecValid === "not-valid") return;

    const newValue: PhotoDbEntry["gps"] =
      isSpecValid === "none" ? undefined : isSpecValid;

    const body = {
      contentHashes: [...contentHashes].toSorted(),
      newValue: newValue ?? null,
    };
    console.log(body);
    void fetch("http://localhost:4000/api/multi-photo-gps", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  };

  const [expandPresents, setExpandPresets] = useState(false);

  return (
    <div className="multiGpsEditor">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isSpecValid) doUpdate();
        }}
      >
        GPS override:{" "}
        <input
          style={{
            backgroundColor: isSpecValid !== "not-valid" ? "#fff" : "#faa",
            width: "25em",
          }}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => {
            if (Array.isArray(isSpecValid)) {
              setText(`${isSpecValid[0]},${isSpecValid[1]}`);
            }
          }}
        />{" "}
        <input
          type="submit"
          disabled={!(isSpecValid !== "not-valid") || !isChanged}
          value="Save"
        />
      </form>
      <p>
        From content (average):{" "}
        {contents ? `${contents.lat}, ${contents.lng}` : "none"}
      </p>
      <p onDoubleClick={() => setExpandPresets(!expandPresents)}>Presets...</p>
      {expandPresents && (
        <ol id={styles.presets}>
          {places.features
            .map((f) => [
              f.properties.label,
              `${f.geometry.coordinates[1]}, ${f.geometry.coordinates[0]}`,
            ])
            .toSorted((a, b) => a[0].localeCompare(b[0]))
            .map((item) => (
              <li key={item[1]} onClick={() => setText(item[1])}>
                {item[0]}
              </li>
            ))}
        </ol>
      )}
    </div>
  );
};

export default logRender(MultiGPSEditor);
