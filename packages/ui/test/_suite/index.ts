import { EmptyObject } from '@voiceflow/common';
import { afterEach } from 'vitest';

import * as mocks from './mocks';

export * as Mocks from './mocks';

export type VI = typeof vi;

type Mocks = typeof mocks;

interface Utils {
  mocks: Mocks;
}

export const createSuite =
  <T = EmptyObject>(createUtils?: (utils: Utils) => T) =>
  (name: string, factory: (utils: Utils) => Awaited<void>) =>
    describe(name, () => {
      afterEach(() => {
        vi.clearAllTimers();
      });

      factory({ mocks, ...createUtils?.({ mocks }) } as Utils);
    });

const suite = createSuite();

export default suite;
