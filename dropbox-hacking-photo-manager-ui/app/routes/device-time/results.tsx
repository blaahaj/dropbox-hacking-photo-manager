import { tryToResult } from "@blaahaj/gotcha/Result";
import type { ContentHashCollectionWithDay } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import { useRef, useState } from "react";

import MaybeVisibleThumbnail from "~/_components/ContentTile/MaybeVisibleThumbnail";

export default function Results(props: {
  results: readonly ContentHashCollectionWithDay[];
}) {
  const hasUntrustedClock = (device: string) =>
    !!device.match(/Canon|FUJIFILM/);

  const withDevice = props.results.map((c) => {
    const device = [
      c.exif?.exifData.tags?.Make,
      c.exif?.exifData.tags?.Model,
      c.exif?.exifData.tags?.Model2,
    ]
      .filter(Boolean)
      .join(" ");

    return {
      c,
      device,
      hasUntrustedClock: hasUntrustedClock(device),
    };
  });

  const [durationSpec, setDurationSpec] = useState("PT0S");
  const duration = tryToResult(() => Temporal.Duration.from(durationSpec));
  const lastGoodDuration = useRef(Temporal.Duration.from("PT0S"));
  if (duration.isOK()) lastGoodDuration.current = duration.value;

  const resorted = withDevice
    .map((t) => ({
      ...t,
      correctedTime: Temporal.Instant.from(t.c.timestamp).add(
        t.hasUntrustedClock ? lastGoodDuration.current : "PT0S",
      ),
    }))
    .toSorted(
      (a, b) =>
        a.correctedTime.epochMilliseconds - b.correctedTime.epochMilliseconds ||
        a.c.contentHash.localeCompare(b.c.contentHash),
    );

  return (
    <div>
      <div>
        Seconds to add:{" "}
        <input
          style={{ border: `3px solid ${duration.isError() ? "red" : "#999"}` }}
          type="text"
          value={durationSpec}
          onChange={(e) => setDurationSpec(e.target.value)}
        />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {resorted.map((t) => (
          <div
            key={t.c.contentHash}
            style={{
              margin: "0.3em",
              border: `5px solid ${t.hasUntrustedClock ? "red" : "blue"}`,
            }}
          >
            {t.correctedTime.toJSON()}
            <MaybeVisibleThumbnail
              namedFile={t.c.namedFiles[0]}
              photo={t.c.photo ?? {}}
              visible={true}
              linkTo={`/content/${t.c.contentHash}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
