"use client";

import Navigate from "@components/Navigation";
import logRender from "@lib/logRender";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import TextField from "@mui/material/TextField";
import {
  v2CompileQueryFromThings,
  v2Things,
} from "dropbox-hacking-photo-manager-shared/search";
import { type ChangeEventHandler, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import FilterResults from "./FilterResults";
import { RESULTS_STYLES, type ResultsStyle } from "./renderers";

const NGSearch = () => {
  const [searchParams, _setSearchParams] = useSearchParams();
  const [filterSource, setFilterSource] = useState(
    searchParams.get("q") ?? "image",
  );

  const filter = useMemo(
    () => v2CompileQueryFromThings(filterSource),
    [filterSource],
  );

  const [resultsStyle, setResultsStyle] = useState<ResultsStyle>(
    RESULTS_STYLES[0],
  );

  useEffect(() => {
    document.title = "DPMNG - search";
  }, []);

  const onFilterSourceChange = useMemo<ChangeEventHandler<HTMLInputElement>>(
    () => (e) => setFilterSource(e.target.value),
    [],
  );

  const [showHelp, setShowHelp] = useState(false);
  const onShowHelpChange = useMemo<ChangeEventHandler<HTMLInputElement>>(
    () => (e) => setShowHelp(e.target.checked),
    [],
  );

  return (
    <>
      <Navigate />

      <main style={{ margin: "2em" }}>
        <h1>Experimental Search</h1>

        <TextField
          placeholder="enter query"
          autoFocus
          label="Search"
          variant="standard"
          value={filterSource}
          onChange={onFilterSourceChange}
          sx={{ width: "50em", marginBlockEnd: "1em" }}
        />

        <p>
          <input
            type="checkbox"
            checked={showHelp}
            onChange={onShowHelpChange}
          />{" "}
          Show help
        </p>

        {showHelp && (
          <div>
            <p>The query is in Reverse Polish.</p>

            <ul>
              {v2Things.map((thing, i) => (
                <li key={i}>{thing.examples.join(" ; ")}</li>
              ))}
            </ul>
          </div>
        )}

        {filterSource.trim() !== "" && filter.isError() && (
          <p
            style={{
              background: "red",
              color: "white",
              padding: "0.3em",
              width: "auto",
            }}
          >
            Not a valid filter
            {filter.isError() && <>: {filter.error.message}</>}
          </p>
        )}

        <ButtonGroup sx={{ marginBlock: "1em" }}>
          {RESULTS_STYLES.map((s) => (
            <Button
              key={s}
              variant={s === resultsStyle ? "contained" : "outlined"}
              onClick={() => setResultsStyle(s)}
            >
              {s}
            </Button>
          ))}
        </ButtonGroup>

        {filter.isOK() && (
          <FilterResults
            filterNode={filterSource}
            resultsStyle={resultsStyle}
          />
        )}
      </main>
    </>
  );
};

export default logRender(NGSearch);
