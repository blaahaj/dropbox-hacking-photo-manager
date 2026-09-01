import type { DayFilesResult } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import { Link } from "react-router";

import styles from "./SummariseFileState.module.css";

export default function SummariseFileState({
  dayData,
  contentHash,
}: {
  dayData: DayFilesResult;
  contentHash: string;
}) {
  // TODO, indicate >1 day
  // TODO, make editable

  return (
    <>
      <div style={{ marginBlock: "1em" }}>
        {dayData.files.length === 1 ? (
          <p>
            The only file from{" "}
            <Link
              className={styles.dayLink}
              to={`/days/${encodeURIComponent(dayData.date)}`}
            >
              {dayData.date}
            </Link>
          </p>
        ) : (
          <p>
            {1 +
              (dayData.files
                .toSorted((a, b) => a.timestamp.localeCompare(b.timestamp))
                .findIndex((c) => c.contentHash === contentHash) ?? "-2")}
            /{dayData.files.length} from{" "}
            <Link
              className={styles.dayLink}
              to={`/days/${encodeURIComponent(dayData.date)}`}
            >
              {dayData.date}
            </Link>
            : {dayData ? dayData.dayMetadata?.description || "-" : "loading..."}
          </p>
        )}
      </div>
    </>
  );
}
