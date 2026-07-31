"use client";

import Navigate from "@components/Navigation";
import logRender from "@lib/logRender";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import TextField from "@mui/material/TextField";
import { parseFilterString } from "dropbox-hacking-photo-manager-shared/search";
import {
  type ChangeEventHandler,
  use,
  useEffect,
  useMemo,
  useState,
} from "react";

import FilterResults from "./FilterResults";

export const RESULTS_STYLES = ["classic", "compact", "minimal"] as const;
export type ResultsStyle = (typeof RESULTS_STYLES)[number];

const NGSearch = ({
  searchParams: searchParamsProxy,
}: {
  searchParams: Promise<{ q?: string }>;
}) => {
  const searchParams = use(searchParamsProxy);
  const [filterSource, setFilterSource] = useState(searchParams.q ?? "");

  const filter = useMemo(() => parseFilterString(filterSource), [filterSource]);

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
              <li>image / video / audio</li>
              <li>has-gps</li>

              <li>tag=swan</li>
              <li>id=id:...</li>
              <li>rev=...</li>
              <li>tag~person:</li>
              <li>text~meet</li>
              <li>day-text~meet</li>
              <li>photo-text~meet</li>
              <li>path~originals</li>
              <li>device~...</li>
              <li>device=...</li>

              <li>tags&gt;0 / tags&lt;2</li>
              <li>date&gt;2015 / date&lt;2019</li>
              <li>duration&gt;300 / duration&lt;10</li>

              <li>&, |, !</li>
            </ul>
          </div>
        )}

        {filterSource.trim() !== "" && !filter && (
          <p
            style={{
              background: "red",
              color: "white",
              padding: "0.3em",
              width: "auto",
            }}
          >
            Not a valid filter
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

        {filter && (
          <FilterResults filterNode={filter} resultsStyle={resultsStyle} />
        )}
      </main>
    </>
  );
};

export default logRender(NGSearch);
