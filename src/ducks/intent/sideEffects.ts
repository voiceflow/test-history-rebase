import cuid from 'cuid';
import _pick from 'lodash/pick';

import { activePlatformSelector } from '@/ducks/skill/skill/selectors';
import { createCRUDActionCreators } from '@/ducks/utils/crud';
import { Intent, IntentSlot, IntentSlotDialog } from '@/models';
import { SyncThunk, Thunk } from '@/store/types';
import { getNormalizedByKey, patchNormalizedByKey } from '@/utils/normalized';
import { createNextName } from '@/utils/string';

import { addIntent } from './actions';
import { STATE_KEY } from './constants';
import { allIntentsSelector, intentByIDSelector } from './selectors';
import { getUniqSlots, newSlotsCreator } from './utils';

const NEW_INTENT_NAME = 'intent';
const { update } = createCRUDActionCreators<Intent>(STATE_KEY);

export const updateIntent: {
  (id: string, data: Intent, patch?: false): SyncThunk;
  (id: string, data: Partial<Intent>, patch: true): SyncThunk;
} = (id: string, data: Partial<Intent>, patch?: boolean): Thunk => (dispatch, getState) => {
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
        patch as any
      )
    );
  }

  return dispatch(update(id, data, patch as any));
};

export const updateIntentSlot = (id: string, slotId: string, data: Partial<IntentSlot>): SyncThunk => (dispatch, getState) => {
  const { slots } = intentByIDSelector(getState())(id);

  return dispatch(updateIntent(id, { slots: patchNormalizedByKey<IntentSlot>(slots, slotId, data) }, true));
};

export const updateIntentSlotDialog = (id: string, slotId: string, dialog: IntentSlotDialog): SyncThunk => (dispatch, getState) => {
  const { slots } = intentByIDSelector(getState())(id);
  const slot = getNormalizedByKey(slots, slotId);

  return dispatch(updateIntentSlot(id, slotId, { dialog: { ...slot.dialog, ...dialog } }));
};

export const reorderIntentSlots = (id: string, newAllKeys: string[]): SyncThunk => (dispatch, getState) => {
  const { slots } = intentByIDSelector(getState())(id);

  return dispatch(updateIntent(id, { slots: { ...slots, allKeys: newAllKeys } }, true));
};

export const newIntent = (intent?: Partial<Intent>): SyncThunk<string> => (dispatch, getState) => {
  const id = intent?.id || cuid.slug();
  const name =
    intent?.name ||
    createNextName(
      NEW_INTENT_NAME,
      allIntentsSelector(getState()).map(({ name }) => name)
    );
  const slots = intent?.slots || { byKey: {}, allKeys: [] };
  const inputs = intent?.inputs || [];
  const platform = intent?.platform || activePlatformSelector(getState());

  dispatch(addIntent(id, { id, name, slots, inputs, platform }));

  return id;
};
