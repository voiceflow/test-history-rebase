/// <reference types="vitest/globals" />

import '@testing-library/jest-dom';
import 'jest-styled-components';

import { vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

import { mockRequire } from './mock-require';

vi.mock('murmurhash-wasm', () => ({}));

mockRequire('lottie-web', () => ({ default: () => null }));

createFetchMock(vi).enableMocks();
