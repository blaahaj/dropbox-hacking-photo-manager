import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import type { ContentHashCollectionWithDay } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import { useEffect, useRef, useState } from "react";

import type { ResultsStyle } from "./page";
import { Results } from "./result";

function VisibleResultsPage({
  filterNode,
  resultsStyle,
  pageFrom0,
  resultsPerPage,
  onSelected,
  reportTotalCount,
  reportItemsPerRow,
  reportWidthAndHeight,
  selectedContentHashes,
  focusedContentHash,
}: {
  filterNode: string;
  resultsStyle: ResultsStyle;
  pageFrom0: number;
  resultsPerPage: number;
  onSelected: (c: ContentHashCollectionWithDay, selected: boolean) => void;
  reportWidthAndHeight?: (widthAndHeight: [number, number]) => void;
  reportTotalCount?: (totalCount: number) => void;
  reportItemsPerRow?: (itemsPerRow: number) => void;
  selectedContentHashes: ReadonlySet<string>;
  focusedContentHash: string | undefined;
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
            n.nodeType === Node.ELEMENT_NODE &&
            n.nodeName === "DIV" &&
            n.hasAttribute("data-content-hash"),
        );

        const itemsPerRow = c.findIndex((e) => e.offsetTop > c[0].offsetTop);
        if (itemsPerRow > 0) reportItemsPerRow(itemsPerRow);
      });

      l.observe(div);
      return () => l.disconnect();
    }
  }, [results, reportWidthAndHeight, reportItemsPerRow]);

  console.debug(
    `VisibleResultsPage pageFrom0=${pageFrom0} rpp=${resultsPerPage} r.l=${results?.matches.length ?? "-"}`,
  );

  return (
    <Results
      ref={ref}
      results={results?.matches ?? []}
      onSelected={onSelected}
      resultsStyle={resultsStyle}
      selectedContentHashes={selectedContentHashes}
      focusedContentHash={focusedContentHash}
    />
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
