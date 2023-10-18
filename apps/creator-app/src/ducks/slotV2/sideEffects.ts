import * as Realtime from '@voiceflow/realtime-sdk';

import * as Tracking from '@/ducks/tracking';
import { getActiveVersionContext } from '@/ducks/versionV2/utils';
import { Thunk } from '@/store/types';

// side effects

export const createSlot =
  (slotID: string, slot: Realtime.Slot): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.slot.crud.add({ ...getActiveVersionContext(getState()), key: slotID, value: slot }));
  };

export const patchSlot =
  (slotID: string, data: Partial<Realtime.Slot>, creationType: Tracking.NLUEntityCreationType): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.slot.crud.patch({ ...getActiveVersionContext(getState()), key: slotID, value: data }));
    dispatch(Tracking.trackNLUEntityEdit({ creationType }));
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

export const addManySlots =
  (slots: Realtime.Slot[]): Thunk =>
  async (dispatch, getState) => {
    if (!slots.length) return;

    await dispatch.sync(Realtime.slot.crud.addMany({ ...getActiveVersionContext(getState()), values: slots }));
  };

// TODO: add support for v3 entities
export const refreshSlots = (): Thunk => async (dispatch, getState) => {
  await dispatch.sync(Realtime.slot.crud.refresh({ ...getActiveVersionContext(getState()) }));
};
