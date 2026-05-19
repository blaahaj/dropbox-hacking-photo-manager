"use client";

import Navigate from "@components/Navigation";
import SamePageLink from "@components/samePageLink";
import ShowData from "@components/ShowData";
import TagList from "@components/tags/TagList";
import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import logRender from "@lib/logRender";
import { useEffect } from "react";

import styles from "./page.module.css";

const XOutOfY = ({ x, y }: { x: number; y: number }) => (
  <td style={{ textAlign: "end", paddingInlineEnd: "1em" }}>{y - x || ""}</td>
);

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

      <main style={{ margin: "2em" }}>
        <h1>List of days (no samples)</h1>

        {latestValue ? (
          <div>
            <table className={styles.listOfDays}>
              <thead
                style={{
                  position: "sticky",
                  top: "0",
                  background: "rgba(255, 255, 255, 0.6)",
                }}
              >
                <tr>
                  <th>Date</th>
                  <th>Missing EXIF</th>
                  <th>Missing MediaInfo</th>
                  <th>Missing GPS</th>
                  <th>Description</th>
                  <th>Tags</th>
                </tr>
              </thead>
              <tbody>
                {latestValue.map((row) => (
                  <tr key={row.date}>
                    <td>
                      <SamePageLink
                        className={styles.dayLink}
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
                    />
                    <XOutOfY
                      x={row.counts.hasMediaInfoCount}
                      y={row.counts.mediaInfoableCount}
                    />
                    <XOutOfY
                      x={row.counts.hasGPSCount}
                      y={row.counts.previewableCount}
                    />
                    <td>{row.dayMetadata?.description ?? ""}</td>
                    <td>
                      <TagList
                        data={Object.entries(row.photoTags)
                          .map(([tag, count]) => ({ tag, count }))
                          .toSorted(
                            (a, b) =>
                              b.count - a.count || a.tag.localeCompare(b.tag),
                          )}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ShowData data={latestValue} />
          </div>
        ) : (
          "loading ..."
        )}
      </main>
    </>
  );
};

export default logRender(NGDaysNoSamples);
