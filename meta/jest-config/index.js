const path = require('path');
const swcConfig = require('@voiceflow-meta/swc-config/base.json');

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  transform: {
    '^.+\\.(t|j)s?$': ['@swc/jest', swcConfig],
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/build/'],
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  testEnvironment: 'node',
  collectCoverage: true,
  coverageProvider: 'v8',
  coverageReporters: ['clover', 'json', 'lcov'],
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,js}', '!**/node_modules/**'],
  coverageDirectory: '<rootDir>/sonar/coverage',
  globalSetup: path.join(__dirname, 'global-setup.js'),
  maxWorkers: process.env.CI ? 4 : '50%',
};
