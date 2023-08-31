import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import _differenceWith from 'lodash/differenceWith';
import _isEqual from 'lodash/isEqual';
import _pick from 'lodash/pick';
import * as Normal from 'normal-store';

import * as ProjectV2 from '@/ducks/projectV2';
import * as SlotV2 from '@/ducks/slotV2';
import * as Tracking from '@/ducks/tracking';
import * as VersionV2 from '@/ducks/versionV2';
import { getActiveVersionContext } from '@/ducks/versionV2/utils';
import { SyncThunk, Thunk } from '@/store/types';
import { getUniqSlots, intentProcessorFactory, NEW_INTENT_NAME, removeSlotRefFromInput } from '@/utils/intent';
import { createNextName } from '@/utils/string';

import { allIntentsSelector, intentByIDSelector } from './selectors';

export const addManyIntents =
  (values: Platform.Base.Models.Intent.Model[], creationType: Tracking.CanvasCreationType): Thunk =>
  async (dispatch, getState) => {
    if (!values.length) return;

    const state = getState();
    const projectMeta = ProjectV2.active.metaSelector(state);
    const projectConfig = Platform.Config.getTypeConfig(projectMeta);

    await dispatch.sync(
      Realtime.intent.crud.addMany({
        ...getActiveVersionContext(getState()),
        values: values.map(intentProcessorFactory(projectConfig)),
        projectMeta,
      })
    );

    dispatch(Tracking.trackIntentCreated({ creationType }));
  };

export const patchIntent =
  (id: string, data: Partial<Platform.Base.Models.Intent.Model>): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();

    const projectMeta = ProjectV2.active.metaSelector(state);
    const projectConfig = Platform.Config.getTypeConfig(projectMeta);

    if (!data.inputs) {
      dispatch.sync(Realtime.intent.crud.patch({ ...getActiveVersionContext(getState()), key: id, value: data, projectMeta }));
      return;
    }

    const intent = intentByIDSelector(state, { id });
    if (!intent) return;

    const { slots: { byKey = {}, allKeys = [] } = {}, inputs: oldInputs } = intent;

    const oldInputSlots = getUniqSlots(oldInputs);
    const newInputSlots = getUniqSlots(data.inputs);

    const slotsToRemove = _differenceWith(oldInputSlots, newInputSlots, _isEqual);

    const supersetKeys = [...new Set([...newInputSlots, ...allKeys])].filter((key) => !slotsToRemove.includes(key));

    const newKeys = supersetKeys.filter((slotID) => !allKeys.includes(slotID));

    let updatedByKey = _pick(byKey, supersetKeys);

    updatedByKey = newKeys.reduce(
      (obj, slotID) => Object.assign(obj, { [slotID]: projectConfig.utils.intent.slotFactory({ id: slotID }) }),
      updatedByKey
    );

    dispatch.sync(
      Realtime.intent.crud.patch({
        ...getActiveVersionContext(getState()),
        key: id,
        value: { ...data, slots: { byKey: updatedByKey, allKeys: [...supersetKeys] } },
        projectMeta,
      })
    );
  };

export const addRequiredSlot =
  (intentID: string, slotID: string): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();

    const projectMeta = ProjectV2.active.metaSelector(state);
    const defaultVoice = VersionV2.active.voice.defaultVoiceSelector(state);
    const projectConfig = Platform.Config.getTypeConfig(projectMeta);

    const intent = intentByIDSelector(state, { id: intentID });
    if (!intent) return;

    const { slots = Normal.createEmpty() } = intent;

    if (Normal.getOne(intent.slots, slotID)?.required) return;

    const intentSlot = Normal.getOne(intent.slots, slotID) ?? projectConfig.utils.intent.slotFactory({ id: slotID });

    const byKeys: Record<string, Platform.Base.Models.Intent.Slot> = {
      ...slots.byKey,
      [slotID]: {
        ...intentSlot,
        dialog: {
          ...intentSlot.dialog,
          prompt: intentSlot.dialog.prompt.length ? intentSlot.dialog.prompt : [projectConfig.utils.intent.promptFactory({ defaultVoice })],
        },
        required: true,
      },
    };

    const allKeys = [...intent.slots.allKeys.filter((id) => id !== slotID), slotID];

    dispatch.sync(
      Realtime.intent.crud.patch({
        ...getActiveVersionContext(getState()),
        key: intentID,
        value: { slots: { byKey: byKeys, allKeys: Utils.array.unique(allKeys) } },
        projectMeta,
      })
    );
  };

