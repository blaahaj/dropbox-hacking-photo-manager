import { isNone } from "@blaahaj/gotcha/Option";
import { error, ok, type Result } from "@blaahaj/gotcha/Result";

import { type CompiledSearch, type SearchTerm } from "./types";

export const compile =
  (searchTerms: readonly SearchTerm[]) =>
  (q: string): Result<CompiledSearch> => {
    const stack: CompiledSearch[] = [];

    for (const part of q.trim().split(" ").filter(Boolean)) {
      let compiledNode: CompiledSearch | undefined;

      for (const thing of searchTerms) {
        const c = thing.compiler(part, stack);
        if (!c) {
          throw new Error(
            `Result of compiling '${part}' was ${c === undefined ? "undefined" : JSON.stringify(c)}`,
          );
        }

        if (isNone(c)) continue;
        if (c.value.isError()) return c.value;

        compiledNode = c.value.value;
        break;
      }

      if (!compiledNode) return error(new Error(`Unrecognised term ${part}`));

      stack.push(compiledNode);
    }

    if (stack.length < 1) return error(new Error(`Stack underrun`));
    if (stack.length > 1) return error(new Error(`Stack overrun`));

    return ok(stack[0]);
  };
