/// <reference types="vitest/globals" />

import '@testing-library/jest-dom';
import 'jest-styled-components';

import { vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

beforeAll(() => {
  vi.mock('logrocket', () => ({}));
  vi.mock('murmurhash-wasm', () => ({}));
});

createFetchMock(vi).enableMocks();
