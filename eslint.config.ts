import { dirname, resolve } from "node:path";

import std from "@blaahaj/std/eslint";
import js from "@eslint/js";
// import tsParser from "@typescript-eslint/parser";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  { extends: std },
  {
    ignores: [
      "buildAll.mjs",
      "**/.react-router/**/*",
      "**/dist/**/*",
      "**/build/**/*",
      "**/tsconfig.tsbuildinfo",
      ".github/**/*",
      "var/**/*",
      // "*.d.ts",
      // "*.js",
    ],
  },

  {
    rules: {
      "no-unreachable": "warn",
      "@typescript-eslint/no-redundant-type-constituents": "off",
    },
  },

  {
    files: ["**/*"],
    ignores: [
      "conversation/**/*",
      "dropbox-hacking-photo-manager-*/**/*",
      "graph/**/*",
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: resolve(dirname(import.meta.url)),
      },
    },
  },

  {
    files: ["conversation/**/*"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: resolve(dirname(import.meta.url) + "/conversation"),
      },
    },
  },
  {
    files: ["graph/**/*"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: resolve(dirname(import.meta.url) + "/graph"),
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
    extends: [
      {
        rules: {
          "@typescript-eslint/explicit-module-boundary-types": "off",
          "react/no-unescaped-entities": "off",
        },
      },
    ],
  },

  {
    files: ["buildAll.mjs"],
    languageOptions: {
      globals: globals.node,
      sourceType: "module",
    },
  },

  // {
  //   files: ["**/*.*ts*"],
  //   languageOptions: {
  //     parser: tsParser,
  //     ecmaVersion: "latest",
  //     sourceType: "script",
  //   },
  // },
);
