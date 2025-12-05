/** @type {import('jest').Config} */
module.exports = {
  rootDir: '.',
  roots: ['<rootDir>/test'],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/test/jest.setup.cjs'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.tests.js'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  testTimeout: 20000,
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'json', 'node'],
  testRunner: 'jest-circus/runner',
  testPathIgnorePatterns: ['/node_modules/', '/src/database/', '/src/app/'],
  verbose: true,
  transform: {},
};
