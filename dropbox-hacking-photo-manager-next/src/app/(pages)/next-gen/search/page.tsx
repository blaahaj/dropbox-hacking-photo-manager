"use client";

import Navigate from "@components/Navigation";
import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import logRender from "@lib/logRender";
import { parseFilterString } from "dropbox-hacking-photo-manager-shared/search";
import {
  type ChangeEventHandler,
  use,
  useEffect,
  useMemo,
  useState,
} from "react";

import ListOfFiles from "../day/listOfFiles";

const NGSearch = ({
  searchParams: searchParamsProxy,
}: {
  searchParams: Promise<{ q?: string }>;
}) => {
  const searchParams = use(searchParamsProxy);
  const [filterSource, setFilterSource] = useState(searchParams.q ?? "");

  const filter = useMemo(() => parseFilterString(filterSource), [filterSource]);

  const latestValue = useLatestValueFromServerFeed({
    type: "rx.ng.search",
    filter: filter ?? { type: "tag", tag: "" },
  });

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

      <h1>Search</h1>

      <input
        type="text"
        value={filterSource}
        placeholder="enter query"
        onChange={onFilterSourceChange}
        style={{ width: "50em", marginBlockEnd: "1em" }}
      />

      <p>
        <input type="checkbox" checked={showHelp} onChange={onShowHelpChange} />{" "}
        Show help
      </p>

      {showHelp && (
        <div>
          <p>The query is in Reverse Polish.</p>

          <ul>
            <li>image / video / audio</li>
            <li>gps</li>

            <li>tag=swan</li>
            <li>id=id:...</li>
            <li>rev=...</li>
            <li>tag~person:</li>
            <li>text~meet</li>
            <li>path~originals</li>

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

      {latestValue ? (
        <>
          {latestValue.truncated && (
            <p>
              Results are truncated: {latestValue.totalCount} matches in total
            </p>
          )}

          {filter && (
            <ListOfFiles
              files={latestValue.matches}
              // FIXME, this date
              date={"2000-01-01"}
            />
          )}
        </>
      ) : (
        "loading..."
      )}
    </>
  );
};

export default logRender(NGSearch);
