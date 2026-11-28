import { dirname, join } from "node:path";

export const resolveSpec = (
  spec: string,
  from: string,
  paths: readonly string[],
  keyPaths: readonly { readonly k: string; readonly v: string[] }[],
  baseDir: string,
): string => {
  const originalSpec = spec;

  for (const { k, v: vs } of keyPaths) {
    for (const v of vs) {
      if (
        k.endsWith("/*") &&
        v.endsWith("/*") &&
        spec.startsWith(k.substring(0, k.length - 1))
      ) {
        spec = v.substring(0, v.length - 1) + spec.substring(k.length - 1);
      }
    }
  }

  for (const rr of [spec, join(dirname(from), spec)]) {
    for (const suffix of ["", ".ts", ".tsx", "/index.ts", "/index.tsx"]) {
      if (paths.includes(rr + suffix)) return rr + suffix;
    }
  }

  if (
    (spec.startsWith(".") || spec.startsWith("app")) &&
    !spec.includes(".ts")
  ) {
    console.log(
      JSON.stringify({ originalSpec, from, paths, keyPaths, baseDir, spec }),
    );
  }

  return spec;
};