export const removeRequiredSlot =
  (intentID: string, slotID: string): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const intent = intentByIDSelector(state, { id: intentID });
    const projectMeta = ProjectV2.active.metaSelector(state);

    if (!intent?.slots?.byKey?.[slotID]) return;

    const utteranceSlots = getUniqSlots(intent.inputs);

    if (utteranceSlots.includes(slotID)) {
      dispatch.sync(
        Realtime.intent.crud.patch({
          ...getActiveVersionContext(getState()),
          key: intentID,
          value: { slots: Normal.patchOne(intent.slots, slotID, { required: false }) },
          projectMeta,
        })
      );
    } else {
      dispatch.sync(
        Realtime.intent.crud.patch({
          ...getActiveVersionContext(getState()),
          key: intentID,
          value: { slots: Normal.removeOne(intent.slots, slotID) },
          projectMeta,
        })
      );
    }
  };

export const patchIntentSlot =
  (id: string, slotID: string, data: Partial<Platform.Base.Models.Intent.Slot>): SyncThunk =>
  (dispatch, getState) => {
    const intent = intentByIDSelector(getState(), { id });
    if (!intent) return;

    dispatch(patchIntent(id, { slots: Normal.patchOne(intent.slots, slotID, data) }));
  };

export const removeIntentSlot =
  (id: string, slotID: string): SyncThunk =>
  (dispatch, getState) => {
    const state = getState();
    const intent = intentByIDSelector(state, { id });
    if (!intent) return;

    const { slots, inputs } = intent;

    const sanitizedInputs = inputs.map<Platform.Base.Models.Intent.Input>((input) => {
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

    dispatch(patchIntent(id, { slots: Normal.removeOne(slots, slotID), inputs: sanitizedInputs }));
  };

export const updateIntentSlotDialog =
  (id: string, slotID: string, dialog: Partial<Platform.Base.Models.Intent.SlotDialog>): SyncThunk =>
  (dispatch, getState) => {
    const intent = intentByIDSelector(getState(), { id });
    if (!intent) return;

    const slot = Normal.getOne(intent.slots, slotID);
    if (!slot) return;

    dispatch(patchIntentSlot(id, slotID, { dialog: { ...slot.dialog, ...dialog } }));
  };

export const reorderIntentSlots =
  (id: string, newAllKeys: string[]): SyncThunk =>
  (dispatch, getState) => {
    const intent = intentByIDSelector(getState(), { id });
    if (!intent) return;

    dispatch(patchIntent(id, { slots: { ...intent.slots, allKeys: newAllKeys } }));
  };

export const createIntent =
  (creationType: Tracking.CanvasCreationType, intent?: Partial<Platform.Base.Models.Intent.Model>): Thunk<string> =>
  async (dispatch, getState) => {
    const id = intent?.id || Utils.id.cuid.slug();
    const state = getState();
    const projectMeta = ProjectV2.active.metaSelector(state);
    const projectConfig = Platform.Config.getTypeConfig(projectMeta);

    const name =
      intent?.name ||
      createNextName(
        NEW_INTENT_NAME,
        allIntentsSelector(state).map(({ name }) => name),
        projectMeta.platform
      );
    const slots = intent?.slots || { byKey: {}, allKeys: [] };
    const inputs = intent?.inputs || [];
    const processedIntent = intentProcessorFactory(projectConfig)({ id, name, slots, inputs });

    await dispatch.sync(
      Realtime.intent.crud.add({
        ...getActiveVersionContext(getState()),
        key: id,
        value: processedIntent,
        projectMeta,
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
