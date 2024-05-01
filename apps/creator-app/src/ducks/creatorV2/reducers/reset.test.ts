import * as Realtime from '@voiceflow/realtime-sdk';
import { describe, expect, it } from 'vitest';

import { createDuckTools } from '@/ducks/_suite';

import * as CreatorV2 from '..';
import { MOCK_STATE } from '../creator.fixture';

const { describeReducer } = createDuckTools(CreatorV2, MOCK_STATE);

describe('Ducks | Creator V2 - reset reducer', () => {
  describeReducer(Realtime.creator.reset, ({ applyAction }) => {
    it('reset state to initial values', () => {
      const result = applyAction(MOCK_STATE);

      expect(result).toEqual({
        ...CreatorV2.INITIAL_STATE,
        [CreatorV2.FOCUS_STATE_KEY]: CreatorV2.INITIAL_FOCUS_STATE,
        [CreatorV2.DIAGRAMS_HISTORY_STATE_KEY]: CreatorV2.INITIAL_DIAGRAMS_HISTORY_STATE,
      });
    });
  });
});
