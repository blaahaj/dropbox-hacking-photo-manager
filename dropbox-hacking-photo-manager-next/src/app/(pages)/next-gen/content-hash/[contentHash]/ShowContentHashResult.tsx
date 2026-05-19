"use client";

import GeoMap from "@components/map/GeoMap";
import SamePageLink from "@components/samePageLink";
import ShowData from "@components/ShowData";
import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Stack from "@mui/material/Stack";
import {
  GPSLatLong,
  type GPSLatNLongE,
} from "dropbox-hacking-photo-manager-shared";
import type { ContentHashCollection } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";

import { useLeaflet } from "@/app/useLeaflet";

import EditableGPS from "./EditableGPS";
import EditablePhotoEntry from "./EditablePhotoEntry";
import ImagePreview from "./imagePreview";
import styles from "./ShowContentHashResult.module.css";
import SummariseExif from "./SummariseExif";
import SummariseMediaInfo from "./SummariseMediaInfo";
import SummariseNamedFiles from "./SummariseNamedFiles";

const gpsOrNone = (title: string, pos: GPSLatNLongE | null) => {
  if (pos === null) return "-";

  const t = GPSLatLong.fromGPSLatNLongE(pos);
  return (
    <a className={styles.geohackLink} href={t.geoHackUrl({ title })}>
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

  const dayData = useLatestValueFromServerFeed({
    type: "rx.ng.day.files",
    date: latestValue.date,
  });

  return (
    <>
      <Stack direction={"row"} sx={{ columnGap: "3em" }}>
        <Stack direction={"column"} sx={{ rowGap: "3em" }}>
          <ImagePreview
            namedFile={latestValue.namedFiles[0]}
            photo={latestValue.photo ?? {}}
          />

          {latestValue.gps.effective && L && (
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
          )}

          <ShowData data={latestValue} />
        </Stack>

        <Stack direction={"column"}>
          {dayData ? (
            <div style={{ marginBlock: "1em" }}>
              {dayData.files.length === 1 ? (
                <p>
                  The only file from{" "}
                  <SamePageLink
                    className={styles.dayLink}
                    routeState={{
                      route: "route/next-gen/day/files",
                      date: latestValue.date,
                    }}
                  >
                    {latestValue.date}
                  </SamePageLink>
                </p>
              ) : (
                <p>
                  {1 +
                    (dayData.files
                      .toSorted((a, b) =>
                        a.timestamp.localeCompare(b.timestamp),
                      )
                      .findIndex(
                        (c) => c.contentHash === latestValue.contentHash,
                      ) ?? "-2")}
                  /{dayData.files.length} from{" "}
                  <SamePageLink
                    className={styles.dayLink}
                    routeState={{
                      route: "route/next-gen/day/files",
                      date: latestValue.date,
                    }}
                  >
                    {latestValue.date}
                  </SamePageLink>
                  :{" "}
                  {dayData
                    ? dayData.dayMetadata?.description || "-"
                    : "loading..."}
                </p>
              )}
            </div>
          ) : (
            "loading..."
          )}

          {/* TODO, indicate >1 day */}
          {/* TODO, make editable */}

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <h3>Description & Tags</h3>
            </AccordionSummary>
            <AccordionDetails>
              <EditablePhotoEntry
                contentHash={contentHash}
                photoDbEntry={latestValue.photo ?? {}}
              />
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <h3>GPS</h3>
            </AccordionSummary>
            <AccordionDetails>
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

              <EditableGPS
                contentHash={contentHash}
                photoDbEntry={latestValue.photo ?? {}}
              />
            </AccordionDetails>
          </Accordion>

          {latestValue.exif && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <h3>Exif</h3>
              </AccordionSummary>
              <AccordionDetails>
                <SummariseExif exif={latestValue.exif} />
              </AccordionDetails>
            </Accordion>
          )}

          {latestValue.mediaInfo && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <h3>MediaInfo</h3>
              </AccordionSummary>
              <AccordionDetails>
                <SummariseMediaInfo mediaInfo={latestValue.mediaInfo} />
              </AccordionDetails>
            </Accordion>
          )}

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <h3>Files</h3>
            </AccordionSummary>
            <AccordionDetails>
              <SummariseNamedFiles namedFiles={latestValue.namedFiles} />
            </AccordionDetails>
          </Accordion>
        </Stack>
      </Stack>
    </>
  );
};
