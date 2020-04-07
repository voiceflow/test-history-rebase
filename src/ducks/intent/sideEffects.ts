import _pick from 'lodash/pick';

import { createCRUDActionCreators } from '@/ducks/utils/crud';
import { Intent, IntentSlot, IntentSlotDialog } from '@/models';
import { Thunk } from '@/store/types';
import { getNormalizedByKey, patchNormalizedByKey } from '@/utils/normalized';

import { STATE_KEY } from './constants';
import { intentByIDSelector } from './selectors';
import { getUniqSlots, newSlotsCreator } from './utils';

const { update } = createCRUDActionCreators(STATE_KEY);

export const updateIntent = (id: string, data: Intent | Partial<Intent>, patch?: boolean): Thunk => (dispatch, getState) => {
  if (data.inputs) {
    const { slots: { byKey = {}, allKeys = [] } = {} } = intentByIDSelector(getState())(id);
    const uniqSlots = getUniqSlots(data.inputs);

    const keysWithoutRemoved = allKeys.filter((slotID) => uniqSlots.includes(slotID));
    const keysToAdd = uniqSlots.filter((slotId) => !allKeys.includes(slotId));
    let newByKey = _pick(byKey, keysWithoutRemoved);

    newByKey = keysToAdd.reduce((obj, slotId) => Object.assign(obj, { [slotId]: newSlotsCreator(slotId) }), newByKey);

    return dispatch(
      update(
        id,
        {
          ...data,
          slots: {
            byKey: newByKey,
            allKeys: [...keysWithoutRemoved, ...keysToAdd],
          },
        },
        patch
      )
    );
  }

  return dispatch(update(id, data, patch));
};

export const updateIntentSlot = (id: string, slotId: string, data: Partial<IntentSlot>): Thunk => (dispatch, getState) => {
  const { slots } = intentByIDSelector(getState())(id);

  return dispatch(updateIntent(id, { slots: patchNormalizedByKey<IntentSlot>(slots, slotId, data) }, true));
};

export const updateIntentSlotDialog = (id: string, slotId: string, dialog: IntentSlotDialog): Thunk => (dispatch, getState) => {
  const { slots } = intentByIDSelector(getState())(id);
  const slot = getNormalizedByKey(slots, slotId);

  return dispatch(updateIntentSlot(id, slotId, { dialog: { ...slot.dialog, ...dialog } }));
};

export const reorderIntentSlots = (id: string, newAllKeys: string[]): Thunk => (dispatch, getState) => {
  const { slots } = intentByIDSelector(getState())(id);

  return dispatch(updateIntent(id, { slots: { ...slots, allKeys: newAllKeys } }, true));
};
