"use client";

import type { FilterNode } from "dropbox-hacking-photo-manager-shared";
import { useEffect, useRef, useState } from "react";

import type { ResultsStyle } from "./page";
import VisibleResultsPage from "./VisibleResultsPage";

export default function FilterResults({
  filterNode,
  resultsStyle,
}: {
  filterNode: FilterNode;
  resultsStyle: ResultsStyle;
}) {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [itemsPerRow, setItemsPerRow] = useState<number>(5);
  const resultsPerPage = Math.ceil(100 / itemsPerRow) * itemsPerRow;
  const totalPages = Math.max(1, Math.ceil(totalCount / resultsPerPage) ?? 1);
  const [pageDimensions, setPageDimensions] = useState<
    [number, number] | undefined
  >();
  const [visiblePages, setVisiblePages] = useState<Record<number, boolean>>({});

  // console.log(
  //   `FilterResults tc=${totalCount} ipr=${itemsPerRow} rpp=${resultsPerPage} tp=${totalPages}`,
  // );

  const pagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = pagesRef.current;

    if (container) {
      const intersectionObserver = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            const page = Number(e.target.getAttribute("data-page"));
            if (page) {
              setVisiblePages((old) => ({
                ...old,
                [page]: e.isIntersecting,
              }));
            }
          }
        },
        {
          rootMargin: "30%",
        },
      );

      for (const child of container.children) {
        intersectionObserver.observe(child);
      }

      return () => intersectionObserver.disconnect();
    }
  }, [totalPages]);

  return (
    <>
      <p style={{ marginBlock: "1em" }}>{totalCount} matches</p>

      <VisibleResultsPage
        filterNode={filterNode}
        resultsStyle={resultsStyle}
        pageFrom0={0}
        resultsPerPage={resultsPerPage}
        reportTotalCount={setTotalCount}
        reportWidthAndHeight={setPageDimensions}
        reportItemsPerRow={setItemsPerRow}
      />

      <div ref={pagesRef}>
        {totalPages > 1 &&
          [...Array(totalPages - 1).keys()]
            .map((i) => i + 1)
            .map((pageFrom0) => (
              <div
                key={pageFrom0}
                data-page={pageFrom0}
                style={{
                  height: pageDimensions ? `${pageDimensions[1]}px` : undefined,
                }}
              >
                {visiblePages[pageFrom0] ? (
                  <VisibleResultsPage
                    filterNode={filterNode}
                    resultsStyle={resultsStyle}
                    pageFrom0={pageFrom0}
                    resultsPerPage={resultsPerPage}
                  />
                ) : (
                  <p>(invisible page)</p>
                )}
              </div>
            ))}
      </div>
    </>
  );
}
