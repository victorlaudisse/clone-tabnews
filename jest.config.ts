import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  rootDir: ".",
  testTimeout: 60000,
};

async function jestConfig() {
  const nextJestConfig = await createJestConfig(config)();
  nextJestConfig.transformIgnorePatterns[0] =
    "/node_modules/(?!(node-pg-migrate|glob|uuid)/)";
  return nextJestConfig;
}

export default jestConfig;
