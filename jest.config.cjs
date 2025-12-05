/** @type {import('jest').Config} */
module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.cjs'],
  testMatch: ['**/__tests__/**/*.test.[jt]s', '**/?(*.)+(spec|test).[jt]s'],
  testTimeout: 20000,
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'json', 'node'],
  testRunner: 'jest-circus/runner',
  testPathIgnorePatterns: ['/node_modules/', '/src/database/', '/src/app/'],
  verbose: true,
  transform: {},
};
