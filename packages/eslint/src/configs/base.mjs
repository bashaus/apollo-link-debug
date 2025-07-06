import { fixupConfigRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import jestPlugin from "eslint-plugin-jest";
import prettierPlugin from "eslint-plugin-prettier/recommended";
import promisePlugin from "eslint-plugin-promise";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

const flatCompat = new FlatCompat();

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

  /* eslint-plugin-import */
  ...fixupConfigRules(flatCompat.plugins("import")),
  {
    rules: {
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
    },
  },

  {
    files: ["*.spec.{ts,tsx}"],
    ...jestPlugin.configs["flat/recommended"],
  },
);
