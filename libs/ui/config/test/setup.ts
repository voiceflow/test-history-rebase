import '@testing-library/react/dont-cleanup-after-each';
import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterAll } from 'vitest';

afterAll(() => cleanup());
