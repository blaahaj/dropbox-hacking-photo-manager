import TagList from "@components/tags/TagList";
import logRender from "@lib/logRender";
import type { DayMetadata } from "dropbox-hacking-photo-manager-shared";
import type { DayFilesResult } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import { useEffect, useMemo, useState } from "react";
import { Observable } from "rxjs";

import styles from "./index.module.css";
import MaybeVisibleThumbnail from "./MaybeVisibleThumbnail";

const FileRow = ({
  file,
  focused,
  observableVisibleItems,
  selected,
  onSelected,
  date,
  day,
}: {
  file: DayFilesResult["files"][number];
  focused: boolean;
  observableVisibleItems?: Observable<ReadonlySet<string>>;
  selected: boolean;
  onSelected: (selected: boolean) => void;
  date: string;
  day?: DayMetadata | null;
}) => {
  const [visible, setVisible] = useState(!observableVisibleItems);

  const gps = file.gps;

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
  const deviceIcon = /EX-Z3|FinePix HS10 HS11|Canon PowerShot SX70 HS/.test(
    model,
  )
    ? "/camera-icon.dark.svg"
    : /iPhone 4S|Pixel|Pixel 2|iPhone 12 mini/.test(model)
      ? "/mobile-phone.svg"
      : file.namedFiles[0].name.toLocaleLowerCase().startsWith("dji")
        ? "/drone.svg"
        : null;
  const isVideo =
    file.mediaInfo &&
    file.mediaInfo.mediainfoData.media?.track.some(
      (t) => t.StreamKind === "Video",
    );
  const isRaw = file.namedFiles[0].path_lower.endsWith(".cr3");

  useEffect(() => {
    if (observableVisibleItems) {
      const sub = observableVisibleItems.subscribe((s) =>
        setVisible(s.has(file.contentHash)),
      );
      return () => sub.unsubscribe();
    }
  }, [observableVisibleItems, file]);

  const classNames = [
    styles.tile,
    selected ? styles.selected : null,
    focused ? styles.focused : null,
    isVideo ? styles.video : null,
    isRaw ? styles.raw : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classNames || undefined}>
      <input
        style={{ margin: "0.5em" }}
        type="checkbox"
        checked={selected}
        onChange={useMemo(
          () => (e) => onSelected(e.target.checked),
          [onSelected],
        )}
      />
      <div className={styles.icons}>
        {gps.effective && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/gps-pin.dark.svg"
            style={{ width: "1em", height: "2em" }}
            alt="has GPS"
          />
        )}

        {deviceIcon && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={deviceIcon}
            style={{ width: "2em", height: "2em" }}
            alt={deviceIcon}
          />
        )}

        {isVideo && <span style={{ fontSize: "2em" }}>🎞️</span>}

        {isRaw && (
          <>
            <span style={{ fontSize: "2em" }} title="raw">
              𝓡
            </span>
          </>
        )}

        {file.exif && <span>exif</span>}
        {file.mediaInfo && <span>mediainfo</span>}
      </div>
      <time className={styles.mtime}>{file.timestamp.replace("T", " ")}</time>
      <div className={styles.makeAndModel}>
        {make || "[none]"}{" "}
        {(model.startsWith(make)
          ? model.replace(make, "").trimStart()
          : model) || "[none]"}
      </div>
      <div className={styles.basename}>
        {file.namedFiles[0].name
          .toLocaleLowerCase()
          .replaceAll(file.contentHash, "#")}
      </div>
      <div className={styles.thumbnail}>
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
      {day?.description && (
        <div className={styles.dayDescription}>{day?.description ?? ""}</div>
      )}
      <div className={styles.description}>{file.photo?.description ?? ""}</div>
      <div className={styles.tags}>
        <TagList
          data={(file.photo?.tags ?? []).map((tag) => ({ tag }))}
          style={{ justifyContent: "center" }}
        />
      </div>
    </div>
  );
};

export default logRender(FileRow);
