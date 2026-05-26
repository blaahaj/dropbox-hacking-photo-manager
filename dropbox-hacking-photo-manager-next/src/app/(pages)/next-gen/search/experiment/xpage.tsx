// "use client";

// import Navigate from "@components/Navigation";
// import logRender from "@lib/logRender";
// import { useEffect, useMemo, useRef, useState } from "react";

// import VisibleResultsPage from "./VisibleResultsPage";
// import { filter } from "rxjs";

// const NGSearch = () => {
//   useEffect(() => {
//     document.title = "DPMNG - search";
//   }, []);

//   const windowRef = useRef<HTMLDivElement>(null);
//   const partsRef = useRef<HTMLDivElement>(null);
//   const [visiblePages, setVisiblePages] = useState<Record<number, boolean>>({});

//   useEffect(() => {
//     const wDiv = windowRef.current;
//     const pDiv = partsRef.current;
//     if (!wDiv || !pDiv) return;

//     const obs = new IntersectionObserver(
//       (entries) => {
//         for (const e of entries) {
//           const page = Number(e.target.getAttribute("data-page"));
//           console.log(
//             `Page ${page} is at ${100 * e.intersectionRatio}% intersection (${e.isIntersecting ? "visible" : "invisible"})`,
//           );
//           setVisiblePages((old) => ({
//             ...old,
//             [page]: e.isIntersecting,
//           }));
//         }
//       },
//       {
//         rootMargin: "100%",
//         // scrollMargin: "10%",
//         root: wDiv,
//       },
//     );

//     console.dir({ c: pDiv.children });

//     for (const child of pDiv.children) {
//       obs.observe(child);
//     }
//   }, []);

//   const [pageDimensions, setPageDimensions] = useState<
//     [number, number] | undefined
//   >();

//   const reportSize = useMemo(
//     () => (width: number, height: number) => {
//       console.log(`Page 0 reports as ${width} x ${height}`);
//       setPageDimensions([width, height]);
//     },
//     [],
//   );

//   return (
//     <>
//       <Navigate />

//       <main style={{ margin: "2em" }}>
//         <h1>Experiment</h1>

//         <div
//           ref={windowRef}
//           style={{
//             position: "fixed",
//             // left: "8em",
//             top: "9em",
//             // right: "8em",
//             bottom: "1em",
//             overflow: "scroll",
//           }}
//         >
//           <VisibleResultsPage
//             page={0}
//             filterNode={filterNode}
//             visibilityRootRef={windowRef}
//             reportSize={reportSize}
//           />
//           <div ref={partsRef}>
//             {[...Array(100).keys()].map((i) => (
//               <div
//                 key={i}
//                 data-page={i}
//                 style={{
//                   width: pageDimensions ? `${pageDimensions[0]}px` : undefined,
//                   height: pageDimensions ? `${pageDimensions[1]}px` : undefined,
//                 }}
//               >
//                 {visiblePages[i] ? (
//                   <VisibleResultsPage page={i} visibilityRootRef={windowRef} />
//                 ) : null}
//               </div>
//             ))}
//           </div>
//         </div>
//       </main>
//     </>
//   );
// };

// export default logRender(NGSearch);
