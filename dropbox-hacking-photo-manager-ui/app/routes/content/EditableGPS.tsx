import { parseLatLong } from "@blaahaj/geometry/parse";
import EditableTextField from "@components/editableTextField";
import logRender from "@lib/logRender";
import { type PhotoDbEntry } from "dropbox-hacking-photo-manager-shared";
import { useMemo } from "react";

const parse = (t: string): PhotoDbEntry["gps"] => {
  t = t.trim();
  if (t === "" || t === "none") return undefined;

  const latLong = parseLatLong(t);
  if (!latLong) return;

  return [latLong.lat, latLong.long];
};

const EditableGPS = ({
  contentHash,
  photoDbEntry,
}: {
  contentHash: string;
  photoDbEntry: PhotoDbEntry;
}) => {
  const onSave = useMemo(
    () => (gpsText: string) => {
      const gps = parse(gpsText);

      return fetch(
        `http://localhost:4000/api/photo/content_hash/${contentHash}`,
        {
          method: "PATCH",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...(photoDbEntry ?? {}),
            gps,
          }),
        },
      ).then(() => {});
    },
    [contentHash, photoDbEntry],
  );

  const text = photoDbEntry.gps
    ? `${photoDbEntry.gps[0]}, ${photoDbEntry.gps[1]}`
    : "";

  const inactiveText = photoDbEntry.gps
    ? `${photoDbEntry.gps[0].toFixed(5)}, ${photoDbEntry.gps[1].toFixed(5)}`
    : "(none)";

  return (
    <div>
      <div>
        {/* FIXME invalid GPS input is silently accepted as "none" */}
        <EditableTextField
          key={text}
          value={text}
          onSave={onSave}
          renderInactive={() => <>{inactiveText}</>}
        />
      </div>
    </div>
  );
};

export default logRender(EditableGPS);
