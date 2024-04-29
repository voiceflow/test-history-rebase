import * as Recent from '@/ducks/recent';

import suite from '../../test/ducks/_suite';

const TEST_CONFIG = {
  debug: true,
  logger: false,
};
const MOCK_STATE = {
  prototype: TEST_CONFIG,
  _persist: { version: 1, rehydrated: false },
};

suite(Recent, MOCK_STATE)('Ducks - Recent', ({ describeReducer, describeSelectors }) => {
  describeReducer(({ expectAction }) => {
    describe('updateRecentPrototype()', () => {
      it('should update test configuration', () => {
        const testConfig = { debug: false };

        expectAction(Recent.updateRecentPrototype(testConfig)).toModify({
          prototype: { debug: false, logger: false } as any,
        });
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
