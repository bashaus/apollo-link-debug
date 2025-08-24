import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  displayName: "handle-timer",
  transform: {
    "^.+\\.[tj]s$": "@swc/jest",
  },
  moduleFileExtensions: ["ts", "js", "html"],
};

export default config;
