import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as Feature from '@/ducks/feature';
import * as Slot from '@/ducks/slot';
import * as SlotV2 from '@/ducks/slotV2';
import { createCRUDState, CRUDState } from '@/ducks/utils/crud';

import suite from './_suite';

const SLOT_ID = Utils.generate.id();
const SLOT_NAME = Utils.generate.string();
const SLOT = { id: SLOT_ID, name: SLOT_NAME } as Realtime.Slot;
const MOCK_STATE: CRUDState<Realtime.Slot> = {
  byKey: {
    [SLOT_ID]: SLOT,
  },
  allKeys: [SLOT_ID],
};

suite(Slot, MOCK_STATE)('Ducks - Slot', ({ expect, describeCRUDReducer, describeSelectors }) => {
  describeCRUDReducer();

  describeSelectors(({ select }) => {
    describe('slotNamesSelector()', () => {
      it('should select all slot names', () => {
        expect(
          select(SlotV2.slotNamesSelector, {
            [SlotV2.STATE_KEY]: createCRUDState(),
            [Feature.STATE_KEY]: { features: {} },
          })
        ).to.eql([SLOT_NAME]);
      });
    });
  });
});
