import { none, some } from "@blaahaj/gotcha/Option";
import { error, ok } from "@blaahaj/gotcha/Result";

import type { SearchTerm, SearchTermCompileResult } from "./types";

const things: SearchTerm[] = [
  // Booleans
  {
    name: "or",
    examples: ["|"],
    compiler: (q, stack): SearchTermCompileResult => {
      if (q !== "|") return none();

      const x = stack.pop();
      const y = stack.pop();
      if (!x || !y) return some(error(new Error("Stack underrun in `|`")));

      return some(ok((c) => x(c) || y(c)));
    },
  },
  {
    name: "and",
    examples: ["&"],
    compiler: (q, stack): SearchTermCompileResult => {
      if (q !== "&") return none();

      const x = stack.pop();
      const y = stack.pop();
      if (!x || !y) return some(error(new Error("Stack underrun in `&`")));

      return some(ok((c) => x(c) && y(c)));
    },
  },
  {
    name: "not",
    examples: ["!"],
    compiler: (q, stack): SearchTermCompileResult => {
      if (q !== "!") return none();

      const x = stack.pop();
      if (!x) return some(error(new Error("Stack underrun in `!`")));

      return some(ok((c) => !x(c)));
    },
  },
];

export default things;
