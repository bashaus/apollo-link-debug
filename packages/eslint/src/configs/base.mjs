import js from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier/recommended";
import promisePlugin from "eslint-plugin-promise";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,

  {
    ignores: ["dist/*", ".turbo/*"],
  },

  /* typescript-eslint */
  ...tseslint.configs.recommended,

  /* eslint-plugin-promise */
  promisePlugin.configs["flat/recommended"],

  /* eslint-plugin-simple-import-sort */
  {
    plugins: {
      "simple-import-sort": simpleImportSortPlugin,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },

  /* eslint-plugin-prettier */
  prettierPlugin,
);
