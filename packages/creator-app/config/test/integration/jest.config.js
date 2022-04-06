module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  moduleFileExtensions: ['json', 'js', 'jsx', 'ts', 'tsx'],
  rootDir: '../../..',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: ['**/*.it.[jt]sx'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/config/test/integration/setup.js'],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
    '^@logux/client$': 'identity-obj-proxy',
    '^@logux/redux$': 'identity-obj-proxy',
    '^@logux/core$': 'identity-obj-proxy',
    '^nanoevents$': 'identity-obj-proxy',
    '^murmurhash-wasm$': 'identity-obj-proxy',
    '^.+\\.(svg|csv|png)(?:\\?url)?$': '<rootDir>/config/test/integration/assetPlaceholder.js',
    '^@/(.*)': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: ['/node_modules/', '/build/', '/config/test/', '/__mocks__/'],
  coverageDirectory: 'jest_coverage',
  cacheDirectory: '.jest_cache',
  coveragePathIgnorePatterns: ['/node_modules/', '/config/', '/^.+\\.svg(?:\\?url)?$/', '/test/'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.test.json',
    },
  },
};
