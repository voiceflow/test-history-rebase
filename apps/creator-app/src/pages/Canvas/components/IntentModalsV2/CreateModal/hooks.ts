import * as Platform from '@voiceflow/platform-config';
import { toast } from '@voiceflow/ui';
import _differenceWith from 'lodash/differenceWith';
import _isEqual from 'lodash/isEqual';
import * as Normal from 'normal-store';
import React from 'react';

import * as Intent from '@/ducks/intent';
import { getUniqSlots } from '@/ducks/intent/utils';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Tracking from '@/ducks/tracking';
import { useActiveProjectTypeConfig, useDispatch, useIntentNameProcessor, useSelector } from '@/hooks';
import { getErrorMessage } from '@/utils/error';
import { applyPlatformIntentNameFormatting } from '@/utils/intent';

interface CreateIntentProps {
  onCreate?: (id: string, data?: Partial<Platform.Base.Models.Intent.Model>) => void;
  initialName?: string;
  creationType: Tracking.CanvasCreationType;
}

interface CreateIntentAPI {
  name: string;
  reset: () => void;
  cancel: () => void;
  inputs: Platform.Base.Models.Intent.Input[];
  setName: (text: string) => void;
  onCreate: () => void;
  creating: boolean;
  setInputs: (inputs: Platform.Base.Models.Intent.Input[]) => void;
  intentEntities: Normal.Normalized<Platform.Base.Models.Intent.Slot>;
  addRequiredSlot: (slotID: string) => void;
  updateSlotDialog: (slotID: string, dialog: Partial<Platform.Base.Models.Intent.SlotDialog>) => void;
  removeRequiredSlot: (slotID: string) => void;
}

export const useCreateIntent = ({ creationType, initialName, onCreate }: CreateIntentProps): CreateIntentAPI => {
  const platform = useSelector(ProjectV2.active.platformSelector);
  const projectConfig = useActiveProjectTypeConfig();

  const [name, setName] = React.useState(initialName || '');
  const [inputs, setInputs] = React.useState<Platform.Base.Models.Intent.Input[]>([]);
  const [creating, setCreating] = React.useState(false);
  const [intentEntities, setIntentEntities] = React.useState<Normal.Normalized<Platform.Base.Models.Intent.Slot>>(() => Normal.createEmpty());

  const intentNameProcessor = useIntentNameProcessor();

  const createIntent = useDispatch(Intent.createIntent);

  const reset = () => {
    setName('');
    setInputs([]);
    setIntentEntities(Normal.createEmpty());
    setCreating(false);
  };

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

  const finalizeIntentCreate = async () => {
    if (creating) return;

    const { error, formattedName } = intentNameProcessor(name);

    if (error) {
      toast.error(error);
      return;
    }

    setCreating(true);

    try {
      const newIntent: Partial<Platform.Base.Models.Intent.Model> = {
        name: formattedName,
        slots: intentEntities,
        inputs,
      };

      const intentID = await createIntent(creationType, newIntent);

      onCreate?.(intentID, { inputs });
      reset();
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const cancel = () => {
    reset();
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
