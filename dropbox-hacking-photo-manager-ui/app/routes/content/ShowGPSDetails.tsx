import {
  type GPSInformation,
  GPSLatLong,
  type PhotoDbEntry,
} from "dropbox-hacking-photo-manager-shared";

import EditableGPS from "./EditableGPS";
import styles from "./ShowGPSDetails.module.css";

export default function ShowGPSDetails({
  contentHash,
  gps,
  photo,
}: {
  contentHash: string;
  gps: GPSInformation;
  photo: PhotoDbEntry | null;
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
        <div>Override:</div>
        <div>
          <EditableGPS contentHash={contentHash} photoDbEntry={photo ?? {}} />
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
