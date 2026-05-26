import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import type { FilterNode } from "dropbox-hacking-photo-manager-shared";
import { useEffect, useRef, useState } from "react";

import ClassicResult from "./ClassicResult";
import CompactResult from "./CompactResult";
import MinimalResult from "./MinimalResult";
import type { ResultsStyle } from "./page";
import styles from "./VisibleResultsPage.module.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resultsComponents: Record<ResultsStyle, any> = {
  classic: ClassicResult,
  compact: CompactResult,
  minimal: MinimalResult,
} as const;

function VisibleResultsPage({
  filterNode,
  resultsStyle,
  pageFrom0,
  resultsPerPage,
  reportTotalCount,
  reportItemsPerRow,
  reportWidthAndHeight,
}: {
  filterNode: FilterNode;
  resultsStyle: ResultsStyle;
  pageFrom0: number;
  resultsPerPage: number;
  reportWidthAndHeight?: (widthAndHeight: [number, number]) => void;
  reportTotalCount?: (totalCount: number) => void;
  reportItemsPerRow?: (itemsPerRow: number) => void;
}) {
  const results = useLatestValueFromServerFeed({
    type: "rx.ng.search",
    filter: filterNode,
    pageFrom0,
    resultsPerPage,
  });

  useEffect(() => {
    if (results && reportTotalCount) reportTotalCount(results.totalCount);
  }, [reportTotalCount, results]);

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const div = ref.current;

    if (results && div && reportWidthAndHeight && reportItemsPerRow) {
      const l = new ResizeObserver((entries) => {
        const sz = entries.at(0)?.contentBoxSize.at(0);
        if (sz) reportWidthAndHeight([sz.inlineSize, sz.blockSize]);

        const c = [...div.children].filter(
          (n): n is HTMLDivElement =>
            n.nodeType === Node.ELEMENT_NODE && n.nodeName === "DIV",
        );
        const itemsPerRow = c.findIndex((e) => e.offsetTop > c[0].offsetTop);
        if (itemsPerRow > 0) {
          // console.log(`reportItemsPerRow:${itemsPerRow}`);
          if (reportItemsPerRow) reportItemsPerRow(itemsPerRow);
        }
      });

      l.observe(div);
      return () => l.disconnect();
    }
  }, [results, reportWidthAndHeight, reportItemsPerRow]);

  const Result = resultsComponents[resultsStyle];

  return (
    <div ref={ref} className={`${styles.page} ${styles[resultsStyle]}`}>
      {results?.matches.map((result, k) => (
        <div
          key={k}
          data-index={k}
          className={`${styles.result} ${styles[resultsStyle]}`}
        >
          <Result c={result} />
        </div>
      ))}
    </div>
  );
}

function WithDelay(props: Parameters<typeof VisibleResultsPage>[0]) {
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSettled(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return settled ? <VisibleResultsPage {...props} /> : null;
}

export default WithDelay;
