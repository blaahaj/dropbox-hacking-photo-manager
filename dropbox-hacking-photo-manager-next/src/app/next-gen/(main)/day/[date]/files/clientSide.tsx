"use client";

import ContentList from "@components/contentList";
import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import type { DayFilesResult } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";

const WithData = ({ value }: { value: DayFilesResult }) => {
  const { date, files, dayMetadata } = value;

  return (
    <div>
      <h1>{date}</h1>
      <p>(TODO make editable): {dayMetadata?.description}</p>
      <ContentList items={files} />
    </div>
  );
};

const ClientSide = ({ date }: { date: string }) => {
  const latestValue = useLatestValueFromServerFeed({
    type: "rx.ng.day.files",
    date,
  });

  if (latestValue) {
    return <WithData value={latestValue} />;
  }
};

export default ClientSide;
