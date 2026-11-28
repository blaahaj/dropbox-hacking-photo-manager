import { compile } from "./compile.js";
import formats from "./formats.js";
import gps from "./gps.js";
import logic from "./logic.js";
import numericFields from "./numericFields.js";
import textFields from "./textFields.js";
import type { SearchTerm } from "./types.js";
export type { CompiledSearch } from "./types.js";

export const searchTerms: readonly SearchTerm[] = [
  ...logic,
  ...formats,
  ...gps,
  ...textFields,
  ...numericFields,
  // could add: path, file-id, file-rev
];

export const compileSearch = compile(searchTerms);
