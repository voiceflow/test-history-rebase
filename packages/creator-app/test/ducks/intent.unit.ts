import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { normalize } from 'normal-store';

import * as Feature from '@/ducks/feature';
import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import { createCRUDState, CRUDState } from '@/ducks/utils/crud';

import suite from './_suite';

const INTENT_ID = Utils.generate.id();
const SLOT_NAME = Utils.generate.string();
const INTENT = { id: INTENT_ID, name: SLOT_NAME } as Realtime.Intent;
const MOCK_STATE: CRUDState<Realtime.Intent> = {
  byKey: {
    [INTENT_ID]: INTENT,
  },
  allKeys: [INTENT_ID],
};

suite(Intent, MOCK_STATE)('Ducks - Intent', ({ expect, describeCRUDReducer, describeSelectors }) => {
  describeCRUDReducer();

  describeSelectors(({ select }) => {
    describe('intentsUsingSlotSelector()', () => {
      it('should select intents using a slot by ID', () => {
        const slotID = Utils.generate.id();
        const intentWithSlot = Utils.generate.array(3, () => ({ id: Utils.generate.id(), slots: { allKeys: [slotID, ...Utils.generate.array()] } }));
        const intentWithoutSlot = Utils.generate.array(3, () => ({ id: Utils.generate.id(), slots: { allKeys: Utils.generate.array() } }));

        expect(
          select(IntentV2.intentsUsingSlotSelector, {
            [Intent.STATE_KEY]: normalize([...intentWithSlot, ...intentWithoutSlot]),
            [IntentV2.STATE_KEY]: createCRUDState(),
            [Feature.STATE_KEY]: { features: {} },
          })(slotID)
        ).to.eql(intentWithSlot);
      });
    });
  });
});
