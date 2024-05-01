import { describe, expect, it } from 'vitest';

import * as Recent from '@/ducks/recent';

import { createDuckTools } from './_suite';

const TEST_CONFIG = {
  debug: true,
  isGuided: false,
} as Recent.PrototypeConfig;
const MOCK_STATE = {
  prototype: TEST_CONFIG,
  redirect: null,
  _persist: { version: 1, rehydrated: false },
};

const { describeReducer, describeSelectors } = createDuckTools(Recent, MOCK_STATE);

describe('Ducks - Recent', () => {
  describeReducer(Recent.updateRecentPrototype, ({ applyAction }) => {
    it('should update test configuration', () => {
      const testConfig = { debug: false };

      const result = applyAction(MOCK_STATE, testConfig);

      expect(result.prototype).toEqual({
        debug: false,
        isGuided: false,
      });
    });
  });

  describeSelectors(({ select }) => {
    describe('recentPrototypeSelector()', () => {
      it('should select the test tool configuration', () => {
        expect(select(Recent.recentPrototypeSelector)).toBe(TEST_CONFIG);
      });
    });
  });
});
