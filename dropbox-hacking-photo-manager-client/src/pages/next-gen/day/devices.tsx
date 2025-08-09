import Navigate from "@components/navigate";
import { useIdentity } from "@hooks/useIdentity";
import { useLatestValue } from "@hooks/useLatestValue";
import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import useVisibilityTracking from "@hooks/useVisibilityTracking";
import logRender from "@lib/logRender";
import type {
  ContentHashCollection,
  DayFilesResult,
} from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import React, {
  type CSSProperties,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { map, type Observable } from "rxjs";

import MaybeVisibleThumbnail from "./MaybeVisibleThumbnail";

const FileCell = ({
  file,
  style,
  observableVisibleItems,
  date,
}: {
  file: ContentHashCollection & { readonly adjustedTimestamp: number };
  style: CSSProperties;
  key: string;
  observableVisibleItems: Observable<ReadonlySet<string>>;
  date: string;
}) => {
  const visible =
    useLatestValue(
      observableVisibleItems.pipe(map((n) => n.has(file.contentHash))),
    ) ?? false;

  return (
    <div style={{ ...style }} data-vis-key={file.contentHash}>
      <time className="mtime">{file.timestamp.replace("T", " ")}</time>
      <time className="mtime">
        {new Date(file.adjustedTimestamp).toISOString().replace("T", " ")}
      </time>
      <div className="basename">
        {file.namedFiles[0].name
          .toLocaleLowerCase()
          .replaceAll(file.contentHash, "#")}
      </div>
      <div className="thumbnail">
        <MaybeVisibleThumbnail
          namedFile={file.namedFiles[0]}
          visible={visible}
          photo={file.photo ?? {}}
          routeState={useMemo(
            () => ({
              route: "route/next-gen/content-hash",
              contentHash: file.contentHash,
              context: {
                date,
                contentHash: file.contentHash,
              },
            }),
            [file.contentHash, date],
          )}
        />
      </div>
      <div className="description">{file.photo?.description ?? ""}</div>
      <div className="tags">
        {(file.photo?.tags ?? []).map((tag, index) => (
          <span key={index} className={`tag tag-${tag}`}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

const getDeviceKey = (file: ContentHashCollection): string => {
  const generalTrack = file.mediaInfo?.mediainfoData.media?.track.find(
    (track) => track["@type"] === "General",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) as any;

  const make =
    file.exif?.exifData.tags?.Make ??
    generalTrack?.Encoded_Hardware_CompanyName ??
    "";
  const model =
    file.exif?.exifData.tags?.Model ??
    generalTrack?.Encoded_Hardware_Name ??
    "";

  return `${make} ${model}`.trim();
};

const WithData = ({
  result,
  date,
}: {
  result: DayFilesResult;
  date: string;
}) => {
  const filesWithDeviceKey = useMemo(
    () =>
      result.files.map((file) => ({
        ...file,
        deviceKey: getDeviceKey(file),
      })),
    [result],
  );

  const sortedDeviceKeys = useMemo(
    () => [...new Set(filesWithDeviceKey.map((f) => f.deviceKey))].sort(),
    [filesWithDeviceKey],
  );

  const [offsets, setOffsets] = useState(() => new Map<string, number>());

  const filesWithOffsetsApplied = useMemo(
    () =>
      filesWithDeviceKey.map((file) => ({
        ...file,
        adjustedTimestamp:
          new Date(file.timestamp).getTime() +
          1000 * (offsets.get(file.deviceKey) ?? 0),
      })),
    [filesWithDeviceKey, offsets],
  );

  const sortedFiles = useMemo(
    () =>
      filesWithOffsetsApplied.toSorted(
        (a, b) => a.adjustedTimestamp - b.adjustedTimestamp,
      ),
    [filesWithOffsetsApplied],
  );

  const fileListId = useId();
  const parentRef = useRef<HTMLDivElement>(null);

  const observableVisibleItems = useVisibilityTracking({
    parentRef,
    listItemDataAttribute: "data-vis-key",
  });

  return (
    <div>
      <div style={{ display: "grid" }} id={fileListId} ref={parentRef}>
        {sortedDeviceKeys.map((key, index) => [
          <div key={key} style={{ gridRow: 1, gridColumn: 1 + index }}>
            {key}
          </div>,
          key === "" ? (
            false
          ) : (
            <div
              key={`${key}:offset`}
              style={{ gridRow: 2, gridColumn: 1 + index }}
            >
              <input
                type="number"
                value={offsets.get(key) ?? 0}
                onChange={(e) =>
                  setOffsets((prev) => {
                    const copy = new Map(prev);
                    copy.set(key, Number(e.target.value));
                    return copy;
                  })
                }
              />
              OFFSET
            </div>
          ),
        ])}
        {sortedFiles.map((file, seq) => (
          <FileCell
            style={{
              gridRow: 3 + seq,
              gridColumn: 1 + sortedDeviceKeys.indexOf(file.deviceKey),
            }}
            key={file.contentHash}
            file={file}
            observableVisibleItems={observableVisibleItems}
            date={date}
          />
        ))}
      </div>
    </div>
  );
};

const NGDayDevices = ({ date }: { date: string }) => {
  console.log("NGDayDevices", useIdentity());

  const latestValue = useLatestValueFromServerFeed({
    type: "rx.ng.day.files",
    date,
  });

  const dayMetadata = latestValue?.dayMetadata;

  useEffect(() => {
    document.title = `DPMNG - ${date}`;
  });

  return (
    <>
      <Navigate />

      <h1>{date}</h1>

      {latestValue ? (
        <>
          {dayMetadata?.description && <p>{dayMetadata?.description}</p>}

          <WithData result={latestValue} date={date} />
        </>
      ) : (
        "loading..."
      )}
    </>
  );
};

export default logRender(NGDayDevices);
