import * as Platform from '@voiceflow/platform-config';
import { toast, useLinkedState } from '@voiceflow/ui';
import _differenceWith from 'lodash/differenceWith';
import _isEqual from 'lodash/isEqual';
import * as Normal from 'normal-store';
import React from 'react';

import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Tracking from '@/ducks/tracking';
import { useActiveProjectTypeConfig, useDispatch, useIntentNameProcessor, useSelector } from '@/hooks';
import { getErrorMessage } from '@/utils/error';
import { applyPlatformIntentNameFormatting, getUniqSlots } from '@/utils/intent';

interface CreateIntentProps {
  initialName: string;
  creationType: Tracking.CanvasCreationType;
  initialInputs: Platform.Base.Models.Intent.Input[];
}

interface CreateIntentAPI {
  name: string;
  inputs: Platform.Base.Models.Intent.Input[];
  create: () => Promise<{ intentID: string; inputs: Platform.Base.Models.Intent.Input[] }>;
  setName: (text: string) => void;
  setInputs: (inputs: Platform.Base.Models.Intent.Input[]) => void;
  intentEntities: Normal.Normalized<Platform.Base.Models.Intent.Slot>;
  addRequiredSlot: (slotID: string) => void;
  updateSlotDialog: (slotID: string, dialog: Partial<Platform.Base.Models.Intent.SlotDialog>) => void;
  removeRequiredSlot: (slotID: string) => void;
}

export const useCreateIntent = ({ creationType, initialName, initialInputs }: CreateIntentProps): CreateIntentAPI => {
  const platform = useSelector(ProjectV2.active.platformSelector);
  const projectConfig = useActiveProjectTypeConfig();

  const [name, setName] = useLinkedState(initialName);
  const [inputs, setInputs] = useLinkedState(initialInputs);
  const [intentEntities, setIntentEntities] = React.useState<Normal.Normalized<Platform.Base.Models.Intent.Slot>>(() => Normal.createEmpty());

  const intentNameProcessor = useIntentNameProcessor();

  const createIntent = useDispatch(IntentV2.createIntent);

  const handleSetInputs = (newInputs: Platform.Base.Models.Intent.Input[]) => {
    const newIntentEntities = getUniqSlots(newInputs).reduce<Platform.Base.Models.Intent.Slot[]>(
      (slots, slotID) => (Normal.hasOne(intentEntities, slotID) ? slots : [...slots, projectConfig.utils.intent.slotFactory({ id: slotID })]),
      []
    );

    const newInputSlots = getUniqSlots(newInputs);
    const oldInputSlots = getUniqSlots(inputs);
    const slotsToRemove = _differenceWith(oldInputSlots, newInputSlots, _isEqual);
    const entitiesToSet = [...Normal.denormalize(intentEntities), ...newIntentEntities].filter((slot) => !slotsToRemove.includes(slot.id));

    setIntentEntities(Normal.normalize(entitiesToSet));
    setInputs(newInputs);
  };

  const create = async () => {
    const { error, formattedName } = intentNameProcessor(name);

    if (error) {
      toast.error(error);
      throw new Error(error);
    }

    try {
      const newIntent: Partial<Platform.Base.Models.Intent.Model> = {
        name: formattedName,
        slots: intentEntities,
        inputs,
      };

      const intentID = await createIntent(creationType, newIntent);

      return { inputs, intentID };
    } catch (err) {
      toast.error(getErrorMessage(err));

      throw err;
    }
  };

  const updateSlot = (slotID: string, data: Partial<Platform.Base.Models.Intent.Slot>) => {
    setIntentEntities((prevUsedSlots) => Normal.patchOne(prevUsedSlots, slotID, data));
  };

  const addRequiredSlot = (slotID: string) => {
    setIntentEntities((prevUsedSlots) => {
      if (Normal.hasOne(prevUsedSlots, slotID)) {
        return Normal.patchOne(prevUsedSlots, slotID, { required: true });
      }

      return Normal.appendOne(prevUsedSlots, slotID, { ...projectConfig.utils.intent.slotFactory({ id: slotID }), required: true });
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

  const updateSlotDialog = (slotID: string, dialog: Partial<Platform.Base.Models.Intent.SlotDialog>) => {
    setIntentEntities((prevUsedSlots) =>
      Normal.patchOne(prevUsedSlots, slotID, {
        dialog: { ...Normal.getOne(prevUsedSlots, slotID)?.dialog, ...dialog },
      } as Partial<Platform.Base.Models.Intent.Slot>)
    );
  };

  return {
    name,
    inputs,
    create,
    setName: (name: string) => setName(applyPlatformIntentNameFormatting(name, platform)),
    setInputs: handleSetInputs,
    intentEntities,
    addRequiredSlot,
    updateSlotDialog,
    removeRequiredSlot,
  };
};
