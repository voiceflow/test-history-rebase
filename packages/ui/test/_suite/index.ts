import { EmptyObject } from '@voiceflow/common';
import { afterEach } from 'vitest';

import * as mocks from './mocks';

export * as Mocks from './mocks';

export type VI = typeof vi;

type Mocks = typeof mocks;

export const createSuite =
  <T = EmptyObject>(createUtils?: (utils: Mocks) => T) =>
  (name: string, factory: (utils: T & Mocks) => Awaited<void>) =>
    describe(name, () => {
      afterEach(() => {
        vi.restoreAllMocks();
        vi.clearAllTimers();
      });

      factory({ ...mocks, ...createUtils?.(mocks) } as T & Mocks);
    });

const suite = createSuite();

export default suite;
