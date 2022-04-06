import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import _pick from 'lodash/pick';
import * as Normal from 'normal-store';

import { FeatureFlag } from '@/config/features';
import * as Feature from '@/ducks/feature';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as SlotV2 from '@/ducks/slotV2';
import { getActiveVersionContext } from '@/ducks/version/utils';
import { SyncThunk, Thunk } from '@/store/types';
import { inferIntentSlotsType, inferIntentSlotType, inferIntentType, removeSlotRefFromInput } from '@/utils/intent';
import { createNextName } from '@/utils/string';

import { getProjectTypeNewSlotsCreator, getUniqSlots, intentProcessor } from './utils';

const NEW_INTENT_NAME = 'intent';

export const addManyIntents =
  (values: Realtime.Intent[]): Thunk =>
  async (dispatch, getState) => {
    if (!values.length) return;

    const state = getState();
    const projectMeta = ProjectV2.active.metaSelector(state);
    const intents = values.map(intentProcessor.bind(null, projectMeta.type));

    await dispatch.sync(Realtime.intent.crud.addMany({ ...getActiveVersionContext(getState()), values: intents, projectMeta }));
  };

export const patchIntent =
  (id: string, data: Partial<Realtime.Intent>): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const projectMeta = ProjectV2.active.metaSelector(state);
    const newSlotsCreator = getProjectTypeNewSlotsCreator(projectMeta.type);

    if (!data.inputs) {
      dispatch.sync(Realtime.intent.crud.patch({ ...getActiveVersionContext(getState()), key: id, value: data, projectMeta }));
      return;
    }

    const nluModals = Feature.featureSelector(state)(FeatureFlag.IMM_MODALS_V2);
    if (nluModals.isEnabled) {
      const intent = IntentV2.intentByIDSelector(state, { id });
      if (!intent) return;

      const { slots: { byKey = {}, allKeys = [] } = {} } = intent;
      const uniqueInputSlots = getUniqSlots(data.inputs);
      const supersetKeys = [...new Set([...uniqueInputSlots, ...allKeys])];

      const newKeys = supersetKeys.filter((slotID) => !allKeys.includes(slotID));

      let updatedByKey = _pick(byKey, supersetKeys);

      updatedByKey = newKeys.reduce((obj, slotID) => Object.assign(obj, { [slotID]: newSlotsCreator(slotID) }), updatedByKey);

      const patchedIntent = inferIntentType({
        ...data,
        slots: inferIntentSlotsType({ byKey: updatedByKey, allKeys: [...supersetKeys] }),
      });

      dispatch.sync(Realtime.intent.crud.patch({ ...getActiveVersionContext(getState()), key: id, value: patchedIntent, projectMeta }));
    } else {
      if (!data.inputs) {
        dispatch.sync(Realtime.intent.crud.patch({ ...getActiveVersionContext(getState()), key: id, value: data, projectMeta }));
        return;
      }

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

      dispatch.sync(Realtime.intent.crud.patch({ ...getActiveVersionContext(getState()), key: id, value: patchedIntent, projectMeta }));
    }
  };

export const addRequiredSlot =
  (intentID: string, slotID: string): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const nluModals = Feature.featureSelector(state)(FeatureFlag.IMM_MODALS_V2);

    const projectMeta = ProjectV2.active.metaSelector(state);
    const newSlotsCreator = getProjectTypeNewSlotsCreator(projectMeta.type);

    const intent = IntentV2.intentByIDSelector(state, { id: intentID });
    if (!intent) return;

    const { slots = Normal.createEmpty() } = intent;

    if (Normal.getOne(intent.slots, slotID)?.required) return;

    const byKeys = {
      ...slots.byKey,
      [slotID]: {
        ...(Normal.getOne(intent.slots, slotID) ?? newSlotsCreator(slotID)),
        required: true,
      },
    };

    let allKeys = [...intent.slots.allKeys, slotID];
    if (nluModals.isEnabled) {
      allKeys = [...intent.slots.allKeys.filter((id) => id !== slotID), slotID];
    }

    const patchedIntent = inferIntentType({
      slots: inferIntentSlotsType({ byKey: byKeys, allKeys: Utils.array.unique(allKeys) }),
    });

    dispatch.sync(Realtime.intent.crud.patch({ ...getActiveVersionContext(getState()), key: intentID, value: patchedIntent, projectMeta }));
  };

export const removeRequiredSlot =
  (intentID: string, slotID: string): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const intent = IntentV2.intentByIDSelector(state, { id: intentID });
    const projectMeta = ProjectV2.active.metaSelector(state);

    if (!intent?.slots?.byKey?.[slotID]) return;

    const utteranceSlots = getUniqSlots(intent.inputs);

    if (utteranceSlots.includes(slotID)) {
      const patchedIntent = inferIntentType({
        slots: Normal.patchOne(intent.slots, slotID, { required: false }),
      });
      dispatch.sync(Realtime.intent.crud.patch({ ...getActiveVersionContext(getState()), key: intentID, value: patchedIntent, projectMeta }));
    } else {
      const patchedIntent = inferIntentType({
        slots: Normal.removeOne(intent.slots, slotID),
      });
      dispatch.sync(Realtime.intent.crud.patch({ ...getActiveVersionContext(getState()), key: intentID, value: patchedIntent, projectMeta }));
    }
  };

export const patchIntentSlot =
  (id: string, slotID: string, data: Partial<Realtime.IntentSlot>): SyncThunk =>
  (dispatch, getState) => {
    const intent = IntentV2.intentByIDSelector(getState(), { id });
    if (!intent) return;

    dispatch(patchIntent(id, inferIntentType({ slots: Normal.patchOne(intent.slots, slotID, data) })));
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

    dispatch(patchIntent(id, inferIntentType({ slots: Normal.removeOne(slots, slotID), inputs: sanitizedInputs })));
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
  (intent?: Partial<Realtime.Intent>): Thunk<string> =>
  async (dispatch, getState) => {
    const id = intent?.id || Utils.id.cuid.slug();
    const state = getState();
    const platform = intent?.platform || ProjectV2.active.platformSelector(state);
    const projectType = ProjectV2.active.projectTypeSelector(state);

    const name =
      intent?.name ||
      createNextName(
        NEW_INTENT_NAME,
        IntentV2.allIntentsSelector(state).map(({ name }) => name),
        platform
      );
    const slots = intent?.slots || { byKey: {}, allKeys: [] };
    const inputs = intent?.inputs || [];
    const processedIntent = intentProcessor(projectType, inferIntentType({ id, name, slots, inputs, platform }));

    await dispatch.sync(
      Realtime.intent.crud.add({
        ...getActiveVersionContext(getState()),
        key: id,
        value: processedIntent,
        projectMeta: {
          platform,
          type: projectType,
        },
      })
    );

    return id;
  };

export const deleteIntent =
  (intentID: string): Thunk =>
  async (dispatch, getState) => {
    const projectMeta = ProjectV2.active.metaSelector(getState());

    await dispatch.sync(
      Realtime.intent.crud.remove({
        ...getActiveVersionContext(getState()),
        key: intentID,
        projectMeta,
      })
    );
  };
