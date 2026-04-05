"use client";

import EditableTextField from "@components/editableTextField";
import Navigate from "@components/Navigation";
import ShowData from "@components/ShowData";
import { useIdentity } from "@hooks/useIdentity";
import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import logRender from "@lib/logRender";
import React, { useEffect, useMemo, type Usable } from "react";

import ListOfFiles from "../../listOfFiles";
import PrevNextDayLinks from "../../PrevNextDayLinks";

const NGDayFiles = ({
  params: pathParams,
}: {
  params: Usable<{ readonly date: string }>;
}) => {
  const { date } = React.use(pathParams);
  console.log("NGDayFiles", useIdentity());

  const latestValue = useLatestValueFromServerFeed({
    type: "rx.ng.day.files",
    date,
  });

  const dayMetadata = latestValue?.dayMetadata;

  const onSaveDescription = useMemo(
    () => (newText: string) =>
      fetch(`http://localhost:4000/api/day/${date}`, {
        method: "PATCH",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: newText }),
      }).then(() => {}),
    [date],
  );

  useEffect(() => {
    document.title = `DPMNG - ${date}`;
  });

  return (
    <>
      <Navigate />

      <PrevNextDayLinks date={date} />

      <h1>
        <a
          href={`https://calendar.google.com/calendar/u/0/r/week/${date.substring(0, 4)}/${date.substring(5, 7)}/${date.substring(8, 10)}`}
        >
          {date}
        </a>
      </h1>

      {latestValue ?
        <>
          <p>
            <EditableTextField
              key={dayMetadata?.description ?? ""}
              value={dayMetadata?.description ?? ""}
              onSave={onSaveDescription}
            />
          </p>

          <ListOfFiles files={latestValue.files} date={date} />

          <ShowData data={latestValue} />
        </>
      : "loading..."}
    </>
  );
};

// export default logRender(NGDayFiles);
export default NGDayFiles;
