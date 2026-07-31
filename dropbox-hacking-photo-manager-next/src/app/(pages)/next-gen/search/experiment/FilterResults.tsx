"use client";

import Tools from "@components/ListOfContent/Tools";
import type { FilterNode } from "dropbox-hacking-photo-manager-shared";
import type { ContentHashCollectionWithDay } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

  console.log(
    `FilterResults tc=${totalCount} ipr=${itemsPerRow} rpp=${resultsPerPage} tp=${totalPages}`,
  );

  const draggableSpaceRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<HTMLDivElement>(null);

  const [dragStartXY, setDragStartXY] = useState<
    [number, number] | undefined
  >();
  const [dragEndXY, setDragEndXY] = useState<[number, number] | undefined>();

  const showDragBox = useRef(false);
  const [strokeDashoffset, setStrokeDashoffset] = useState(0);
  useEffect(() => {
    const nudgeStrokeTimer = () => {
      if (!showDragBox.current) return;
      const now = new Date().getTime();
      setStrokeDashoffset(Math.floor(now / 100) % 10);
    };

    const h = setInterval(nudgeStrokeTimer, 100);
    return () => clearInterval(h);
  }, []);

  const startDrag = useCallback((pos: [number, number]) => {
    setDragStartXY(pos);
    setDragEndXY(pos);
    showDragBox.current = true;
  }, []);

  const updateDrag = useCallback((_pos: [number, number]) => {
    //
  }, []);

  const endDrag = useCallback(() => {
    // TODO, do whatever the drag was for
    setDragStartXY(undefined);
    setDragEndXY(undefined);
    showDragBox.current = false;
  }, []);

  const cancelDrag = useCallback(() => {
    setDragStartXY(undefined);
    setDragEndXY(undefined);
    showDragBox.current = false;
  }, []);

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
  };

  // const resultsRef = useRef<HTMLDivElement | null>(null);
  // useEffect(() => {
  //   const div = resultsRef.current;
  //   if (!div) return;

  //   const listener1 = (e: PointerEvent) => {
  //     const findContentHash = () => {
  //       let ele = e.target;
  //       while (ele instanceof Element) {
  //         if (ele.getAttribute("data-results")) return;

  //         const contentHash = ele.getAttribute("data-content-hash");
  //         if (contentHash) return contentHash;

  //         ele = ele.parentElement;
  //       }
  //     };

  //     const hash = findContentHash();
  //     if (!hash) return;

  //     if (e.altKey && !e.ctrlKey && !e.metaKey) {
  //       setSelectedContentHashes((old) => {
  //         const copy = new Set(old);
  //         if (copy.has(hash)) copy.delete(hash);
  //         else copy.add(hash);
  //         return copy;
  //       });
  //     }
  //   };

  //   div.addEventListener("click", listener1, { capture: false });

  //   return () => {
  //     div.removeEventListener("click", listener1, { capture: false });
  //   };
  // }, []);

  useEffect(() => {
    const draggableSpace = draggableSpaceRef.current;
    if (!draggableSpace) return;

    // draggableSpace.draggable = true;

    const mouseListener = (e: MouseEvent) => {
      console.debug(e);

      if (e.type === "mousedown") {
        startDrag([e.offsetX, e.offsetY]);
        e.preventDefault();
      }

      if (e.type === "mouseup") {
        endDrag();
        e.preventDefault();
      }

      if (e.type === "mouseleave") {
        cancelDrag();
      }

      if (e.type === "mousemove") {
        if (showDragBox.current) updateDrag([e.offsetX, e.offsetY]);
      }
    };
    const dragListener = (e: DragEvent) => {
      console.debug(e);
      // e.preventDefault();
    };
    const keyListener = (e: KeyboardEvent) => {
      console.debug(e);
      if (e.key === "Escape") cancelDrag();
    };

    draggableSpace.addEventListener("mousedown", mouseListener);
    draggableSpace.addEventListener("mouseup", mouseListener);
    draggableSpace.addEventListener("mousemove", mouseListener);
    draggableSpace.addEventListener("mouseenter", mouseListener);
    draggableSpace.addEventListener("mouseleave", mouseListener);
    draggableSpace.addEventListener("click", mouseListener);
    draggableSpace.addEventListener("dblclick", mouseListener);
    draggableSpace.addEventListener("drag", dragListener);
    draggableSpace.addEventListener("keydown", keyListener);
    draggableSpace.addEventListener("keyup", keyListener);

    return () => {
      // draggableSpace.draggable = false;
      draggableSpace.removeEventListener("mousedown", mouseListener);
      draggableSpace.removeEventListener("mouseup", mouseListener);
      draggableSpace.removeEventListener("mousemove", mouseListener);
      draggableSpace.removeEventListener("mouseenter", mouseListener);
      draggableSpace.removeEventListener("mouseleave", mouseListener);
      draggableSpace.removeEventListener("click", mouseListener);
      draggableSpace.removeEventListener("dblclick", mouseListener);
      draggableSpace.removeEventListener("drag", dragListener);
      draggableSpace.removeEventListener("keydown", keyListener);
      draggableSpace.removeEventListener("keyup", keyListener);
    };
  }, [cancelDrag, endDrag, startDrag, updateDrag]);

  // eslint-disable-next-line react-hooks/refs
  const show = showDragBox.current;

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
      />

      <div>
        <p>
          Drag start={dragStartXY ? dragStartXY.join(",") : "-"} end=
          {dragEndXY ? dragEndXY.join(",") : "-"}
          show={show ? "t" : "f"}
        </p>
      </div>

      <div
        ref={draggableSpaceRef}
        //  data-results
      >
        {dragStartXY && dragEndXY && (
          <>
            <svg
              style={{
                position: "absolute",
                pointerEvents: "none",
                zIndex: 100,
                border: "1px solid red",
                width: "100vw",
                height: "100vh",
                top: 0,
                left: 0,
              }}
            >
              <rect
                x={Math.min(dragStartXY[0], dragEndXY[0])}
                y={Math.min(dragStartXY[1], dragEndXY[1])}
                width={Math.abs(dragEndXY[0] - dragStartXY[0])}
                height={Math.abs(dragEndXY[1] - dragStartXY[1])}
                stroke={"red"}
                strokeDasharray={"5 5"}
                strokeDashoffset={strokeDashoffset}
                strokeWidth={"3"}
                // style={{ strokeColor: "red" }}
                fill="transparent"
                // fill="blue"
              />
            </svg>
          </>
        )}

        <VisibleResultsPage
          filterNode={filterNode}
          resultsStyle={resultsStyle}
          pageFrom0={0}
          resultsPerPage={resultsPerPage}
          reportTotalCount={setTotalCount}
          reportWidthAndHeight={setPageDimensions}
          reportItemsPerRow={setItemsPerRow}
          selectedContentHashes={selectedContentHashes}
          focusedContentHash={focusedContentHash}
          onSelected={onSelected}
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
                    height: pageDimensions
                      ? `${pageDimensions[1]}px`
                      : undefined,
                  }}
                >
                  {visiblePages[pageFrom0] && (
                    <VisibleResultsPage
                      filterNode={filterNode}
                      resultsStyle={resultsStyle}
                      pageFrom0={pageFrom0}
                      resultsPerPage={resultsPerPage}
                      selectedContentHashes={selectedContentHashes}
                      focusedContentHash={focusedContentHash}
                      onSelected={onSelected}
                    />
                  )}
                </div>
              ))}
        </div>
      </div>
    </>
  );
}
