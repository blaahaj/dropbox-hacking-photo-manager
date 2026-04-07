import logRender from "@lib/logRender";
import * as React from "react";

import styles from "./MonthBox.module.css";

const MonthBox = (props: {
  year: number;
  month: number;
  renderDay: (d: number) => React.ReactNode;
}) => {
  const { year, month, renderDay } = props;

  const fragments: React.ReactNode[] = [];

  let day = 1;
  let row = 0;

  while (true) {
    const date = new Date(Date.UTC(year, month, day));
    if (date.getMonth() !== month) break;

    const column = date.getDay();

    fragments.push(
      <li
        key={date.getTime()}
        // className={`${styles.dayInMonthBox} row${row + 1} col${column + 1}`}
        style={{ gridRow: row + 1, gridColumn: column + 1 }}
      >
        {renderDay(day)}
      </li>,
    );

    if (column === 6) ++row;
    ++day;
  }

  return <ol className={styles.monthBox}>{fragments}</ol>;
};

export default logRender(MonthBox);
