import { none, type Option, some } from "@blaahaj/gotcha/Option";
import Tools from "@components/ListOfContent/Tools";
import type { ContentHashCollectionWithDay } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import { useEffect, useMemo, useRef, useState } from "react";

import type { ResultsStyle } from "./renderers";
import ResultsPage from "./ResultsPage";

const TARGET_ITEMS_PER_PAGE = 500;

/**
 * Given a filterNode (i.e. search spec), and a rendering style,
 * then take care of all the dynamic fetching / loading / unloading / rendering
 *
 * We break the results up into pages of size TARGET_ITEMS_PER_PAGE.
 * There is always at least 1 page. The last page may be less than full,
 * including potentially being completely empty.
 *
 * Page 0 is dynamically sized, and reports its dimensions back to us.
 * The last page is dynamically sized.
 * Any pages in between are statically sized, based on the size reported by page 0.
 */

export default function ShowFilterResults({
  filterNode,
  resultsStyle,
}: {
  filterNode: string;
  resultsStyle: ResultsStyle;
}) {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [itemsPerRow, setItemsPerRow] = useState<number>(5);
  const resultsPerPage =
    Math.ceil(TARGET_ITEMS_PER_PAGE / itemsPerRow) * itemsPerRow;
  const totalPages = Math.max(1, Math.ceil(totalCount / resultsPerPage) ?? 1);
  const [pageDimensions, setPageDimensions] = useState<
    [number, number] | undefined
  >();
  const [visiblePages, setVisiblePages] = useState<Record<number, boolean>>({});

  console.log(
    `FilterResults tc=${totalCount} ipr=${itemsPerRow} rpp=${resultsPerPage} tp=${totalPages}`,
  );

  const resultsByPageRef = useRef(
    new Map<number, readonly ContentHashCollectionWithDay[]>(),
  );

  const findResultByContentHash = (
    contentHash: string,
  ): Option<{
    pageFrom0: number;
    positionWithinPageFrom0: number;
    result: ContentHashCollectionWithDay;
  }> => {
    for (const [pageFrom0, results] of resultsByPageRef.current.entries()) {
      const positionWithinPageFrom0 = results.findIndex(
        (item) => item.contentHash === contentHash,
      );
      if (positionWithinPageFrom0 >= 0) {
        return some({
          pageFrom0,
          positionWithinPageFrom0,
          result: results[positionWithinPageFrom0],
        });
      }
    }
    return none();
  };

  const reportResults = (
    pageFrom0: number,
    results: readonly ContentHashCollectionWithDay[],
  ) => {
    resultsByPageRef.current.set(pageFrom0, results);
  };

  const pagesRef = useRef<HTMLDivElement>(null);

  // Track whether or not each page should be rendered, based on whether
  // it's overlapping (or near to overlapping) the visible page.
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

              if (!e.isIntersecting) {
                resultsByPageRef.current.delete(page);
              }
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

  const [selectedItems, setSelectedItems] = useState<
    ReadonlyMap<string, ContentHashCollectionWithDay>
  >(new Map());
  const selectedContentHashes: ReadonlySet<string> = useMemo(
    () => new Set(selectedItems.keys()),
    [selectedItems],
  );
  const [focusedContentHash, setFocusedContentHash] = useState<
    string | undefined
  >();

  // So we can read focusedContentHash in an event handler without having
  // to re-render the handler every time focusedContentHash changes
  const focusedContentHashRef = useRef(focusedContentHash);
  focusedContentHashRef.current = focusedContentHash;

  // Select or unselect a given result
  const onSelected = (
    result: ContentHashCollectionWithDay,
    selected: boolean,
  ) => {
    // setSelectedContentHashes((old) => {
    //   const r = new Set(old);
    //   if (selected) r.add(result.contentHash);
    //   else r.delete(result.contentHash);
    //   return r;
    // });

    setSelectedItems((old) => {
      const r = new Map(old);
      if (selected) r.set(result.contentHash, result);
      else r.delete(result.contentHash);
      return r;
    });

    setFocusedContentHash(result.contentHash);

    const node = document.evaluate(
      `//*[@data-content-hash='${result.contentHash}']//a[@href]`,
      document,
      null,
      XPathResult.ANY_UNORDERED_NODE_TYPE,
    ).singleNodeValue;

    if (node instanceof HTMLElement) node.focus();
  };

  // Register various keyboard shortcuts
  useEffect(() => {
    const d = pagesRef.current;
    if (!d) return;

    const keyDownListener = (e: KeyboardEvent) => {
      if (!focusedContentHashRef.current) return;

      const moveFocus = (by: 1 | -1) => {
        const contentHashNodes = document.evaluate(
          "//*[@data-content-hash]",
          d,
          null,
          XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        );

        const renderedContentHashes: string[] = [];

        for (;;) {
          const n = contentHashNodes.iterateNext();
          if (!n) break;

          renderedContentHashes.push(
            (n as HTMLElement).getAttribute("data-content-hash")!,
          );
        }

        const currentIndex = renderedContentHashes.indexOf(
          focusedContentHashRef.current ?? "",
        );
        if (currentIndex >= 0) {
          const offset = by + renderedContentHashes.length;
          const newIndex =
            (currentIndex + offset) % renderedContentHashes.length;
          const newContentHash = renderedContentHashes[newIndex];
          setFocusedContentHash(newContentHash);
        }
      };

      if (
        ["KeyY", "KeyN"].includes(e.code) &&
        // !e.shiftKey &&
        !e.altKey &&
        !e.ctrlKey &&
        !e.metaKey
      ) {
        const t = findResultByContentHash(focusedContentHashRef.current);
        if (t.isSome()) onSelected(t.value.result, e.code === "KeyY");
        if (e.shiftKey) moveFocus(+1);
      }

      // TODO 't' to focus on the tags input
      // TODO 'g' to focus on the GPS input
      // TODO 'q' to unselect all

      // TODO escape from tags / GPS to return focus to the results

      if (
        ["ArrowLeft", "ArrowRight"].includes(e.code) &&
        !e.shiftKey &&
        !e.altKey &&
        !e.ctrlKey &&
        !e.metaKey
      ) {
        moveFocus(e.code === "ArrowRight" ? (+1 as const) : (-1 as const));
      }
    };

    d.addEventListener("keydown", keyDownListener);
    return () => d.removeEventListener("keydown", keyDownListener);
  });

  return (
    <>
      <p style={{ marginBlock: "1em" }}>{totalCount} matches</p>

      <Tools
        countAll={totalCount}
        setAll={function (which: "all" | "none", checked: boolean): void {
          console.log(`setAll ${which} ${checked}`);
          if (which === "none" && checked) {
            // setSelectedContentHashes(new Set());
            setSelectedItems(new Map());
          }
        }}
        selectedFiles={[...selectedItems.values()]}
        // TODO: add an 'onCancel' callback
      />

      <div ref={pagesRef}>
        {[...Array(totalPages).keys()].map((pageFrom0) => {
          const doReporting = pageFrom0 === 0;
          const dynamicPageSize =
            pageFrom0 === 0 || pageFrom0 === totalPages - 1;
          const doRender = pageFrom0 === 0 || visiblePages[pageFrom0];

          return (
            <div
              key={pageFrom0}
              data-page={pageFrom0}
              style={{
                height:
                  !dynamicPageSize && pageDimensions
                    ? `${pageDimensions[1]}px`
                    : undefined,
              }}
            >
              {doRender && (
                <ResultsPage
                  filterNode={filterNode}
                  resultsStyle={resultsStyle}
                  pageFrom0={pageFrom0}
                  resultsPerPage={resultsPerPage}
                  reportResults={reportResults}
                  selectedContentHashes={selectedContentHashes}
                  focusedContentHash={focusedContentHash}
                  onSelected={onSelected}
                  {...(doReporting
                    ? {
                        reportTotalCount: setTotalCount,
                        reportWidthAndHeight: setPageDimensions,
                        reportItemsPerRow: setItemsPerRow,
                      }
                    : {})}
                />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
