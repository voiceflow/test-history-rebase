import * as Realtime from '@voiceflow/realtime-sdk';

import * as Tracking from '@/ducks/tracking';
import { getActiveVersionContext } from '@/ducks/version/utils';
import { Thunk } from '@/store/types';

import createCRUDReducer, { createCRUDActionCreators, createCRUDSelectors } from './utils/crud';

export const STATE_KEY = 'slot';

const slotReducer = createCRUDReducer<Realtime.Slot>(STATE_KEY);

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
  (slotID: string, slot: Realtime.Slot): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.slot.crud.add({ ...getActiveVersionContext(getState()), key: slotID, value: slot }));
  };

export const addManySlots =
  (slots: Realtime.Slot[]): Thunk =>
  async (dispatch, getState) => {
    if (!slots.length) return;

    await dispatch.sync(Realtime.slot.crud.addMany({ ...getActiveVersionContext(getState()), values: slots }));
  };

export const patchSlot =
  (slotID: string, data: Partial<Realtime.Slot>, creationType: Tracking.NLUEntityCreationType): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.slot.crud.patch({ ...getActiveVersionContext(getState()), key: slotID, value: data }));
    dispatch(Tracking.trackNLUEntityEdit({ creationType }));
  };

export const refreshSlots = (): Thunk => async (dispatch, getState) => {
  await dispatch.sync(Realtime.slot.crud.refresh({ ...getActiveVersionContext(getState()) }));
};

export const deleteSlot =
  (slotID: string): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.slot.crud.removeMany({ ...getActiveVersionContext(getState()), keys: [slotID] }));
  };

export const deleteSlots =
  (slotIDs: string[]): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.slot.crud.removeMany({ ...getActiveVersionContext(getState()), keys: slotIDs }));
  };
