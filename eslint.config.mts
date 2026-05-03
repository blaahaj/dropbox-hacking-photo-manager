import tseslint from "typescript-eslint";
import simpleImportSort, { rules } from "eslint-plugin-simple-import-sort";
import tsParser from "@typescript-eslint/parser";
import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import unusedImports from "eslint-plugin-unused-imports";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintNextPlugin from "@next/eslint-plugin-next";

export default defineConfig(
  {
    ignores: [
      "**/.next/**/*",
      "**/dist/**/*",
      "**/tsconfig.tsbuildinfo",
      ".github/**/*",
      "var/**/*",
    ],
  },

  // {
  //   ignores: ["graph.js"],
  // },

  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,

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
      "unused-imports/no-unused-imports": "warn",
    },
  },

  {
    rules: {
      "no-constant-condition": "off",
      "no-shadow": "error",
      "@typescript-eslint/ban-ts-ignore": "off",
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/explicit-module-boundary-types": ["error"],
      "@typescript-eslint/no-empty-function": "off",
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
    plugins: {
      "@next/nextjs": eslintNextPlugin,
    },
    settings: {
      next: {
        rootDir: "dropbox-hacking-photo-manager-next",
      },
    },
  },

  {
    files: ["dropbox-hacking-photo-manager-next/**/*"],
    extends: [
      ...nextVitals,
      ...nextTs,
      // Override default ignores of eslint-config-next.
      globalIgnores([
        // Default ignores of eslint-config-next:
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
      ]),

      {
        rules: {
          "@next/nextjs/no-html-link-for-pages": [
            "error",
            "dropbox-hacking-photo-manager-next/pages", // which doesn't exist
          ],
        },
      },
    ],
  },
);
