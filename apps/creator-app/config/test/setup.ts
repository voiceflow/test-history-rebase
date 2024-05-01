import '@testing-library/jest-dom/vitest';

import { vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';

import { mockRequire } from './mock-require';

vi.mock('murmurhash-wasm', () => ({}));

mockRequire('lottie-web', () => ({ default: () => null }));
mockRequire('react-dnd', () => ({ default: () => null }));
mockRequire('react-dnd-html5-backend', () => ({ default: () => null }));

createFetchMock(vi).enableMocks();
