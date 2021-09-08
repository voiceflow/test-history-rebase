import cuid from 'cuid';
import _pick from 'lodash/pick';

import * as Project from '@/ducks/project';
import * as Slot from '@/ducks/slot';
import { createCRUDActionCreators } from '@/ducks/utils/crud';
import { Intent, IntentInput, IntentSlot, IntentSlotDialog } from '@/models';
import { SyncThunk } from '@/store/types';
import { inferIntentSlotsType, inferIntentSlotType, inferIntentType, removeSlotRefFromInput } from '@/utils/intent';
import { getNormalizedByKey, patchNormalizedByKey, removeNormalizedByKey } from '@/utils/normalized';
import { createNextName } from '@/utils/string';

import { crudActions } from './actions';
import { STATE_KEY } from './constants';
import { allIntentsSelector, intentByIDSelector } from './selectors';
import { getPlatformNewSlotsCreator, getUniqSlots, intentProcessor } from './utils';

const NEW_INTENT_NAME = 'intent';
const { patch } = createCRUDActionCreators(STATE_KEY);

export const addIntent =
  (id: string, data: Intent): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const platform = Project.activePlatformSelector(state);

    dispatch(crudActions.add(id, intentProcessor(platform, data)));
  };

export const addIntents =
  (values: Intent[]): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const platform = Project.activePlatformSelector(state);

    dispatch(crudActions.addMany(values.map(intentProcessor.bind(null, platform))));
  };

export const replaceIntents =
  (values: Intent[], meta?: any): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const platform = Project.activePlatformSelector(state);

    dispatch(crudActions.replace(values.map(intentProcessor.bind(null, platform)), meta));
  };

export const patchIntent =
  (id: string, data: Partial<Intent>): SyncThunk =>
  (dispatch, getState) => {
    if (!data.inputs) {
      return dispatch(patch(id, data));
    }

    const state = getState();
    const platform = Project.activePlatformSelector(state);
    const newSlotsCreator = getPlatformNewSlotsCreator(platform);

    const { slots: { byKey = {}, allKeys = [] } = {} } = intentByIDSelector(state)(id);
    const uniqSlots = getUniqSlots(data.inputs);

    const keysWithoutRemoved = allKeys.filter((slotID) => uniqSlots.includes(slotID));
    const keysToAdd = uniqSlots.filter((slotID) => !allKeys.includes(slotID));

    let newByKey = _pick(byKey, keysWithoutRemoved);

    newByKey = keysToAdd.reduce((obj, slotID) => Object.assign(obj, { [slotID]: newSlotsCreator(slotID) }), newByKey);

    return dispatch(
      patch(
        id,
        inferIntentType({
          ...data,
          slots: inferIntentSlotsType({ byKey: newByKey, allKeys: [...keysWithoutRemoved, ...keysToAdd] }),
        })
      )
    );
  };

export const updateIntentSlot =
  (id: string, slotID: string, data: Partial<IntentSlot>): SyncThunk =>
  (dispatch, getState) => {
    const { slots } = intentByIDSelector(getState())(id);

    return dispatch(patchIntent(id, inferIntentType({ slots: patchNormalizedByKey(slots, slotID, data) })));
  };

export const removeIntentSlot =
  (id: string, slotID: string): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const { slots, inputs } = intentByIDSelector(state)(id);

    const sanitizedInputs: IntentInput[] = inputs.map((input: IntentInput) => {
      if (input?.slots && input.slots.length > 0) {
        const slotDetails = Slot.slotByIDSelector(state)(slotID);

        return {
          text: removeSlotRefFromInput(input.text, slotDetails),
          slots: input.slots.filter((slot) => slot !== slotID),
        };
      }

      return input;
    });

    return dispatch(patchIntent(id, inferIntentType({ slots: removeNormalizedByKey(slots, slotID), inputs: sanitizedInputs })));
  };

export const updateIntentSlotDialog =
  (id: string, slotID: string, dialog: IntentSlotDialog): SyncThunk =>
  (dispatch, getState) => {
    const { slots } = intentByIDSelector(getState())(id);
    const slot = getNormalizedByKey(slots, slotID);

    return dispatch(updateIntentSlot(id, slotID, inferIntentSlotType({ dialog: { ...slot.dialog, ...dialog } })));
  };

export const reorderIntentSlots =
  (id: string, newAllKeys: string[]): SyncThunk =>
  (dispatch, getState) => {
    const { slots } = intentByIDSelector(getState())(id);

    return dispatch(patchIntent(id, inferIntentType({ slots: { ...slots, allKeys: newAllKeys } })));
  };

export const newIntent =
  (intent?: Partial<Intent>): SyncThunk<string> =>
  (dispatch, getState) => {
    const id = intent?.id || cuid.slug();
    const state = getState();
    const platform = intent?.platform || Project.activePlatformSelector(state);

    const name =
      intent?.name ||
      createNextName(
        NEW_INTENT_NAME,
        allIntentsSelector(state).map(({ name }) => name),
        platform
      );
    const slots = intent?.slots || { byKey: {}, allKeys: [] };
    const inputs = intent?.inputs || [];

    dispatch(addIntent(id, inferIntentType({ id, name, slots, inputs, platform })));

    return id;
  };
