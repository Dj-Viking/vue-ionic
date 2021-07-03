import type { Config } from "@jest/types";

export default async (): Promise<Config.InitialOptions> => {
  return {
    testMatch: ["**/?(*.)+(spec|test).ts"],
    globalSetup: "../server/globalSetup.ts",
    globalTeardown: "../server/globalTeardown.ts"
  }
}