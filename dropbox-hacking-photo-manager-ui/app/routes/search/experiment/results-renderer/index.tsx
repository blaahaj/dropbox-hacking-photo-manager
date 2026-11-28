import type { ContentHashCollectionWithDay } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import type { RefObject } from "react";

import type { ResultsStyle } from "../renderers";
import type { Formatter } from "./types";

const formatters: Record<ResultsStyle, Formatter> = {
  classic: (await import("./Classic")).default,
  compact: (await import("./Compact")).default,
  minimal: (await import("./Minimal")).default,
} as const;

/**
 * - selects the chosen formatter
 * - if there's at least 1 result, then show the date
 * - for each result,
 *   - render that result with classes & click handler, using the chosen formatter
 */

export function ResultsRenderer({
  onSelected,
  ref,
  results,
  resultsStyle,
  selectedContentHashes,
  focusedContentHash,
}: {
  onSelected: (item: ContentHashCollectionWithDay, selected: boolean) => void;
  ref: RefObject<HTMLDivElement | null>;
  results: readonly ContentHashCollectionWithDay[];
  resultsStyle: ResultsStyle;
  selectedContentHashes: ReadonlySet<string>;
  focusedContentHash: string | undefined;
}) {
  const formatter = formatters[resultsStyle];

  return (
    <div ref={ref} className={formatter.styles.page}>
      {results.length > 0 && (
        <div
          style={{
            position: "absolute",
            left: "0",
            background: "pink",
            textOrientation: "sideways",
            writingMode: "sideways-lr",
            textAlign: "end",
            paddingInline: "1em",
            textWrap: "nowrap",
            fontFamily: "monospace",
          }}
        >
          {results[0].date}
        </div>
      )}

      {results.map((result) => {
        const isSelected = selectedContentHashes.has(result.contentHash);
        const isFocused = result.contentHash === focusedContentHash;

        return (
          <div
            key={result.contentHash}
            data-content-hash={result.contentHash}
            className={[
              formatter.styles.result,
              isSelected ? formatter.styles.selected : "",
              isFocused ? formatter.styles.focused : "",
            ].join(" ")}
            onClick={(e) => {
              if (e.altKey && !e.ctrlKey && !e.metaKey) {
                onSelected(
                  result,
                  !selectedContentHashes.has(result.contentHash),
                );
              }
            }}
          >
            <formatter.Result
              c={result}
              onSelected={(s: boolean) => onSelected(result, s)}
              selected={isSelected}
              focused={isFocused}
            />
          </div>
        );
      })}
    </div>
  );
}
