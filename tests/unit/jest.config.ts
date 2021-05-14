import type { Config } from '@jest/types';
const config: Config.InitialOptions = {
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js",
  },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testMatch: ["<rootDir>/*.test.(ts|tsx)"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  testRunner: "jest-circus/runner",
  collectCoverage: false,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ["lcov", "text", "html", "cobertura"],
};

export default config;