import SamePageLink from "@components/samePageLink";
import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import logRender from "@lib/logRender";
import React from "react";
import { useMemo } from "react";

const PrevNextDayLinks = ({ date }: { date: string }) => {
  const listOfDays = useLatestValueFromServerFeed({
    type: "rx.ng.list-of-days",
    withSamples: false,
  });

  const indexOfToday = useMemo(
    () => listOfDays?.findIndex((item) => item.date === date),
    [listOfDays, date],
  );
  const previousDay =
    listOfDays && indexOfToday !== undefined && indexOfToday > 0
      ? listOfDays[indexOfToday - 1]
      : undefined;
  const nextDay =
    listOfDays &&
    indexOfToday !== undefined &&
    indexOfToday < listOfDays.length - 1
      ? listOfDays[indexOfToday + 1]
      : undefined;

  return (
    <div>
      {previousDay && (
        <SamePageLink
          routeState={{
            route: "route/next-gen/day/files",
            date: previousDay.date,
          }}
        >
          &larr; {previousDay.date}
        </SamePageLink>
      )}

      {" ~ "}

      {nextDay && (
        <SamePageLink
          routeState={{
            route: "route/next-gen/day/files",
            date: nextDay.date,
          }}
        >
          {nextDay.date} &rarr;
        </SamePageLink>
      )}
    </div>
  );
};

export default logRender(PrevNextDayLinks);
