import type { Config } from "@jest/types";

export default async (): Promise<Config.InitialOptions> => {
  return {
    transform: {
      "^.+\\.tsx?$": "ts-jest"
    },
    maxWorkers: 10,
    rootDir: ".",
    moduleFileExtensions: ["ts", "js"],
    testMatch: ["**/?(*.)+(spec|test).ts"],
  }
}