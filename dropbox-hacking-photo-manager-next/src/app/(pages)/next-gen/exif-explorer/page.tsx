"use client";

import Navigate from "@components/Navigation";
import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import logRender from "@lib/logRender";
import type { ExifExplorerType } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import React, { useEffect } from "react";

import styles from "./page.module.css";
import ShowData from "@components/ShowData";

type Counts = ExifExplorerType["tagCounts"][number][1];
type Entry = readonly [string, Counts];
type EntrySorter = (a: Entry, b: Entry) => number;

const ExifExplorer = () => {
  const latestValue = useLatestValueFromServerFeed({
    type: "rx.ng.exif-explorer",
  });

  useEffect(() => {
    document.title = "DPMNG - EXIF Explorer";
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

      <h1>EXIF Explorer</h1>

      {sortedTagCounts && (
        <table className={styles.exifTable}>
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
                  {((counts.present / latestValue.entries) * 100.0).toFixed(2)}
                </td>
                <td className={styles.data}>
                  {((counts.nonBlank / latestValue.entries) * 100.0).toFixed(2)}
                </td>
                <td className={styles.data}>
                  {((counts.nonBlank / counts.present) * 100.0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <br/>
      <br/>

      <ShowData data={latestValue} />
    </>
  );
};

export default logRender(ExifExplorer);
