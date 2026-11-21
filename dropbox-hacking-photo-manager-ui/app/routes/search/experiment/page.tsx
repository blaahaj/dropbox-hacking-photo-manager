import Navigate from "@components/Navigation";
import logRender from "@lib/logRender";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { compileSearch } from "dropbox-hacking-photo-manager-shared/search";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import { RESULTS_STYLES, type ResultsStyle } from "./renderers";
import { SearchInput } from "./SearchInput";
import ShowFilterResults from "./ShowFilterResults";

const NGSearch = () => {
  const [searchParams, _setSearchParams] = useSearchParams();
  const [q] = useState(() => searchParams.get("q") ?? "image");

  const [filter, setFilter] = useState<
    | (ReturnType<typeof compileSearch> & { readonly filterSource: string })
    | null
  >(null);

  const [resultsStyle, setResultsStyle] = useState<ResultsStyle>(
    RESULTS_STYLES.at(-1)!,
  );

  useEffect(() => {
    document.title = "DPMNG - search";
  }, []);

  return (
    <>
      <Navigate />

      <main style={{ margin: "2em" }}>
        <h1>Experimental Search</h1>

        <SearchInput initalQuery={q} onChange={setFilter} />

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

        {filter?.isOK() && (
          <ShowFilterResults
            filterNode={filter.filterSource}
            resultsStyle={resultsStyle}
          />
        )}
      </main>
    </>
  );
};

export default logRender(NGSearch);
