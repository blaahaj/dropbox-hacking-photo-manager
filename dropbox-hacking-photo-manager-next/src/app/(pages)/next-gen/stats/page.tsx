"use client";

import Navigate from "@components/Navigation";
import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import logRender from "@lib/logRender";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import {
  exifableFileExtensions,
  mediainfoFileExtensions,
} from "dropbox-hacking-photo-manager-shared/fileTypes";
import {
  type FsckType,
  imageFilenamePattern,
  videoFilenamePattern,
} from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import { useEffect } from "react";

const ExifOrMediaInfo = ({
  data,
  fileExtensions,
}: {
  data: FsckType["exif" | "mediaInfo"];
  fileExtensions: readonly string[];
}) => {
  return (
    <div>
      <p>Count: {data.items}</p>
      <p>Eligible files: {data.eligibleFiles} </p>
      <p>
        ... with no cached data: {data.eligibleFilesWithNoItem.count} (
        {(
          (data.eligibleFilesWithNoItem.count / data.eligibleFiles) *
          100
        ).toFixed(2)}
        %) {data.eligibleFilesWithNoItem.count === 0 ? "✅" : "❌"}
      </p>
      <p>
        Cache contains {data.items} entries, of which {data.orphanedItems} (
        {((data.orphanedItems / data.items) * 100).toFixed(2)}
        %) are orphans{" "}
        {(data.orphanedItems / data.items) * 100 < 5 ? "✅" : "❌"}
      </p>
      <p style={{ fontSize: "8pt" }}>
        Eligible files are: {fileExtensions.join(", ")}
      </p>
    </div>
  );
};

const Check = () => {
  const latestValue = useLatestValueFromServerFeed({
    type: "rx.ng.fsck",
  });

  useEffect(() => {
    document.title = "DPMNG - Stats";
  }, []);

  return (
    <>
      <Navigate />

      <main style={{ margin: "2em" }}>
        <h1>Stats</h1>

        {latestValue ? (
          <>
            <Stack direction={"column"}>
              <Stack direction={"row"}>
                <div style={{ flexGrow: 1 }}>
                  <h2>Files</h2>
                  <p>
                    (everything in Dropbox with tag = <code>file</code>)
                  </p>
                  <p>{latestValue.files.count} Count</p>
                  <p>
                    {latestValue.files.fileIdsAreUnique ? "✅" : "❌"} File IDs
                    must be unique
                  </p>
                  <p>
                    {latestValue.files.fileRevsAreUnique ? "✅" : "❌"} File
                    revs must be unique
                  </p>
                </div>
                <div style={{ flexGrow: 1 }}>
                  <h2>Image Files</h2>

                  <p>
                    (Files matching <code>{String(imageFilenamePattern)}</code>)
                  </p>

                  <p>Count: {latestValue.files.imageFiles.count}</p>
                  <p>With EXIF: {latestValue.files.imageFiles.countWithExif}</p>
                  <p>
                    Without EXIF:{" "}
                    {latestValue.files.imageFiles.count -
                      latestValue.files.imageFiles.countWithExif}{" "}
                    {latestValue.files.imageFiles.count -
                      latestValue.files.imageFiles.countWithExif ===
                    0
                      ? "✅"
                      : "❌"}
                  </p>
                </div>
                <div style={{ flexGrow: 1 }}>
                  <h2>Video Files</h2>

                  <p>
                    (Files matching <code>{String(videoFilenamePattern)}</code>)
                  </p>

                  <pre>
                    {JSON.stringify(
                      latestValue.files.videoFiles ?? null,
                      null,
                      2,
                    )}
                  </pre>
                </div>
              </Stack>
              <Stack direction={"row"}>
                <Container>
                  <h2>EXIF DB</h2>
                  <ExifOrMediaInfo
                    data={latestValue.exif}
                    fileExtensions={exifableFileExtensions}
                  />
                </Container>
                <Container>
                  <h2>MediaInfo DB</h2>
                  <ExifOrMediaInfo
                    data={latestValue.mediaInfo}
                    fileExtensions={mediainfoFileExtensions}
                  />
                </Container>
                <Container>
                  <h2>Photo DB</h2>
                  <p>Count: {latestValue.photos.count}</p>
                </Container>
                <Container>
                  <h2>Days DB</h2>
                  <p>Count: {latestValue.days.count}</p>
                </Container>
              </Stack>
            </Stack>
          </>
        ) : (
          "loading..."
        )}
      </main>
    </>
  );
};

export default logRender(Check);
