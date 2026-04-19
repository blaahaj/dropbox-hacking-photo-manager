"use client";

import Navigate from "@components/Navigation";
import ShowData from "@components/ShowData";
import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import type { ExifExplorerType } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import React, { useEffect } from "react";

// import styles from "./page.module.css";

type Counts = ExifExplorerType["tagCounts"][number][1];
type Entry = readonly [string, Counts];
type EntrySorter = (a: Entry, b: Entry) => number;

const ExifExplorer = () => {
  const latestValue = useLatestValueFromServerFeed({
    type: "rx.ng.exif-explorer",
  });

  useEffect(() => {
    document.title = "DPMNG - EXIF Explorer";
  }, []);

  const byName: EntrySorter = (a, b) => a[0].localeCompare(b[0]);
  // const byPresent: EntrySorter = (a, b) =>
  //   b[1].present - a[1].present || byName(a, b);
  const byNonBlank: EntrySorter = (a, b) =>
    b[1].nonBlank - a[1].nonBlank || byName(a, b);

  const sortedTagCounts =
    latestValue && latestValue.tagCounts?.toSorted(byNonBlank);

  return (
    <>
      <Navigate />

      <main style={{ margin: "2em" }}>
        <h1>EXIF Explorer</h1>

        {sortedTagCounts ? (
          <div>
            <TableContainer style={{ width: "50em", margin: "auto" }}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Tag</TableCell>
                    <TableCell align="right">Present</TableCell>
                    <TableCell align="right">Non-blank</TableCell>
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

            <br />
            <br />

            <ShowData data={latestValue} />
          </div>
        ) : (
          "loading..."
        )}
      </main>
    </>
  );
};

export default ExifExplorer;
