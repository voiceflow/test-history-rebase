import * as Realtime from '@voiceflow/realtime-sdk';

import * as Slot from '@/ducks/slotV2';

import suite from './_suite';

const SLOT_ID = 'slotID';

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

suite(Slot, MOCK_STATE)('Ducks - Slot V2', ({ createState }) => {
  describe('selectors', () => {
    describe('allSlotsSelector()', () => {
      it('select all slots', () => {
        const result = Slot.allSlotsSelector(createState(MOCK_STATE));

        expect(result).toEqual([SLOT, MOCK_STATE.byKey.abc]);
      });
    });

    describe('allSlotIDsSelector()', () => {
      it('select all slot IDs', () => {
        const result = Slot.allSlotIDsSelector(createState(MOCK_STATE));

        expect(result).toBe(MOCK_STATE.allKeys);
      });
    });

    describe('slotMapSelector()', () => {
      it('select slot map', () => {
        const result = Slot.slotMapSelector(createState(MOCK_STATE));

        expect(result).toBe(MOCK_STATE.byKey);
      });
    });

    describe('slotByIDSelector()', () => {
      it('select known slot', () => {
        const result = Slot.slotByIDSelector(createState(MOCK_STATE), { id: SLOT_ID });

        expect(result).toBe(SLOT);
      });

      it('select unknown slot', () => {
        const result = Slot.slotByIDSelector(createState(MOCK_STATE), { id: 'foo' });

        expect(result).toBeNull();
      });
    });

    describe('slotsByIDsSelector()', () => {
      it('select known slots', () => {
        const result = Slot.slotsByIDsSelector(createState(MOCK_STATE), { ids: ['abc', SLOT_ID] });

        expect(result).toEqual([MOCK_STATE.byKey.abc, SLOT]);
      });

      it('select unknown slots', () => {
        const result = Slot.slotsByIDsSelector(createState(MOCK_STATE), { ids: ['foo', SLOT_ID] });

        expect(result).toEqual([SLOT]);
      });
    });

    describe('slotNamesSelector()', () => {
      it('select a list of all slot names', () => {
        const result = Slot.slotNamesSelector(createState(MOCK_STATE));

        expect(result).toEqual(['slot', 'alphabet slot']);
      });
    });
  });
});
