module.exports = {
  moduleFileExtensions: ['json', 'js', 'jsx', 'ts', 'tsx'],
  rootDir: '../../..',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: ['**/*.it.[jt]sx'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/config/test/integration/setup.js'],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
    '^.+\\.(svg|csv|png)$': '<rootDir>/config/test/integration/assetPlaceholder.js',
    '^@/(.*)': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.[jt]sx?$': '<rootDir>/../../node_modules/ts-jest',
  },
  transformIgnorePatterns: ['/<rootDir>/../../node_modules/', '/node_modules/', '/build/', '/config/test/'],
  coverageDirectory: 'jest_coverage',
  cacheDirectory: '.jest_cache',
  coveragePathIgnorePatterns: ['/node_modules/', '/config/', '/^.+\\.svg$/', '/test/'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.test.json',
    },
  },
};
