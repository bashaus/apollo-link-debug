import eslintConfig from "@apollo-link-debug/eslint";

const config = [
  ...eslintConfig.configs.base,
  {
    ignores: ["coverage/*", "packages/*"],
  },
];

export default config;
