import * as Realtime from '@voiceflow/realtime-sdk';

import * as Feature from '@/ducks/feature';
import { getActiveVersionContext } from '@/ducks/version/utils';
import { Slot } from '@/models';
import { Thunk } from '@/store/types';

import createCRUDReducer, { createCRUDActionCreators, createCRUDSelectors } from './utils/crud';

export const STATE_KEY = 'slot';

const slotReducer = createCRUDReducer<Slot>(STATE_KEY);

export default slotReducer;

// selectors

const slotSelectors = createCRUDSelectors(STATE_KEY);

/**
 * @deprecated
 */
export const allSlotsSelector = slotSelectors.all;
/**
 * @deprecated
 */
export const allSlotIDsSelector = slotSelectors.allIDs;
/**
 * @deprecated
 */
export const mapSlotsSelector = slotSelectors.map;
/**
 * @deprecated
 */
export const findSlotsByIDsSelector = slotSelectors.findByIDs;
/**
 * @deprecated
 */
export const slotByIDSelector = slotSelectors.byID;

// action creators

/**
 * @deprecated
 */
export const crud = createCRUDActionCreators(STATE_KEY);

// side effects

export const createSlot =
  (slotID: string, slot: Slot): Thunk =>
  (dispatch) =>
    dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          dispatch(crud.add(slotID, slot));
        },
        async (context) => {
          await dispatch.sync(Realtime.slot.crud.add({ ...context, key: slotID, value: slot }));
        }
      )
    );

export const addManySlots =
  (slots: Slot[]): Thunk =>
  async (dispatch) => {
    if (!slots.length) return;

    await dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          dispatch(crud.addMany(slots));
        },
        async (context) => {
          await dispatch.sync(Realtime.slot.crud.addMany({ ...context, values: slots }));
        }
      )
    );
  };

export const patchSlot =
  (slotID: string, data: Partial<Slot>): Thunk =>
  (dispatch) =>
    dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          dispatch(crud.patch(slotID, data));
        },
        async (context) => {
          await dispatch.sync(Realtime.slot.crud.patch({ ...context, key: slotID, value: data }));
        }
      )
    );

export const deleteSlot =
  (slotID: string): Thunk =>
  (dispatch) =>
    dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          dispatch(crud.remove(slotID));
        },
        async (context) => {
          await dispatch.sync(Realtime.slot.crud.remove({ ...context, key: slotID }));
        }
      )
    );
