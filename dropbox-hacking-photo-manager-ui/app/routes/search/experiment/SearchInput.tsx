import TextField from "@mui/material/TextField";
import {
  compileSearch,
  searchTerms,
} from "dropbox-hacking-photo-manager-shared";
import { type ChangeEventHandler, useEffect, useMemo, useState } from "react";

export type SearchInputResult = ReturnType<typeof compileSearch> & {
  readonly filterSource: string;
};

export const SearchInput = ({
  initalQuery,
  onChange,
}: {
  initalQuery: string;
  onChange: (r: SearchInputResult) => void;
}) => {
  const [filterSource, setFilterSource] = useState(initalQuery);
  const filter = useMemo(() => compileSearch(filterSource), [filterSource]);
  useEffect(
    () => onChange({ ...filter, filterSource }),
    [filter, filterSource],
  );

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
        <input type="checkbox" checked={showHelp} onChange={onShowHelpChange} />{" "}
        Show help
      </p>

      {showHelp && (
        <div>
          <p>The query is in Reverse Polish.</p>

          <ul>
            {searchTerms.map((thing, i) => (
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
    </>
  );
};
