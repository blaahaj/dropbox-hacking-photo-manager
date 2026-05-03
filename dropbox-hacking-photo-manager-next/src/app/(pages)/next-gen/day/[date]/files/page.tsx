"use client";

import EditableTextField from "@components/editableTextField";
import Navigate from "@components/Navigation";
import ShowData from "@components/ShowData";
import { useIdentity } from "@hooks/useIdentity";
import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import type { DayMetadata } from "dropbox-hacking-photo-manager-shared";
import type { ContentHashCollectionWithDay } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import React, { useEffect, useMemo } from "react";

import ListOfFiles from "./listOfFiles";
import PrevNextDayLinks from "./PrevNextDayLinks";

const NGDayFiles = ({
  params: pathParams,
}: {
  params: Promise<{ readonly date: string }>;
}) => {
  const { date } = React.use(pathParams);
  console.log("NGDayFiles", useIdentity());

  const latestValue = useLatestValueFromServerFeed({
    type: "rx.ng.day.files",
    date,
  });

  const defaultDayMetadata: DayMetadata = {
    date,
    description: "",
  };

  const files: readonly ContentHashCollectionWithDay[] | undefined =
    latestValue?.files.map((c) => ({
      ...c,
      day: latestValue.dayMetadata ?? defaultDayMetadata,
    }));

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

      <main style={{ margin: "2em" }}>
        <PrevNextDayLinks date={date} />

        <h1>
          <a
            href={`https://calendar.google.com/calendar/u/0/r/week/${date.substring(0, 4)}/${date.substring(5, 7)}/${date.substring(8, 10)}`}
          >
            {date}
          </a>
        </h1>

        {latestValue && files ? (
          <>
            <p>
              <EditableTextField
                key={dayMetadata?.description ?? ""}
                value={dayMetadata?.description ?? ""}
                onSave={onSaveDescription}
              />
            </p>

            <ListOfFiles files={files} date={date} />

            <ShowData data={latestValue} />
          </>
        ) : (
          "loading..."
        )}
      </main>
    </>
  );
};

// export default logRender(NGDayFiles);
export default NGDayFiles;
