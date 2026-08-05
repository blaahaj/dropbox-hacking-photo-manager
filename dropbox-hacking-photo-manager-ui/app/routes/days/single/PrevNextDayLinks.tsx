import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import logRender from "@lib/logRender";
import { useMemo } from "react";
import { Link } from "react-router";

import styles from "./PrevNextDayLinks.module.css";

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
        <Link
          className={styles.dayLink}
          to={`/days/${encodeURIComponent(previousDay.date)}`}
        >
          &larr; {previousDay.date}
        </Link>
      )}

      {previousDay && nextDay && " ~ "}

      {nextDay && (
        <Link
          className={styles.dayLink}
          to={`/days/${encodeURIComponent(nextDay.date)}`}
        >
          {nextDay.date} &rarr;
        </Link>
      )}
    </div>
  );
};

export default logRender(PrevNextDayLinks);
