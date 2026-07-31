import type { ContentHashCollectionWithDay } from "dropbox-hacking-photo-manager-shared/serverSideFeeds";
import type { RefObject } from "react";

import type { ResultsStyle } from "../page";
import * as classic from "./Classic";
import * as compact from "./Compact";
import * as minimal from "./Minimal";

const formatters: Record<
  ResultsStyle,
  typeof classic | typeof compact | typeof minimal
> = {
  classic,
  compact,
  minimal,
} as const;

export function Results({
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
  const S = formatters[resultsStyle].styles;
  const R = formatters[resultsStyle].default;

  return (
    <div ref={ref} className={S.page}>
      {results[0] && (
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
            data-content-hash={result}
            className={`${S.result} ${isSelected ? S.selected : ""} ${isFocused ? S.focused : ""}`}
            onClick={(e) => {
              if (e.altKey && !e.ctrlKey && !e.metaKey) {
                onSelected(
                  result,
                  !selectedContentHashes.has(result.contentHash),
                );
              }
            }}
          >
            <R
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
