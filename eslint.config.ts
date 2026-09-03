import std from "@blaahaj/std/eslint";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import { defineConfig } from "eslint/config";
import globals from "globals";
import { dirname, resolve } from "path";
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
      "*.d.ts",
      "*.js",
    ],
  },

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
    files: ["eslint.config.mts"],
    languageOptions: {
      globals: globals.node,
      sourceType: "module",
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
);
