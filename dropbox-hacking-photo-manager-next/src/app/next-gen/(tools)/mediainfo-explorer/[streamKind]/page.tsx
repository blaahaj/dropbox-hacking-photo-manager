"use client";

import Navigate from "@components/navigation";
import { useLatestValueFromServerFeed } from "@/app/_hooks/useLatestValueFromServerFeed";
import logRender from "@/app/_lib/logRender";
import type { ExifExplorerType } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import { useEffect } from "react";

type Counts = ExifExplorerType["tagCounts"][number][1];
type Entry = readonly [string, Counts];
type EntrySorter = (a: Entry, b: Entry) => number;

const MediaInfoExplorer = ({ streamKind }: { streamKind: string | null }) => {
  if (streamKind === "null") streamKind = null;

  // FIXME: this page seems often to show no data.
  // On port 4000, loading /video first seems to help. Then the data disappears again.
  // Odd.
  const latestValue = useLatestValueFromServerFeed({
    type: "rx.ng.mediainfo-explorer",
    streamKind,
  });

  useEffect(() => {
    document.title = "DPMNG - Mediainfo Explorer";
  }, []);

  const byName: EntrySorter = (a, b) => a[0].localeCompare(b[0]);
  // const byPresent: EntrySorter = (a, b) =>
  //   b[1].present - a[1].present || byName(a, b);
  const byNonBlank: EntrySorter = (a, b) =>
    b[1].nonBlank - a[1].nonBlank || byName(a, b);

  const sortedTagCounts =
    latestValue && latestValue.tagCounts?.toSorted(byNonBlank);

  return (
    <>
      <Navigate />

      <h1>MediaInfo Explorer</h1>

      <h2>StreamKind: {streamKind ?? "all"}</h2>

      {sortedTagCounts && (
        <table>
          <thead>
            <tr>
              <th>Tag</th>
              <th>present</th>
              <th>non-blank</th>
              <th>present % of all</th>
              <th>non-blank % of all</th>
              <th>non-blank % of present</th>
            </tr>
          </thead>
          <tbody>
            {sortedTagCounts.map(([tag, counts]) => (
              <tr key={tag}>
                <td>{tag}</td>
                <td>{counts.present}</td>
                <td>{counts.nonBlank}</td>
                <td>
                  {((counts.present / latestValue.entries) * 100.0).toFixed(1)}
                </td>
                <td>
                  {((counts.nonBlank / latestValue.entries) * 100.0).toFixed(1)}
                </td>
                <td>
                  {((counts.nonBlank / counts.present) * 100.0).toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {latestValue ?
        <pre>{JSON.stringify(latestValue ?? null, null, 2)}</pre>
      : "loading..."}
    </>
  );
};

export default logRender(MediaInfoExplorer);
