"use client";
import logRender from "@lib/logRender";
import Navigation from "@components/navigation";
import React, { type Usable } from "react";
import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import ShowData from "@components/ShowData";

import CopyButton from "@components/CopyButton";
import PathsInDropbox from "./PathsInDropbox";
import Link from "next/link";

const Page = ({
  params: pathParams,
}: {
  params: Usable<{ readonly contentHash: string }>;
}) => {
  const { contentHash } = React.use(pathParams);

  const latestValue = useLatestValueFromServerFeed({
    type: "rx.ng.content_hash",
    contentHash,
  });

  const latestDayValue = useLatestValueFromServerFeed({
    type: "rx.ng.day.files",
    date: latestValue?.date ?? "2026-01-01",
  });

  return (
    <div>
      <Navigation />

      {latestValue && (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              border: "1px solid blue",
            }}
          >
            <div
              style={{
                width: 700,
                height: 700,
                alignContent: "center",
                justifyContent: "center",
                border: "1px solid red",
                margin: "1em",
              }}
            >
              <a
                href={`http://localhost:4000/image/rev/${latestValue.namedFiles[0].rev}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  style={{ display: "block", margin: "auto" }}
                  src={`http://localhost:4000/image/rev/${latestValue.namedFiles[0].rev}/w640h480/bestfit/jpeg`}
                  alt=""
                />
              </a>
            </div>
            <div style={{ margin: "1em", border: "1px solid red" }}>
              <h2>Info</h2>
              <p>
                ID: {contentHash.substring(0, 8)}{" "}
                <CopyButton
                  title="Copy full content ID"
                  items={() => [
                    new ClipboardItem({ "text/plain": contentHash }),
                  ]}
                  feedbackMillis={500}
                />
              </p>
              <p>
                Date:{" "}
                <Link href={`/next-gen/day/${latestValue.date}/files`}>
                  {latestValue.date}
                </Link>{" "}
                {latestDayValue?.dayMetadata?.description || "-"}
              </p>
              <p>Time: {latestValue.timestamp.split("T")[1]}</p>

              <h2>Editable stuff</h2>
              <ul>
                <li>Day description</li>
                <li>
                  <ShowData data={latestDayValue} />
                </li>
                <li>Description</li>
                <li>Tags</li>
              </ul>

              <h2>GPS</h2>
              <ul>
                <li>extracted GPS</li>
                <li>overridden GPS (allow presets)</li>
                <li>effective GPS</li>
                <li>Map showing them and allowing override to be set</li>
              </ul>
              <ShowData data={latestValue?.gps} expanded={true} />

              <h2>Geometry</h2>
              <ul>
                <li>Width & Height</li>
                <li>Rotation</li>
              </ul>

              <h2>Exif</h2>
              <ShowData data={latestValue?.exif} />

              {latestValue.mediaInfo && (
                <>
                  <h2>MediaInfo</h2>
                  <h3>Info</h3>
                  <ShowData data={latestValue?.mediaInfo} />
                  <h3>Duration</h3>
                  <ShowData data={latestValue?.duration} expanded={true} />
                </>
              )}

              <h2>Paths in Dropbox</h2>
              <p>Size: {latestValue.namedFiles[0].size} bytes</p>
              {/* TODO: show in MB, etc */}
              <PathsInDropbox
                contentHash={contentHash}
                namedFiles={latestValue.namedFiles}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default logRender(Page, false);
