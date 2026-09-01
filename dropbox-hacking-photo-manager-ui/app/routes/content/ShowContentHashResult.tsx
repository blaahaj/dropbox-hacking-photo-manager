import GeoMap from "@components/map/GeoMap";
import ShowData from "@components/ShowData";
import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import { useLeaflet } from "@hooks/useLeaflet";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Stack from "@mui/material/Stack";
import type { ContentHashCollection } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";

import EditablePhotoEntry from "./EditablePhotoEntry";
import ImagePreview from "./imagePreview";
import ShowGPSDetails from "./ShowGPSDetails";
import SummariseExif from "./SummariseExif";
import SummariseFileState from "./SummariseFileState";
import SummariseMediaInfo from "./SummariseMediaInfo";
import SummariseNamedFiles from "./SummariseNamedFiles";

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
      <Stack
        direction={"row"}
        sx={{ columnGap: "3em" }}
      >
        <Stack direction={"column"} sx={{ rowGap: "0.5em" }}>
          {dayData ? (
            <SummariseFileState dayData={dayData} contentHash={contentHash} />
          ) : (
            "loading..."
          )}

          <ImagePreview
            namedFile={latestValue.namedFiles[0]}
            photo={latestValue.photo ?? {}}
          />

          <ShowData data={latestValue} />
        </Stack>

        <Stack direction={"column"}>
          <Stack
            sx={{ backgroundColor: "rgba(246,246,246,0.5)", padding: "1em" }}
          >
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                Description & Tags
              </AccordionSummary>
              <AccordionDetails>
                <EditablePhotoEntry
                  contentHash={contentHash}
                  photoDbEntry={latestValue.photo ?? {}}
                />
              </AccordionDetails>
            </Accordion>

            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <h3>GPS</h3>
              </AccordionSummary>
              <AccordionDetails>
                <ShowGPSDetails
                  contentHash={contentHash}
                  gps={latestValue.gps}
                  photo={latestValue.photo}
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
      </Stack>
    </>
  );
};
