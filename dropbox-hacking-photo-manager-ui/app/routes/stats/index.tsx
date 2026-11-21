import Navigation from "@components/Navigation";
import logRender from "@lib/logRender";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useEffect, useState } from "react";

import { DevicesOverTime } from "./DevicesOverTime";
import { FilesOverTime } from "./FilesOverTime";
import { StatsBoxes } from "./StatsBoxes";

export function meta(/*{}: Route.MetaArgs*/) {
  return [
    { title: "DPM Stats" },
    {
      name: "description",
      content: "Yet another implementation of the DPM UI",
    },
  ];
}

const Check = () => {
  useEffect(() => {
    document.title = "DPMNG - Stats";
  }, []);

  const [tabValue, setTabValue] = useState<
    "stats" | "files/time" | "devices/time"
  >("stats");

  return (
    <>
      <Navigation />

      <main style={{ margin: "2em" }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab value={"stats"} label="Stats" />
          <Tab value={"files/time"} label="Files/time" />
          <Tab value={"devices/time"} label="Devices/time" />
        </Tabs>

        <br />

        {tabValue === "stats" && <StatsBoxes />}
        {tabValue === "files/time" && <FilesOverTime />}
        {tabValue === "devices/time" && <DevicesOverTime />}
      </main>
    </>
  );
};

export default logRender(Check);
