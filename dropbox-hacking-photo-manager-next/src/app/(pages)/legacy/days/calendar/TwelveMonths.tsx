import logRender from "@lib/logRender";
import * as React from "react";

import styles from "./TwelveMonths.module.css";

const TwelveMonths = (props: {
  renderMonth: (m: number) => React.ReactNode;
}) => (
  <ol className={styles.TwelveMonths}>
    {[...Array(12).keys()].map((month) => (
      <li key={month}>{props.renderMonth(month)}</li>
    ))}
  </ol>

  // <div className="twelveMonths">
  //   {[...Array(12).keys()].map((month) => (
  //     <div className="oneOfTwelveMonths" key={month}>
  //       {props.renderMonth(props.year, month)}
  //     </div>
  //   ))}
  // </div>
);

export default logRender(TwelveMonths);
