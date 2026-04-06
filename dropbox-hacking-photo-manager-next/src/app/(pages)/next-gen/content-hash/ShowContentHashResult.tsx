"use client";

import GeoMap from "@components/map/GeoMap";
import ShowData from "@components/ShowData";
import {
  GPSLatLong,
  type GPSLatNLongE,
} from "dropbox-hacking-photo-manager-shared";
import type { ContentHashCollection } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
// import * as L from "leaflet";

import EditableGPS from "./EditableGPS";
import EditablePhotoEntry from "./EditablePhotoEntry";
import ImagePreview from "./imagePreview";
import SummariseExif from "./SummariseExif";
import SummariseMediaInfo from "./SummariseMediaInfo";
import SummariseNamedFiles from "./SummariseNamedFiles";
import { useLeaflet } from "@/app/useLeaflet";

const gpsOrNone = (title: string, pos: GPSLatNLongE | null) => {
  if (pos === null) return "-";

  const t = GPSLatLong.fromGPSLatNLongE(pos);
  return (
    <a href={t.geoHackUrl({ title })}>
      {pos.lat},{pos.long}
    </a>
  );
};

export const ShowContentHashResult = ({
  contentHash,
  latestValue,
}: {
  contentHash: string;
  latestValue: ContentHashCollection;
}) => {
  const L = useLeaflet();

  return (
    <>
      <ShowData data={latestValue} />

      <div style={{ display: "flex", flexDirection: "row" }}>
        <ImagePreview
          namedFile={latestValue.namedFiles[0]}
          photo={latestValue.photo ?? {}}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          {latestValue.exif && <SummariseExif exif={latestValue.exif} />}
          {latestValue.mediaInfo && (
            <SummariseMediaInfo mediaInfo={latestValue.mediaInfo} />
          )}

          <div style={{ marginBlock: "1em" }}>
            <EditablePhotoEntry
              contentHash={contentHash}
              photoDbEntry={latestValue.photo ?? {}}
            />
            <EditableGPS
              contentHash={contentHash}
              photoDbEntry={latestValue.photo ?? {}}
            />
          </div>

          <p>Rotation: {latestValue.photo?.rotate ?? 0}°</p>

          <div>
            <h2>GPS</h2>
            <ol>
              <li>
                Embedded:{" "}
                {gpsOrNone(
                  `${contentHash} from content`,
                  latestValue.gps.fromContent,
                )}
              </li>
              <li>
                Override:{" "}
                {gpsOrNone(
                  `${contentHash} from override`,
                  latestValue.gps.fromOverride,
                )}{" "}
                <button>edit</button>
              </li>
            </ol>
          </div>

          {latestValue.gps.effective && L && (
            <div style={{ marginBlock: "1em" }}>
              <GeoMap
                positions={
                  new Map([
                    [
                      contentHash,
                      {
                        position: new L.LatLng(
                          latestValue.gps.effective.lat,
                          latestValue.gps.effective.long,
                        ),
                        highlighted: false,
                      },
                    ],
                  ])
                }
              />
            </div>
          )}

          <SummariseNamedFiles namedFiles={latestValue.namedFiles} />
        </div>
      </div>
    </>
  );
};
