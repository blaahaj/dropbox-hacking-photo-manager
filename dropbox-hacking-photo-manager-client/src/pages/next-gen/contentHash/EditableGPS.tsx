import EditableTextField from "@components/editableTextField";
import logRender from "@lib/logRender";
import {
  GPSLatLong,
  type PhotoDbEntry,
} from "dropbox-hacking-photo-manager-shared";
import React, { useMemo } from "react";

const parse = (t: string): PhotoDbEntry["gps"] => {
  t = t.trim();
  if (t === "" || t === "none") return undefined;

  const m0 = t.match(/^([+-]?\d+\.\d+)\s*,\s*([+-]?\d+\.\d+)$/);
  if (m0) return [parseFloat(m0[1]), parseFloat(m0[2])] as const;

  const m1 = t.match(/^(\d+\.\d+)\s*([NS])(?:\s*,\s*|\s+)(\d+\.\d+)\s*([EW])$/);
  if (m1) {
    const g = new GPSLatLong({
      lat: parseFloat(m1[1]),
      latRef: m1[2] as "N" | "S",
      long: parseFloat(m1[3]),
      longRef: m1[4] as "E" | "W",
    });
    return g.asTuple();
  }

  return undefined;
};

const EditableGPS = ({
  contentHash,
  photoDbEntry,
}: {
  contentHash: string;
  photoDbEntry: PhotoDbEntry;
}) => {
  const onSave = useMemo(
    () => (gpsText: string) =>
      fetch(`/api/photo/content_hash/${contentHash}`, {
        method: "PATCH",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...(photoDbEntry ?? {}), gps: parse(gpsText) }),
      }).then(() => {}),
    [contentHash, photoDbEntry],
  );

  const text = photoDbEntry.gps
    ? `${photoDbEntry.gps[0]}, ${photoDbEntry.gps[1]}`
    : "none";

  return (
    <div>
      <div>
        GPS override:{" "}
        <EditableTextField key={text} value={text} onSave={onSave} />
      </div>
    </div>
  );
};

export default logRender(EditableGPS);
