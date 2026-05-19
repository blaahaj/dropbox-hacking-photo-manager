"use client";

import Navigate from "@components/Navigation";
import ShowData from "@components/ShowData";
import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import logRender from "@lib/logRender";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import type { ExifExplorerType } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import { use, useEffect } from "react";

type Counts = ExifExplorerType["tagCounts"][number][1];
type Entry = readonly [string, Counts];
type EntrySorter = (a: Entry, b: Entry) => number;

const MediaInfoExplorer = ({
  params: pathParams,
}: {
  params: Promise<{ readonly streamKind?: string }>;
}) => {
  const { streamKind: rawStreamKind } = use(pathParams);
  const effectiveStreamKind =
    rawStreamKind === "null" ? null : (rawStreamKind ?? null);

  const latestValue = useLatestValueFromServerFeed({
    type: "rx.ng.mediainfo-explorer",
    streamKind: effectiveStreamKind,
  });

  useEffect(() => {
    document.title = "DPMNG - MediaInfo Explorer";
  }, []);

  const byName: EntrySorter = (a, b) => a[0].localeCompare(b[0]);
  // const byPresent: EntrySorter = (a, b) =>
  //   b[1].present - a[1].present || byName(a, b);
  const byNonBlank: EntrySorter = (a, b) =>
    b[1].nonBlank - a[1].nonBlank || byName(a, b);

  const sortedTagCounts =
    latestValue && latestValue.tagCounts?.toSorted(byNonBlank);

  // function handleStreamKind(
  //   event: MouseEvent<HTMLElement, MouseEvent>,
  //   value: any,
  // ): void {
  //   throw new Error("Function not implemented.");
  // }

  // FIXME: what stream kinds are there? Would be nice to provide a list.
  // const uniqueStreamKinds = latestValue ? latestValue.

  return (
    <>
      <Navigate />

      <main style={{ margin: "2em" }}>
        <h1>MediaInfo Explorer</h1>

        {/*
        <div>
          StreamKind:
          <ul
            style={{
              display: "inline-flex",
              flexDirection: "row",
              marginBlock: "0.7em",
            }}
          >
            {[null, "General", "Video", "Menu", "Image", "Audio", "Other"].map(
              (kind) => (
                <li
                  key={kind ?? "null"}
                  style={{
                    listStyle: "none",
                    marginInlineEnd: "1em",
                    fontWeight:
                      kind === effectiveStreamKind ? "bold" : "normal",
                  }}
                >
                  <a href={`./${kind ?? "null"}`}>{kind ?? "all"}</a>
                </li>
              ),
            )}
          </ul>
        </div> */}

        <Box>
          <ToggleButtonGroup
            size="small"
            aria-label="Basic button group"
            value={effectiveStreamKind ?? "null"}
          >
            {[null, "General", "Video", "Menu", "Image", "Audio", "Other"].map(
              (kind) => (
                <ToggleButton
                  href={`./${kind ?? "null"}`}
                  value={kind ?? "null"}
                  key={kind ?? "null"}
                >
                  {kind ?? "all"}
                </ToggleButton>
              ),
            )}
          </ToggleButtonGroup>

          {sortedTagCounts ? (
            <div>
              <TableContainer sx={{ overflow: "initial" }}>
                <Table aria-label="simple table">
                  <TableHead
                    sx={{
                      position: "sticky",
                      top: 0,
                      background: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    <TableRow>
                      <TableCell>Tag</TableCell>
                      <TableCell align="right">Present</TableCell>
                      <TableCell align="right">Non-blank</TableCell>
                      <TableCell align="right">Present as % of all</TableCell>
                      <TableCell align="right">Non-blank as % of all</TableCell>
                      <TableCell align="right">
                        Non-blank as % of present
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedTagCounts.map(([tag, counts]) => (
                      <TableRow
                        key={tag}
                        // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {tag}
                        </TableCell>
                        <TableCell align="right">{counts.present}</TableCell>
                        <TableCell align="right">{counts.nonBlank}</TableCell>
                        <TableCell align="right">
                          {(
                            (100 * counts.present) /
                            latestValue.entries
                          ).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          {counts.nonBlankPercentOfAll.toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          {counts.nonBlankPercentOfPresent.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <ShowData data={latestValue} />
            </div>
          ) : (
            <div>loading...</div>
          )}
        </Box>
      </main>
    </>
  );
};

export default logRender(MediaInfoExplorer);
