import { EmptyObject } from '@voiceflow/common';
import { afterEach, describe } from 'vitest';

import * as mocks from './mocks';
import * as utils from './utils';

export * as Mocks from './mocks';
export * as Utils from './utils';

export type VI = typeof vi;

type Mocks = typeof mocks;
type Utils = typeof utils;

interface SuiteUtils extends Utils {
  mocks: Mocks;
}

export const createSuite =
  <T = EmptyObject>(createUtils?: (utils: SuiteUtils) => T) =>
  (name: string, factory: (utils: SuiteUtils & T) => Awaited<void>) =>
    describe(name, () => {
      afterEach(() => {
        vi.clearAllTimers();
      });

      const suiteUtils: SuiteUtils = { ...utils, mocks };

      factory({ ...suiteUtils, ...createUtils?.(suiteUtils) } as SuiteUtils & T);
    });

const suite = createSuite();

export default suite;
