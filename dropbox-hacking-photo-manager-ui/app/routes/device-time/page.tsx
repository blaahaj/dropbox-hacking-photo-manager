import Navigate from "@components/Navigation";
import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import { useSearchParams } from "react-router";

import Results from "./results";

const DeviceTime = () => {
  const [searchParams, _setSearchParams] = useSearchParams();
  const startTime = searchParams.get("start");
  const endTime = searchParams.get("end");

  const query = `date>${startTime} date<${endTime} &`;

  const results = useLatestValueFromServerFeed({
    type: "rx.ng.search",
    filter: query,
  });

  return (
    <>
      <Navigate />

      <main style={{ margin: "2em" }}>
        <h1>Device Time</h1>

        {results && (
          <div>
            <Results results={results.matches} />
          </div>
        )}
      </main>
    </>
  );
};

// export default logRender(NGDayFiles);
export default DeviceTime;
