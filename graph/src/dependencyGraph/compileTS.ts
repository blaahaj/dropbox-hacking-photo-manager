import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import ts from "typescript";
import { isImportDeclaration, isStringLiteral } from "typescript";

export const compileTS = async (
  files: string[],
  baseDir: string,
  appDir: string,
) => {
  const imports: { readonly filename: string; readonly moduleSpec: string }[] =
    [];

  const jsonText = await readFile(`${baseDir}/tsconfig.json`, "utf-8");
  const configData = JSON.parse(jsonText);
  const opts = ts.convertCompilerOptionsFromJson(
    configData.compilerOptions,
    baseDir,
    "tsconfig.json",
  );

  if (opts.errors.length > 0) {
    console.dir({ opts }, { depth: 3 });
  }

  const program = ts.createProgram(files, {
    ...opts.options,
    noEmit: true,
  });

  for (const f of program.getSourceFiles()) {
    const absPath = resolve(baseDir, f.fileName);

    if (!f.fileName.startsWith(`${baseDir}/${appDir}/`)) continue;

    for (const st of f.statements) {
      if (isImportDeclaration(st)) {
        const m = st.moduleSpecifier;
        if (isStringLiteral(m)) {
          imports.push({
            filename: absPath,
            moduleSpec: m.text,
          });
        }
      }
    }
  }

  program
    .getGlobalDiagnostics()
    .forEach((globalDiagnostic) =>
      console.dir({ globalDiagnostic }, { depth: 2 }),
    );

  program
    .getOptionsDiagnostics()
    .forEach((optionsDiagnostic) =>
      console.dir({ optionsDiagnostic }, { depth: 2 }),
    );

  program
    .getSemanticDiagnostics()
    .forEach((semanticDiagnostic) =>
      console.dir({ semanticDiagnostic }, { depth: 2 }),
    );

  program
    .getSyntacticDiagnostics()
    .forEach((syntacticDiagnostic) =>
      console.dir({ syntacticDiagnostic }, { depth: 2 }),
    );

  const paths = program.getCompilerOptions().paths;
  return { imports, paths };
};
