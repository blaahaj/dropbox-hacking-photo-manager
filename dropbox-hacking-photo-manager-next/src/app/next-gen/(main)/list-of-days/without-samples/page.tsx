"use client";

import Navigate from "@components/navigation";
import SamePageLink from "@components/samePageLink";
import ShowData from "@components/ShowData";
import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import logRender from "@lib/logRender";
import { useEffect } from "react";
import styles from "./page.module.css";
import TagsWithCounts from "@components/tag/TagsWithCounts";

const XOutOfY = ({
  x,
  y,
  explanation,
}: {
  x: number;
  y: number;
  explanation: string;
}) =>
  y === 0 ?
    <td />
  : <td
      style={{
        backgroundColor: `rgb(${255.0 * (1 - x / y)}, 0, 0)`,
        textAlign: "center",
      }}
      title={explanation}
    >
      {x} / {y}
    </td>;

const NGDaysNoSamples = () => {
  const latestValue = useLatestValueFromServerFeed({
    type: "rx.ng.list-of-days",
    withSamples: false,
  });

  useEffect(() => {
    document.title = "DPMNG - Plain list of days";
  }, []);

  return (
    <>
      <Navigate />

      <h1>List of days (no samples)</h1>

      {latestValue ?
        <table className={styles.daysTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>EXIF</th>
              <th>MediaInfo</th>
              <th>GPS</th>
              <th>Description</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {latestValue.map((row) => (
              <tr key={row.date}>
                <td>
                  <SamePageLink
                    routeState={{
                      route: "route/next-gen/day/files",
                      date: row.date,
                    }}
                  >
                    {row.date}
                  </SamePageLink>
                </td>
                <XOutOfY
                  x={row.counts.hasExifCount}
                  y={row.counts.exifableCount}
                  explanation="how many have EXIF / how many *can* have EXIF"
                />
                <XOutOfY
                  x={row.counts.hasMediaInfoCount}
                  y={row.counts.mediaInfoableCount}
                  explanation="how many have mediainfo / how many *can* have mediainfo"
                />
                <XOutOfY
                  // FIXME: misuse of "XOutOfY"
                  x={row.counts.hasGPSCount}
                  y={row.counts.previewableCount}
                  explanation="how many have GPS / how many are previewable"
                />
                <td>{row.dayMetadata?.description ?? ""}</td>
                <td>
                  <TagsWithCounts tags={row.photoTags} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      : "loading ..."}

      <ShowData data={latestValue} />
    </>
  );
};
//x

export default logRender(NGDaysNoSamples);
