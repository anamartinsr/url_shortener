export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.spec.ts"],
  modulePaths: ["<rootDir>/src"],
  clearMocks: true,
  verbose: true,
  maxWorkers: 1,
  detectOpenHandles: true,
  forceExit: true,
  restoreMocks: true,
};
