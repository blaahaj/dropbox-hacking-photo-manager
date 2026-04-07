import logRender from "@lib/logRender";
import { type ReactNode } from "react";

import styles from "./SummaryTable.module.css";

type SummaryRow = {
  readonly key: ReactNode;
  readonly value: ReactNode;
};

type SummarySection = {
  readonly name: ReactNode;
  readonly rows: readonly SummaryRow[];
};

type SummaryTable = {
  readonly sections: readonly SummarySection[];
};

const SummaryRow = ({
  summaryRow,
  row,
}: {
  summaryRow: SummaryRow;
  row: number;
}) => {
  return (
    <>
      <div
        className="k2"
        style={{
          gridRow: row,
          gridColumn: 2,
        }}
      >
        {summaryRow.key}
      </div>
      <div
        className="v"
        style={{
          gridRow: row,
          gridColumn: 3,
        }}
      >
        {summaryRow.value}
      </div>
    </>
  );
};

const SummarySection = ({
  section,
  rows,
}: {
  section: SummarySection;
  rows: number;
}) => {
  return (
    <>
      <div
        className="k1"
        style={{
          gridRowStart: rows + 1,
          gridRowEnd: rows + 1 + section.rows.length,
        }}
      >
        {section.name}
      </div>

      {section.rows.map((summaryRow, index) => (
        <SummaryRow
          key={index}
          summaryRow={summaryRow}
          row={rows + index + 1}
        />
      ))}
    </>
  );
};

const SummaryTable = ({ table: summaryTable }: { table: SummaryTable }) => {
  // if (summaryTable.sections.flatMap((s) => s.rows).length === 0) return;

  return (
    <div id={styles.tableId}>
      {summaryTable.sections.map((s, i) => (
        <SummarySection
          key={i}
          section={s}
          rows={summaryTable.sections.slice(0, i).flatMap((t) => t.rows).length}
        />
      ))}
    </div>
  );
};

export default logRender(SummaryTable);
