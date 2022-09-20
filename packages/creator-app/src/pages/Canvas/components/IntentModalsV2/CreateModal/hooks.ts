import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';
import _differenceWith from 'lodash/differenceWith';
import _isEqual from 'lodash/isEqual';
import * as Normal from 'normal-store';
import React from 'react';

import * as Intent from '@/ducks/intent';
import { getUniqSlots } from '@/ducks/intent/utils';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Tracking from '@/ducks/tracking';
import { useDispatch, useIntentNameProcessor, useSelector } from '@/hooks';
import { applyPlatformIntentNameFormatting } from '@/utils/intent';

interface CreateIntentProps {
  onCreate?: (id: string) => void;
  initialName?: string;
  creationType: Tracking.CanvasCreationType;
}

interface CreateIntentAPI {
  name: string;
  reset: () => void;
  cancel: () => void;
  inputs: Realtime.IntentInput[];
  setName: (text: string) => void;
  onCreate: () => void;
  creating: boolean;
  setInputs: (inputs: Realtime.IntentInput[]) => void;
  intentEntities: Normal.Normalized<Realtime.IntentSlot>;
  addRequiredSlot: (slotID: string) => void;
  updateSlotDialog: (slotID: string, dialog: Partial<Realtime.IntentSlotDialog>) => void;
  removeRequiredSlot: (slotID: string) => void;
}

export const useCreateIntent = ({ creationType, initialName, onCreate }: CreateIntentProps): CreateIntentAPI => {
  const platform = useSelector(ProjectV2.active.platformSelector);
  const projectMeta = useSelector(ProjectV2.active.metaSelector);

  const intentSlotFactory = Realtime.Utils.slot.intentSlotFactoryCreator(projectMeta.type);

  const [name, setName] = React.useState(initialName || '');
  const [inputs, setInputs] = React.useState<Realtime.IntentInput[]>([]);
  const [creating, setCreating] = React.useState(false);
  const [intentEntities, setIntentEntities] = React.useState<Normal.Normalized<Realtime.IntentSlot>>(() => Normal.createEmpty());

  const intentNameProcessor = useIntentNameProcessor();

  const createIntent = useDispatch(Intent.createIntent);

  const reset = () => {
    setName('');
    setInputs([]);
    setIntentEntities(Normal.createEmpty());
    setCreating(false);
  };

  const handleSetInputs = (newInputs: Realtime.IntentInput[]) => {
    const newIntentEntities = getUniqSlots(newInputs).reduce<Realtime.IntentSlot[]>(
      (slots, slotID) => (Normal.hasOne(intentEntities, slotID) ? slots : [...slots, intentSlotFactory({ id: slotID })]),
      []
    );

    const newInputSlots = getUniqSlots(newInputs);
    const oldInputSlots = getUniqSlots(inputs);
    const slotsToRemove = _differenceWith(oldInputSlots, newInputSlots, _isEqual);
    const entitiesToSet = [...Normal.denormalize(intentEntities), ...newIntentEntities].filter((slot) => !slotsToRemove.includes(slot.id));

    setIntentEntities(Normal.normalize(entitiesToSet));
    setInputs(newInputs);
  };

  const finalizeIntentCreate = async () => {
    if (creating) return;

    const { error, formattedName } = intentNameProcessor(name);

    if (error) {
      toast.error(error);
      return;
    }

    setCreating(true);

    try {
      const newIntent = {
        name: formattedName,
        slots: intentEntities,
        inputs,
      } as Partial<Realtime.Intent>;

      const intentID = await createIntent(creationType, newIntent);

      onCreate?.(intentID);
      reset();
    } catch (e) {
      toast.error(e);
    }
  };

  const cancel = () => {
    reset();
  };

  const updateSlot = (slotID: string, data: Partial<Realtime.IntentSlot>) => {
    setIntentEntities((prevUsedSlots) => Normal.patchOne(prevUsedSlots, slotID, data));
  };

  const addRequiredSlot = (slotID: string) => {
    setIntentEntities((prevUsedSlots) => {
      if (Normal.hasOne(prevUsedSlots, slotID)) {
        return Normal.patchOne(prevUsedSlots, slotID, { required: true });
      }

      return Normal.appendOne(prevUsedSlots, slotID, { ...intentSlotFactory({ id: slotID }), required: true });
    });
  };

  const removeRequiredSlot = (slotID: string) => {
    const oldInputSlots = getUniqSlots(inputs);

    if (oldInputSlots.includes(slotID)) {
      updateSlot(slotID, { required: false });
    } else {
      setIntentEntities((prevUsedSlots) => Normal.removeOne(prevUsedSlots, slotID));
    }
  };

  const updateSlotDialog = (slotID: string, dialog: Partial<Realtime.IntentSlotDialog>) => {
    setIntentEntities((prevUsedSlots) =>
      Normal.patchOne(prevUsedSlots, slotID, {
        dialog: { ...Normal.getOne(prevUsedSlots, slotID)?.dialog, ...dialog },
      } as Partial<Realtime.IntentSlot>)
    );
  };

  return {
    name,
    reset,
    inputs,
    cancel,
    setName: (name: string) => setName(applyPlatformIntentNameFormatting(name, platform)),
    onCreate: finalizeIntentCreate,
    creating,
    setInputs: handleSetInputs,
    intentEntities,
    addRequiredSlot,
    updateSlotDialog,
    removeRequiredSlot,
  };
};
