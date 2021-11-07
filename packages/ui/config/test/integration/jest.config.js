module.exports = {
  moduleFileExtensions: ['json', 'js', 'jsx', 'ts', 'tsx'],
  rootDir: '../../..',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: ['**/*.it.[jt]sx'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/config/test/integration/setup.ts'],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
    '^.+\\.svg(?:\\?url)?$': '<rootDir>/config/test/integration/assetPlaceholder.js',
  },
  transform: {
    '^.+\\.[jt]sx?$': '<rootDir>/../../node_modules/ts-jest',
  },
  transformIgnorePatterns: ['/node_modules/'],
  coverageDirectory: 'jest_coverage',
  cacheDirectory: '.jest_cache',
  coveragePathIgnorePatterns: ['/node_modules/', '/config/', '/^.+\\.svg(?:\\?url)?$/', '/test/'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.test.json',
    },
  },
};
