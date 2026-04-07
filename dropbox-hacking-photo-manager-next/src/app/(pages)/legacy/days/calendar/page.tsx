"use client";

import Navigate from "@components/Navigation";
import SamePageLink from "@components/samePageLink";
import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import logRender from "@lib/logRender";
import { useEffect } from "react";

import ListOfYears from "./ListOfYears";
import MonthBox from "./MonthBox";
import styles from "./page.module.css";
import TwelveMonths from "./TwelveMonths";

type Year = {
  yearString: string;
  yearNumber: number;
  counts: Map<string, number>;
};

const Calendar = () => {
  const latestValue = useLatestValueFromServerFeed({
    type: "rx.ng.list-of-days",
    withSamples: false,
  });

  useEffect(() => {
    document.title = "DPM - Calendar";
  });

  const years = new Map<string, Year>();

  const getYear = (id: string): Year => {
    let y = years.get(id);
    if (y) return y;

    y = { yearString: id, yearNumber: parseInt(id), counts: new Map() };
    years.set(id, y);
    return y;
  };

  for (const entry of latestValue ?? []) {
    const year = getYear(entry.date.substring(0, 4));
    year.counts.set(entry.date, entry.counts.previewableCount);
  }

  // const monthNames = 'jan feb mar apr maj jun jul aug sep okt nov dec'.split(' ');
  const monthNames =
    "Januar Februar Marts April Maj Juni Juli August September Oktober November December".split(
      " ",
    );

  const sortedYears = [...years.values()].toSorted(
    (a, b) => a.yearNumber - b.yearNumber,
  );

  return (
    <div>
      <Navigate />

      <h1>Calendar</h1>

      {latestValue ? (
        <ListOfYears
          years={sortedYears.map((t) => ({ ...t, year: t.yearNumber }))}
          renderYear={(year) => (
            <div>
              <TwelveMonths
                renderMonth={(month) => (
                  <div style={{ display: "flex" }}>
                    <h3 style={{ width: "6em" }}>{monthNames[month]}</h3>
                    <MonthBox
                      year={year.yearNumber}
                      month={month}
                      renderDay={(day) => {
                        const dateString = `${year.yearString}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
                        const count = year.counts.get(dateString) ?? 0;
                        if (!count)
                          return <div className={styles.zeroDay}>&nbsp;</div>;

                        return (
                          <SamePageLink
                            className={styles.nonZeroDay}
                            style={{ display: "block" }}
                            routeState={{
                              route: "route/next-gen/day/files",
                              date: dateString,
                            }}
                          >
                            {count}
                          </SamePageLink>
                        );
                      }}
                    />
                  </div>
                )}
              />
            </div>
          )}
        />
      ) : (
        "loading..."
      )}
    </div>
  );
};

export default logRender(Calendar);
