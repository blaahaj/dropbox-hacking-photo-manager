import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import { defineConfig } from "eslint/config";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import { dirname, resolve } from "path";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: [
      "buildAll.mjs",
      "**/.react-router/**/*",
      "**/dist/**/*",
      "**/build/**/*",
      "**/tsconfig.tsbuildinfo",
      ".github/**/*",
      "var/**/*",
      "*.d.ts",
      "*.js",
    ],
  },

  // {
  //   ignores: ["graph.js"],
  // },

  {
    files: ["**/*"],
    ignores: ["dropbox-hacking-photo-manager-*/**/*"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: resolve(dirname(import.meta.url)),
      },
    },
  },
  {
    files: ["dropbox-hacking-photo-manager-server/**/*"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: resolve(
          dirname(import.meta.url) + "/dropbox-hacking-photo-manager-server",
        ),
      },
    },
  },
  {
    files: ["dropbox-hacking-photo-manager-ui/**/*"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: resolve(
          dirname(import.meta.url) + "/dropbox-hacking-photo-manager-ui",
        ),
      },
    },
  },
  {
    files: ["dropbox-hacking-photo-manager-shared/**/*"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: resolve(
          dirname(import.meta.url) + "/dropbox-hacking-photo-manager-shared",
        ),
      },
    },
  },

  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,

  {
    files: ["eslint.config.mts"],
    languageOptions: {
      globals: globals.node,
      sourceType: "module",
    },
  },
  {
    files: ["build.js"],
    languageOptions: {
      globals: globals.node,
      sourceType: "commonjs",
    },
  },
  {
    files: ["buildAll.mjs"],
    languageOptions: {
      globals: globals.node,
      sourceType: "module",
    },
  },

  {
    files: ["**/*.*ts*"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "script",
    },
  },

  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },

  {
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
    },
  },

  {
    rules: {
      "no-constant-condition": "off",
      "no-shadow": "error",
      "@typescript-eslint/ban-ts-ignore": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/require-await": "off",
      "object-shorthand": "error",
      "no-unused-vars": "off",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  {
    rules: {
      // These rules mostly seem good at hiding the real cause of
      // the error in a much less comprehensible error message.
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-comparison": "off",
      "@typescript-eslint/no-unsafe-declaration-merging": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-unary-minus": "off",
    },
  },

  {
    files: ["dropbox-hacking-photo-manager-ui/**/*"],
    extends: [
      {
        rules: {
          "@typescript-eslint/explicit-module-boundary-types": "off",
          "react/no-unescaped-entities": "off",
        },
      },
    ],
  },
);
