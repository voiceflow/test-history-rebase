import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { FeatureFlag } from '@/config/features';
import * as Feature from '@/ducks/feature';
import * as SlotV1 from '@/ducks/slot';
import * as Slot from '@/ducks/slotV2';

import suite from './_suite';

const SLOT_ID = 'slotID';
const DIAGRAM_ID = 'diagramID';

const SLOT: Realtime.Slot = {
  id: SLOT_ID,
  name: 'slot',
  type: null,
  inputs: [],
};

const MOCK_STATE: Slot.SlotState = {
  byKey: {
    [SLOT_ID]: SLOT,
    abc: {
      id: 'abc',
      name: 'alphabet slot',
      type: 'alpha',
      inputs: [],
    },
  },
  allKeys: [SLOT_ID, 'abc'],
};

suite(Slot, MOCK_STATE)('Ducks - Slot V2', ({ expect, createState }) => {
  describe('selectors', () => {
    const v2FeatureState = { [Feature.STATE_KEY]: { features: { [FeatureFlag.ATOMIC_ACTIONS]: { isEnabled: true } } } };

    describe('allSlotsSelector()', () => {
      it('select all slots from the legacy store', () => {
        const slots = Utils.generate.array(3, () => ({ id: Utils.generate.id() }));

        const result = Slot.allSlotsSelector(createState(MOCK_STATE, { [SlotV1.STATE_KEY]: Utils.normalized.normalize(slots) }));

        expect(result).to.eql(slots);
      });

      it('select all slots', () => {
        const result = Slot.allSlotsSelector(createState(MOCK_STATE, v2FeatureState));

        expect(result).to.eql([SLOT, MOCK_STATE.byKey.abc]);
      });
    });

    describe('allSlotIDsSelector()', () => {
      it('select all slot IDs from the legacy store', () => {
        const slots = Utils.generate.array(3, () => ({ id: Utils.generate.id() }));

        const result = Slot.allSlotIDsSelector(createState(MOCK_STATE, { [SlotV1.STATE_KEY]: Utils.normalized.normalize(slots) }));

        expect(result).to.eql(slots.map((slot) => slot.id));
      });

      it('select all slot IDs', () => {
        const result = Slot.allSlotIDsSelector(createState(MOCK_STATE, v2FeatureState));

        expect(result).to.eq(MOCK_STATE.allKeys);
      });
    });

    describe('slotMapSelector()', () => {
      it('select slot map from the legacy store', () => {
        const slotState = Utils.normalized.normalize(Utils.generate.array(3, () => ({ id: Utils.generate.id() })));

        const result = Slot.slotMapSelector(createState(MOCK_STATE, { [SlotV1.STATE_KEY]: slotState }));

        expect(result).to.eq(slotState.byKey);
      });

      it('select slot map', () => {
        const result = Slot.slotMapSelector(createState(MOCK_STATE, v2FeatureState));

        expect(result).to.eq(MOCK_STATE.byKey);
      });
    });

    describe('slotByIDSelector()', () => {
      it('select slot from the legacy store', () => {
        const slot = { id: SLOT_ID };
        const slotState = Utils.normalized.normalize([slot]);

        const result = Slot.slotByIDSelector(createState(MOCK_STATE, { [SlotV1.STATE_KEY]: slotState }), { id: SLOT_ID });

        expect(result).to.eq(slot);
      });

      it('select known slot', () => {
        const result = Slot.slotByIDSelector(createState(MOCK_STATE, v2FeatureState), { id: SLOT_ID });

        expect(result).to.eq(SLOT);
      });

      it('select unknown slot', () => {
        const result = Slot.slotByIDSelector(createState(MOCK_STATE, v2FeatureState), { id: 'foo' });

        expect(result).to.be.null;
      });
    });

    describe('getSlotByIDSelector()', () => {
      it('select slot from the legacy store', () => {
        const slot = { id: SLOT_ID };
        const slotState = Utils.normalized.normalize([slot]);

        const result = Slot.getSlotByIDSelector(createState(MOCK_STATE, { [SlotV1.STATE_KEY]: slotState }))(SLOT_ID);

        expect(result).to.eq(slot);
      });

      it('select known slot', () => {
        const result = Slot.getSlotByIDSelector(createState(MOCK_STATE, v2FeatureState))(SLOT_ID);

        expect(result).to.eq(SLOT);
      });

      it('select unknown slot', () => {
        const result = Slot.getSlotByIDSelector(createState(MOCK_STATE, v2FeatureState))('foo');

        expect(result).to.be.null;
      });
    });

    describe('slotsByIDsSelector()', () => {
      it('select slots from the legacy store', () => {
        const slot = { id: DIAGRAM_ID };
        const otherSlotID = 'foo';
        const otherSlot = { id: 'foo' };
        const slotState = Utils.normalized.normalize([otherSlot, slot]);

        const result = Slot.slotsByIDsSelector(createState(MOCK_STATE, { [SlotV1.STATE_KEY]: slotState }), {
          ids: [DIAGRAM_ID, otherSlotID],
        });

        expect(result).to.eql([slot, otherSlot]);
      });

      it('select known slots', () => {
        const result = Slot.slotsByIDsSelector(createState(MOCK_STATE, v2FeatureState), { ids: ['abc', SLOT_ID] });

        expect(result).to.eql([MOCK_STATE.byKey.abc, SLOT]);
      });

      it('select unknown slots', () => {
        const result = Slot.slotsByIDsSelector(createState(MOCK_STATE, v2FeatureState), { ids: ['foo', SLOT_ID] });

        expect(result).to.eql([SLOT]);
      });
    });

    describe('slotNamesSelector()', () => {
      it('select a list of all slot names', () => {
        const result = Slot.slotNamesSelector(createState(MOCK_STATE, v2FeatureState));

        expect(result).to.eql(['slot', 'alphabet slot']);
      });
    });
  });
});
