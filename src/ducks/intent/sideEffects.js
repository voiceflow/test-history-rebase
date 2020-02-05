import _ from 'lodash';

import { createCRUDActionCreators } from '@/ducks/utils/crud';
import { getNormalizedByKey, patchNormalizedByKey } from '@/utils/normalized';

import { STATE_KEY } from './constants';
import { intentByIDSelector } from './selectors';
import { getUniqSlots, newSlotsCreator } from './utils';

const { update } = createCRUDActionCreators(STATE_KEY);

export const updateIntent = (id, data, patch) => (dispatch, getState) => {
  if (data.inputs) {
    const { slots: { byKey = [], allKeys = {} } = {} } = intentByIDSelector(getState())(id);
    const uniqSlots = getUniqSlots(data.inputs);

    const keysWithoutRemoved = allKeys.filter((slotID) => uniqSlots.includes(slotID));
    const keysToAdd = uniqSlots.filter((slotId) => !allKeys.includes(slotId));
    let newByKey = _.pick(byKey, keysWithoutRemoved);

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

export const updateIntentSlot = (id, slotId, data) => (dispatch, getState) => {
  const { slots } = intentByIDSelector(getState())(id);

  return dispatch(updateIntent(id, { slots: patchNormalizedByKey(slots, slotId, data) }, true));
};

export const updateIntentSlotDialog = (id, slotId, dialog) => (dispatch, getState) => {
  const { slots } = intentByIDSelector(getState())(id);
  const slot = getNormalizedByKey(slots, slotId);

  return dispatch(updateIntentSlot(id, slotId, { dialog: { ...slot.dialog, ...dialog } }));
};

export const reorderIntentSlots = (id, newAllKeys) => (dispatch, getState) => {
  const { slots } = intentByIDSelector(getState())(id);

  return dispatch(updateIntent(id, { slots: { ...slots, allKeys: newAllKeys } }, true));
};
