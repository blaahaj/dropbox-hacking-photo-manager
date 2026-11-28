import MultiGPSEditor from "@components/ListOfContent/Tools/MultiGPSEditor";
import {
  type GPSInformation,
  GPSLatLong,
} from "dropbox-hacking-photo-manager-shared";
import type { ContentHashCollection } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";

import styles from "./ShowGPSDetails.module.css";

export default function ShowGPSDetails({
  contentHash,
  files,
  gps,
}: {
  contentHash: string;
  files: readonly ContentHashCollection[];
  gps: GPSInformation;
}) {
  return (
    <>
      <div className={styles.grid}>
        <div>Embedded:</div>
        <div>
          {gps.fromContent
            ? `${gps.fromContent.lat.toFixed(5)}N, ${gps.fromContent.long.toFixed(5)}E`
            : `(none)`}
        </div>
        <div>
          {gps.fromContent && (
            <a
              className={styles.geohackLink}
              href={GPSLatLong.fromGPSLatNLongE(gps.fromContent)?.geoHackUrl({
                title: contentHash,
              })}
            >
              geohack
            </a>
          )}
        </div>
        <div style={{ gridColumnStart: 1, gridColumnEnd: 3 }}>
          <MultiGPSEditor
            contentHashes={new Set([contentHash])}
            files={files}
          />
        </div>
        <div>
          {gps.fromOverride && (
            <a
              className={styles.geohackLink}
              href={GPSLatLong.fromGPSLatNLongE(gps.fromOverride)?.geoHackUrl({
                title: contentHash,
              })}
            >
              geohack
            </a>
          )}
        </div>
      </div>
    </>
  );
}
