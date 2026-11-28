import type { FsckType } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";

export const ExifOrMediaInfo = ({
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
      <p
        style={{
          fontSize: "8pt",
          contain: "size",
          containIntrinsicWidth: "20vw",
          containIntrinsicHeight: "5em",
        }}
      >
        Eligible files are: {fileExtensions.join(", ")}
      </p>
    </div>
  );
};
