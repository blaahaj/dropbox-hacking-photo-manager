import { combineLatest, map, type Observable } from "rxjs";

import { v2CompileQueryFromThings } from "../search/index.js";
import {
  type ContentHashCollectionWithDay,
  type FullDatabaseFeeds,
} from "./index.js";

const DEFAULT_RESULTS_PER_PAGE = 1000;

export type SearchRequest = {
  readonly type: "rx.ng.search";
  readonly filter: string;
  readonly pageFrom0?: number;
  readonly resultsPerPage?: number;
};

export type SearchResult = {
  readonly truncated: boolean;
  readonly totalCount: number;
  readonly matches: readonly ContentHashCollectionWithDay[];
  readonly pageFrom0: number;
  readonly resultsPerPage: number;
};

export const provideSearch = (
  feeds: FullDatabaseFeeds,
  req: SearchRequest,
): Observable<SearchResult> => {
  const predicate = v2CompileQueryFromThings(req.filter);
  if (predicate instanceof Error) throw predicate;

  const pageFrom0 = req.pageFrom0 ?? 0;
  const resultsPerPage = req.resultsPerPage ?? DEFAULT_RESULTS_PER_PAGE;

  return combineLatest([feeds.byContentHash, feeds.daysByDate])
    .pipe(
      map(([content, days]) =>
        content
          .values()
          .map(
            (v): ContentHashCollectionWithDay => ({
              ...v,
              day: days.get(v.date) ?? {
                date: v.date,
                description: "",
              },
            }),
          )
          .toArray(),
      ),
    )
    .pipe(
      map((candidates) => {
        const matches = candidates
          .filter(predicate)
          .sort(
            (a, b) =>
              a.timestamp.localeCompare(b.timestamp) ||
              a.namedFiles[0].name.localeCompare(b.namedFiles[0].name) ||
              a.contentHash.localeCompare(b.contentHash),
          );

        return {
          truncated: matches.length > (pageFrom0 + 1) * resultsPerPage,
          totalCount: matches.length,
          matches: matches.slice(
            pageFrom0 * resultsPerPage,
            (pageFrom0 + 1) * resultsPerPage,
          ),
          pageFrom0,
          resultsPerPage,
        };
      }),
    );
};
