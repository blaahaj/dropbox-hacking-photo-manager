"use client";

import Navigate from "@components/Navigation";
import ShowData from "@components/ShowData";
import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import logRender from "@lib/logRender";
import type { ExifExplorerType } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import React, {useEffect } from "react";

import styles from "./page.module.css";

type Counts = ExifExplorerType["tagCounts"][number][1];
type Entry = readonly [string, Counts];
type EntrySorter = (a: Entry, b: Entry) => number;

const MediaInfoExplorer = ({
  params: pathParams,
}: {
  params: Promise<{ readonly streamKind?: string }>;
}) => {
  const { streamKind: rawStreamKind } = React.use(pathParams);
  const effectiveStreamKind =
    rawStreamKind === "null" ? null : (rawStreamKind ?? null);

  const latestValue = useLatestValueFromServerFeed({
    type: "rx.ng.mediainfo-explorer",
    streamKind: effectiveStreamKind,
  });

  useEffect(() => {
    document.title = "DPMNG - MediaInfo Explorer";
  }, []);

  const byName: EntrySorter = (a, b) => a[0].localeCompare(b[0]);
  // const byPresent: EntrySorter = (a, b) =>
  //   b[1].present - a[1].present || byName(a, b);
  const byNonBlank: EntrySorter = (a, b) =>
    b[1].nonBlank - a[1].nonBlank || byName(a, b);

  const sortedTagCounts =
    latestValue && latestValue.tagCounts?.toSorted(byNonBlank);

  // FIXME: what stream kinds are there? Would be nice to provide a list.
  // const uniqueStreamKinds = latestValue ? latestValue.

  return (
    <>
      <Navigate />

      <h1>MediaInfo Explorer</h1>

      <h2>StreamKind: {effectiveStreamKind ?? "all"}</h2>

      <ul style={{ display: "flex", flexDirection: "row", marginBlock: "1em" }}>
        {[null, "General", "Video", "Menu", "Image", "Audio", "Other"].map(
          (kind) => (
            <li
              key={kind ?? "null"}
              style={{
                listStyle: "none",
                marginInlineEnd: "1em",
                fontWeight: kind === effectiveStreamKind ? "bold" : "normal",
              }}
            >
              <a href={`./${kind ?? "null"}`}>{kind ?? "all"}</a>
            </li>
          ),
        )}
      </ul>

      {sortedTagCounts && (
        <table className={styles.mediaInfoTable}>
          <thead>
            <tr>
              <th>Tag</th>
              <th className={styles.data}>present</th>
              <th className={styles.data}>non-blank</th>
              <th className={styles.data}>present % of all</th>
              <th className={styles.data}>non-blank % of all</th>
              <th className={styles.data}>non-blank % of present</th>
            </tr>
          </thead>
          <tbody>
            {sortedTagCounts.map(([tag, counts]) => (
              <tr key={tag}>
                <td>{tag}</td>
                <td className={styles.data}>{counts.present}</td>
                <td className={styles.data}>{counts.nonBlank}</td>
                <td className={styles.data}>
                  {((counts.present / latestValue.entries) * 100.0).toFixed(1)}
                </td>
                <td className={styles.data}>
                  {((counts.nonBlank / latestValue.entries) * 100.0).toFixed(1)}
                </td>
                <td className={styles.data}>
                  {((counts.nonBlank / counts.present) * 100.0).toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ShowData data={latestValue} />
    </>
  );
};

export default logRender(MediaInfoExplorer);
