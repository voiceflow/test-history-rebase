import * as Realtime from '@voiceflow/realtime-sdk';

import * as CreatorV2 from '@/ducks/creatorV2';

import suite from '../../_suite';
import { MOCK_STATE } from '../_fixtures';

suite(CreatorV2, MOCK_STATE)('Ducks | Creator V2 - reset reducer', ({ expect, describeReducerV2 }) => {
  describeReducerV2(Realtime.creator.reset, ({ applyAction }) => {
    it('reset state to initial values', () => {
      const result = applyAction(MOCK_STATE);

      expect(result).to.eql(CreatorV2.INITIAL_STATE);
    });
  });
});
