import { generate } from '@voiceflow/ui';

import * as Feature from '@/ducks/feature';
import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import { createCRUDState, CRUDState } from '@/ducks/utils/crud';
import * as Models from '@/models';
import { normalize } from '@/utils/normalized';

import suite from './_suite';

const INTENT_ID = generate.id();
const SLOT_NAME = generate.string();
const INTENT = { id: INTENT_ID, name: SLOT_NAME } as Models.Intent;
const MOCK_STATE: CRUDState<Models.Intent> = {
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
        const slotID = generate.id();
        const intentWithSlot = generate.array(3, () => ({ id: generate.id(), slots: { allKeys: [slotID, ...generate.array()] } }));
        const intentWithoutSlot = generate.array(3, () => ({ id: generate.id(), slots: { allKeys: generate.array() } }));

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
