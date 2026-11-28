import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import {
  exifableFileExtensions,
  mediainfoFileExtensions,
} from "dropbox-hacking-photo-manager-shared/fileTypes";
import {
  imageFilenamePattern,
  videoFilenamePattern,
} from "dropbox-hacking-photo-manager-shared/serverSideFeeds";

import { ExifOrMediaInfo } from "./ExifOrMediaInfo";
import styles from "./StatsBoxes.module.css";

export const StatsBoxes = () => {
  const latestValue = useLatestValueFromServerFeed({
    type: "rx.ng.fsck",
  });

  if (!latestValue) return <p>loading...</p>;

  return (
    <>
      <div className={styles.boxes}>
        <div className={styles.box}>
          <h2>Files</h2>
          <p>
            (everything in Dropbox with tag = <code>file</code>)
          </p>
          <p>{latestValue.files.count} Count</p>
          <p>
            {latestValue.files.fileIdsAreUnique ? "✅" : "❌"} File IDs must be
            unique
          </p>
          <p>
            {latestValue.files.fileRevsAreUnique ? "✅" : "❌"} File revs must
            be unique
          </p>
        </div>
        <div className={styles.box}>
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
        <div className={styles.box}>
          <h2>Video Files</h2>

          <p>
            (Files matching <code>{String(videoFilenamePattern)}</code>)
          </p>

          <pre>
            {JSON.stringify(latestValue.files.videoFiles ?? null, null, 2)}
          </pre>
        </div>
        <div className={styles.box}>
          <h2>EXIF DB</h2>
          <ExifOrMediaInfo
            data={latestValue.exif}
            fileExtensions={exifableFileExtensions}
          />
        </div>
        <div className={styles.box}>
          <h2>MediaInfo DB</h2>
          <ExifOrMediaInfo
            data={latestValue.mediaInfo}
            fileExtensions={mediainfoFileExtensions}
          />
        </div>
        <div className={styles.box}>
          <h2>Photo DB</h2>
          <p>Count: {latestValue.photos.count}</p>
        </div>
        <div className={styles.box}>
          <h2>Days DB</h2>
          <p>Count: {latestValue.days.count}</p>
        </div>
      </div>
    </>
  );
};
