import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import _differenceWith from 'lodash/differenceWith';
import _isEqual from 'lodash/isEqual';
import _pick from 'lodash/pick';
import * as Normal from 'normal-store';

import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as SlotV2 from '@/ducks/slotV2';
import * as Tracking from '@/ducks/tracking';
import { getActiveVersionContext } from '@/ducks/version/utils';
import { SyncThunk, Thunk } from '@/store/types';
import { inferIntentSlotsType, inferIntentSlotType, inferIntentType, removeSlotRefFromInput } from '@/utils/intent';
import { createNextName } from '@/utils/string';

import { getUniqSlots, intentProcessor } from './utils';

const NEW_INTENT_NAME = 'intent';

export const addManyIntents =
  (values: Realtime.Intent[], creationType: Tracking.CanvasCreationType): Thunk =>
  async (dispatch, getState) => {
    if (!values.length) return;

    const state = getState();
    const projectMeta = ProjectV2.active.metaSelector(state);
    const intents = values.map(intentProcessor.bind(null, projectMeta.type));

    await dispatch.sync(Realtime.intent.crud.addMany({ ...getActiveVersionContext(getState()), values: intents, projectMeta }));
    dispatch(Tracking.trackIntentCreated({ creationType }));
  };

export const patchIntent =
  (id: string, data: Partial<Realtime.Intent>): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const projectMeta = ProjectV2.active.metaSelector(state);
    const intentSlotFactory = Realtime.Utils.slot.intentSlotFactoryCreator(projectMeta.type);

    if (!data.inputs) {
      dispatch.sync(Realtime.intent.crud.patch({ ...getActiveVersionContext(getState()), key: id, value: data, projectMeta }));
      return;
    }

    const intent = IntentV2.intentByIDSelector(state, { id });
    if (!intent) return;

    const { slots: { byKey = {}, allKeys = [] } = {}, inputs: oldInputs } = intent;

    const oldInputSlots = getUniqSlots(oldInputs);
    const newInputSlots = getUniqSlots(data.inputs);

    const slotsToRemove = _differenceWith(oldInputSlots, newInputSlots, _isEqual);

    const supersetKeys = [...new Set([...newInputSlots, ...allKeys])].filter((key) => !slotsToRemove.includes(key));

    const newKeys = supersetKeys.filter((slotID) => !allKeys.includes(slotID));

    let updatedByKey = _pick(byKey, supersetKeys);

    updatedByKey = newKeys.reduce((obj, slotID) => Object.assign(obj, { [slotID]: intentSlotFactory({ id: slotID }) }), updatedByKey);

    const patchedIntent = inferIntentType({
      ...data,
      slots: inferIntentSlotsType({ byKey: updatedByKey, allKeys: [...supersetKeys] }),
    });

    dispatch.sync(Realtime.intent.crud.patch({ ...getActiveVersionContext(getState()), key: id, value: patchedIntent, projectMeta }));
  };

export const addRequiredSlot =
  (intentID: string, slotID: string): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();

    const projectMeta = ProjectV2.active.metaSelector(state);
    const intentSlotFactory = Realtime.Utils.slot.intentSlotFactoryCreator(projectMeta.type);

    const intent = IntentV2.intentByIDSelector(state, { id: intentID });
    if (!intent) return;

    const { slots = Normal.createEmpty() } = intent;

    if (Normal.getOne(intent.slots, slotID)?.required) return;

    const byKeys = {
      ...slots.byKey,
      [slotID]: {
        ...(Normal.getOne(intent.slots, slotID) ?? intentSlotFactory({ id: slotID })),
        required: true,
      },
    };

    const allKeys = [...intent.slots.allKeys.filter((id) => id !== slotID), slotID];
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
  (id: string, slotID: string, dialog: Partial<Realtime.IntentSlotDialog>): SyncThunk =>
  (dispatch, getState) => {
    const intent = IntentV2.intentByIDSelector(getState(), { id });
    if (!intent) return;

    const slot = Utils.normalized.getNormalizedByKey(intent.slots, slotID);

    dispatch(patchIntentSlot(id, slotID, inferIntentSlotType({ dialog: { ...slot.dialog, ...dialog } as Realtime.IntentSlotDialog })));
  };

export const reorderIntentSlots =
  (id: string, newAllKeys: string[]): SyncThunk =>
  (dispatch, getState) => {
    const intent = IntentV2.intentByIDSelector(getState(), { id });
    if (!intent) return;

    dispatch(patchIntent(id, inferIntentType({ slots: { ...intent.slots, allKeys: newAllKeys } })));
  };

export const createIntent =
  (creationType: Tracking.CanvasCreationType, intent?: Partial<Realtime.Intent>): Thunk<string> =>
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

    dispatch(Tracking.trackIntentCreated({ creationType }));

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

export const deleteManyIntents =
  (intentIDs: string[]): Thunk =>
  async (dispatch, getState) => {
    const projectMeta = ProjectV2.active.metaSelector(getState());
    await dispatch.sync(
      Realtime.intent.crud.removeMany({
        ...getActiveVersionContext(getState()),
        keys: intentIDs,
        projectMeta,
      })
    );
  };

export const refreshIntents = (): Thunk => async (dispatch, getState) => {
  const projectMeta = ProjectV2.active.metaSelector(getState());
  await dispatch.sync(
    Realtime.intent.crud.refresh({
      ...getActiveVersionContext(getState()),
      projectMeta,
    })
  );
};
