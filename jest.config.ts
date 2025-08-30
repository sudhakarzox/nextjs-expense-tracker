/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,               // Enable coverage collection
  coverageDirectory: 'coverage',       // Output folder for coverage reports
  coverageReporters: ['text', 'lcov'], // Coverage report formats (console + HTML)
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      // Add other ts-jest options here if needed
    }],
  },
  moduleNameMapper: {
    // Support for path aliases (adjust based on your tsconfig paths)
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
//   setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // optional: for setup like jest-dom
};
