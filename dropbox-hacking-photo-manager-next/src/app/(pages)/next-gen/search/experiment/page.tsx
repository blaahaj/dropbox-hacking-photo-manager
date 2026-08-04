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
  const [filterSource, setFilterSource] = useState(searchParams.q ?? "image");

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

  useEffect(() => {
    const boxDiv = document.createElement("canvas");
    // boxDiv.style.border = "3px solid red";
    boxDiv.style.position = "fixed";
    boxDiv.style.top = "0";
    boxDiv.style.bottom = "0";
    boxDiv.style.left = "0";
    boxDiv.style.right = "0";
    boxDiv.style.pointerEvents = "none";
    boxDiv.style.zIndex = "9999";
    document.body.appendChild(boxDiv);

    console.dir(boxDiv);

    const setSize = () => {
      boxDiv.width = window.innerWidth;
      boxDiv.height = window.innerHeight;
    };

    const r = new ResizeObserver(setSize);
    r.observe(document.body);

    const draw: FrameRequestCallback = () => {
      // console.log(t);

      const ctx = boxDiv.getContext("2d");
      if (ctx) {
        const w = boxDiv.width;
        const h = boxDiv.height;
        ctx.reset();

        // const a = (Math.PI * 2 * t) / 10000;
        // ctx.save();
        // ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
        // ctx.ellipse(w / 2, h / 2, w / 2, h / 2, a, a, a + Math.PI * 2, false);
        // ctx.closePath();
        // ctx.fill();
        // ctx.restore();

        ctx.save();
        ctx.strokeStyle = "rgba(0, 255, 0, 0.3)";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(w, h);
        ctx.moveTo(w, 0);
        ctx.lineTo(0, h);
        ctx.stroke();
        ctx.restore();
      }

      handle = requestAnimationFrame(draw);
    };

    let handle = requestAnimationFrame(draw);

    return () => {
      document.body.removeChild(boxDiv);
      r.unobserve(document.body);
      cancelAnimationFrame(handle);
    };
    //
  }, []);

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

        {filterSource.trim() !== "" && filter instanceof Error && (
          <p
            style={{
              background: "red",
              color: "white",
              padding: "0.3em",
              width: "auto",
            }}
          >
            Not a valid filter
            {filter instanceof Error && <>: {filter.message}</>}
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

        {!(filter instanceof Error) && (
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
