import * as Intent from '@/ducks/intent';
import * as Slot from '@/ducks/slot';
import { CRUDState } from '@/ducks/utils/crud';
import * as Models from '@/models';
import { normalize } from '@/utils/normalized';
import { generate } from '@/utils/testing';

import suite from './_suite';

const SLOT_ID = generate.id();
const SLOT_NAME = generate.string();
const SLOT = { id: SLOT_ID, name: SLOT_NAME } as Models.Slot;
const MOCK_STATE: CRUDState<Models.Slot> = {
  byKey: {
    [SLOT_ID]: SLOT,
  },
  allKeys: [SLOT_ID],
};

suite(Slot, MOCK_STATE)('Ducks - Slot', ({ expect, describeCRUDReducer, describeSelectors }) => {
  describeCRUDReducer();

  describeSelectors(({ select }) => {
    describe('intentsUsingSlotSelector()', () => {
      it('should select intents using a slot by ID', () => {
        const slotID = generate.id();
        const intentWithSlot = generate.array(3, () => ({ id: generate.id(), slots: { allKeys: [slotID, ...generate.array()] } }));
        const intentWithoutSlot = generate.array(3, () => ({ id: generate.id(), slots: { allKeys: generate.array() } }));

        expect(
          select(Slot.intentsUsingSlotSelector, {
            [Intent.STATE_KEY]: normalize([...intentWithSlot, ...intentWithoutSlot]),
          })(slotID)
        ).to.eql(intentWithSlot);
      });
    });

    describe('slotNamesSelector()', () => {
      it('should select all slot names', () => {
        expect(select(Slot.slotNamesSelector)).to.eql([SLOT_NAME]);
      });
    });
  });
});
