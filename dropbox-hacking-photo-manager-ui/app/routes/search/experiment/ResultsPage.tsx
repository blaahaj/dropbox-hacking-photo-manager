import { useLatestValueFromServerFeed } from "@hooks/useLatestValueFromServerFeed";
import type { ContentHashCollectionWithDay } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import { useEffect, useRef, useState } from "react";

import type { ResultsStyle } from "./renderers";
import { ResultsRenderer } from "./results-renderer";

/**
 * - load this page of search results from the server
 * - if we were asked to report our size, then do so
 *   - (this only happens for page 0)
 * - render the loaded results using ResultsRenderer
 */
function ResultsPage({
  filterNode,
  resultsStyle,
  pageFrom0,
  resultsPerPage,
  onSelected,
  reportTotalCount,
  reportItemsPerRow,
  reportWidthAndHeight,
  reportResults,
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
  reportResults?: (
    pageFrom0: number,
    results: readonly ContentHashCollectionWithDay[],
  ) => void;
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
    if (results && reportResults) reportResults(pageFrom0, results.matches);
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
    <ResultsRenderer
      ref={ref}
      results={results?.matches ?? []}
      onSelected={onSelected}
      resultsStyle={resultsStyle}
      selectedContentHashes={selectedContentHashes}
      focusedContentHash={focusedContentHash}
    />
  );
}

/**
 * For the first 100ms of this component's existence, it'll be empty.
 * This is to avoid loading too much as we just whizz past using the
 * scroll bar.
 */

function WithDelay(props: Parameters<typeof ResultsPage>[0]) {
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSettled(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return settled ? <ResultsPage {...props} /> : null;
}

export default WithDelay;
