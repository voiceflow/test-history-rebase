import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import _pick from 'lodash/pick';

import { FeatureFlag } from '@/config/features';
import * as Feature from '@/ducks/feature';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as SlotV2 from '@/ducks/slotV2';
import { getActiveVersionContext } from '@/ducks/version/utils';
import { SyncThunk, Thunk } from '@/store/types';
import { inferIntentSlotsType, inferIntentSlotType, inferIntentType, removeSlotRefFromInput } from '@/utils/intent';
import { createNextName } from '@/utils/string';

import { crud } from './actions';
import { getPlatformNewSlotsCreator, getUniqSlots, intentProcessor } from './utils';

const NEW_INTENT_NAME = 'intent';

export const addManyIntents =
  (values: Realtime.Intent[]): Thunk =>
  async (dispatch, getState) => {
    if (!values.length) return;

    const state = getState();
    const platform = ProjectV2.active.platformSelector(state);
    const intents = values.map(intentProcessor.bind(null, platform));

    await dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          dispatch(crud.addMany(intents));
        },
        async (context) => {
          await dispatch.sync(Realtime.intent.crud.addMany({ ...context, values: intents }));
        }
      )
    );
  };

/**
 * @deprecated replace operations will only be pushed from the server moving forward
 */
export const replaceIntents =
  (values: Realtime.Intent[], meta?: any): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const platform = ProjectV2.active.platformSelector(state);
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);

    if (isAtomicActions) return;

    dispatch(crud.replace(values.map(intentProcessor.bind(null, platform)), meta));
  };

export const patchIntent =
  (id: string, data: Partial<Realtime.Intent>): SyncThunk =>
  (dispatch, getState) => {
    if (!data.inputs) {
      dispatch(
        Feature.applyAtomicSideEffect(
          getActiveVersionContext,
          () => {
            dispatch(crud.patch(id, data));
          },
          (context) => {
            dispatch.sync(Realtime.intent.crud.patch({ ...context, key: id, value: data }));
          }
        )
      );
      return;
    }

    const state = getState();
    const platform = ProjectV2.active.platformSelector(state);
    const newSlotsCreator = getPlatformNewSlotsCreator(platform);

    const intent = IntentV2.intentByIDSelector(state, { id });
    if (!intent) return;

    const { slots: { byKey = {}, allKeys = [] } = {} } = intent;
    const uniqSlots = getUniqSlots(data.inputs);

    const keysWithoutRemoved = allKeys.filter((slotID) => uniqSlots.includes(slotID));
    const keysToAdd = uniqSlots.filter((slotID) => !allKeys.includes(slotID));

    let newByKey = _pick(byKey, keysWithoutRemoved);

    newByKey = keysToAdd.reduce((obj, slotID) => Object.assign(obj, { [slotID]: newSlotsCreator(slotID) }), newByKey);

    const patchedIntent = inferIntentType({
      ...data,
      slots: inferIntentSlotsType({ byKey: newByKey, allKeys: [...keysWithoutRemoved, ...keysToAdd] }),
    });

    dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        () => {
          dispatch(crud.patch(id, patchedIntent));
        },
        (context) => {
          dispatch.sync(Realtime.intent.crud.patch({ ...context, key: id, value: patchedIntent }));
        }
      )
    );
  };

export const patchIntentSlot =
  (id: string, slotID: string, data: Partial<Realtime.IntentSlot>): SyncThunk =>
  (dispatch, getState) => {
    const intent = IntentV2.intentByIDSelector(getState(), { id });
    if (!intent) return;

    dispatch(patchIntent(id, inferIntentType({ slots: Utils.normalized.patchNormalizedByKey(intent.slots, slotID, data) })));
  };

export const removeIntentSlot =
  (id: string, slotID: string): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const intent = IntentV2.intentByIDSelector(state, { id });
    if (!intent) return;

    const { slots, inputs } = intent;

    const sanitizedInputs: Realtime.IntentInput[] = inputs.map((input: Realtime.IntentInput) => {
      if (input?.slots && input.slots.length > 0) {
        const slotDetails = SlotV2.slotByIDSelector(state, { id: slotID });

        if (!slotDetails) return input;

        return {
          text: removeSlotRefFromInput(input.text, slotDetails),
          slots: input.slots.filter((slot) => slot !== slotID),
        };
      }

      return input;
    });

    dispatch(patchIntent(id, inferIntentType({ slots: Utils.normalized.removeNormalizedByKey(slots, slotID), inputs: sanitizedInputs })));
  };

export const updateIntentSlotDialog =
  (id: string, slotID: string, dialog: Realtime.IntentSlotDialog): SyncThunk =>
  (dispatch, getState) => {
    const intent = IntentV2.intentByIDSelector(getState(), { id });
    if (!intent) return;

    const slot = Utils.normalized.getNormalizedByKey(intent.slots, slotID);

    dispatch(patchIntentSlot(id, slotID, inferIntentSlotType({ dialog: { ...slot.dialog, ...dialog } })));
  };

export const reorderIntentSlots =
  (id: string, newAllKeys: string[]): SyncThunk =>
  (dispatch, getState) => {
    const intent = IntentV2.intentByIDSelector(getState(), { id });
    if (!intent) return;

    dispatch(patchIntent(id, inferIntentType({ slots: { ...intent.slots, allKeys: newAllKeys } })));
  };

export const createIntent =
  (intent?: Partial<Realtime.Intent>): SyncThunk<string> =>
  (dispatch, getState) => {
    const id = intent?.id || Utils.id.cuid.slug();
    const state = getState();
    const platform = intent?.platform || ProjectV2.active.platformSelector(state);

    const name =
      intent?.name ||
      createNextName(
        NEW_INTENT_NAME,
        IntentV2.allIntentsSelector(state).map(({ name }) => name),
        platform
      );
    const slots = intent?.slots || { byKey: {}, allKeys: [] };
    const inputs = intent?.inputs || [];
    const processedIntent = intentProcessor(platform, inferIntentType({ id, name, slots, inputs, platform }));

    dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          dispatch(crud.add(id, processedIntent));
        },
        async (context) => {
          await dispatch.sync(Realtime.intent.crud.add({ ...context, key: id, value: processedIntent }));
        }
      )
    );

    return id;
  };

export const deleteIntent =
  (intentID: string): Thunk =>
  (dispatch) =>
    dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          dispatch(crud.remove(intentID));
        },
        async (context) => {
          await dispatch.sync(Realtime.intent.crud.remove({ ...context, key: intentID }));
        }
      )
    );
