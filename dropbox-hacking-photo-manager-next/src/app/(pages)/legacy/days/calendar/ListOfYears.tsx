import type { ReactNode } from "react";

import styles from "./ListOfYears.module.css";

const ListOfYears = <T extends { readonly year: number }>({
  years,
  renderYear,
}: {
  years: readonly T[];
  renderYear: (year: T) => ReactNode;
}) => {
  return (
    <ol className={styles.ListOfYears}>
      {years.map((year) => (
        <li key={year.year}>
          <h2>{year.year}</h2>
          <div>{renderYear(year)}</div>
        </li>
      ))}
    </ol>
  );
};

export default ListOfYears;
