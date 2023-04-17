/// <reference types="vitest/globals" />

import '@testing-library/jest-dom';
import 'jest-styled-components';

beforeAll(() => {
  vi.mock('murmurhash-wasm', () => ({}));
});
