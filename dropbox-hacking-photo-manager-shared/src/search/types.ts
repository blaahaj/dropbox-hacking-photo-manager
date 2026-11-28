import { type Option } from "@blaahaj/gotcha/Option";
import { type Result } from "@blaahaj/gotcha/Result";

import type { ContentHashCollectionWithDay } from "../serverSideFeeds";

export type CompiledSearch = (c: ContentHashCollectionWithDay) => boolean;
export type SearchTermCompileResult = Option<Result<CompiledSearch>>;

export type SearchTermCompiler = (
  q: string,
  stack: CompiledSearch[],
) => SearchTermCompileResult;

export type SearchTerm = {
  readonly name: string;
  readonly examples: string[];
  readonly compiler: SearchTermCompiler;
};
