import * as Recent from '@/ducks/recent';

import suite from './_suite';

const TEST_CONFIG = {
  debug: true,
  logger: false,
};
const MOCK_STATE = {
  testing: TEST_CONFIG,
};

suite(Recent, MOCK_STATE)('Ducks - Recent', ({ expect, describeReducer, describeSelectors }) => {
  describeReducer(({ expectAction }) => {
    describe('updateRecentTesting()', () => {
      it('should update test configuration', () => {
        const testConfig = { debug: false };

        expectAction(Recent.updateRecentTesting(testConfig)).toModify({ testing: { debug: false, logger: false } });
      });
    });
  });

  describeSelectors(({ select }) => {
    describe('recentTestingSelector()', () => {
      it('should select the test tool configuration', () => {
        expect(select(Recent.recentTestingSelector)).to.eq(TEST_CONFIG);
      });
    });
  });
});
