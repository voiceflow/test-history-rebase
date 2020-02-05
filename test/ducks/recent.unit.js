import * as Recent from '@/ducks/recent';

import suite from './_suite';

const TEST_CONFIG = {
  debug: true,
  logger: false,
};
const MOCK_STATE = {
  testing: TEST_CONFIG,
};

suite('Ducks - Recent', ({ describeReducer, describeSelectors }) => {
  describeReducer(Recent, MOCK_STATE, (utils) => {
    describe('updateRecentTesting()', () => {
      it('should update test configuration', () => {
        const testConfig = { debug: false };

        utils.expectDiff(Recent.updateRecentTesting(testConfig), { testing: { debug: false, logger: false } });
      });
    });
  });

  describeSelectors(Recent, MOCK_STATE, (utils) => {
    describe('recentTestingSelector()', () => {
      it('should select the test tool configuration', () => {
        utils.select(Recent.recentTestingSelector, TEST_CONFIG);
      });
    });
  });
});
