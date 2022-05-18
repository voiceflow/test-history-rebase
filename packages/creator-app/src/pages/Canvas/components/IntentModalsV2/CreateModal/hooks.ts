import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';
import _differenceWith from 'lodash/differenceWith';
import _isEqual from 'lodash/isEqual';
import * as Normal from 'normal-store';
import { useCallback, useMemo, useState } from 'react';

import * as Intent from '@/ducks/intent';
import { getUniqSlots } from '@/ducks/intent/utils';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import { useDispatch, useSelector } from '@/hooks';
import { applyPlatformIntentAndSlotNameFormatting } from '@/utils/intent';

interface useCreateIntentProps {
  initialName?: string;
  onCreate?: (id: string) => void;
}

interface CreateIntentProps {
  name: string;
  setName: (text: string) => void;
  onCreate: () => void;
  inputs: Realtime.IntentInput[];
  setInputs: (inputs: Realtime.IntentInput[]) => void;
  addRequiredSlot: (slotID: string) => void;
  removeRequiredSlot: (slotID: string) => void;
  updateSlotDialog: (slotID: string, dialog: Partial<Realtime.IntentSlotDialog>) => void;
  intentEntities: Normal.Normalized<Realtime.IntentSlot>;
  cancel: () => void;
  reset: () => void;
  creating: boolean;
}

export const useCreateIntent = ({ initialName, onCreate }: useCreateIntentProps): CreateIntentProps => {
  const allIntents = useSelector(IntentV2.allIntentsSelector);
  const platform = useSelector(ProjectV2.active.platformSelector);
  const projectMeta = useSelector(ProjectV2.active.metaSelector);

  const intentSlotFactory = Realtime.Utils.slot.intentSlotFactoryCreator(projectMeta.type);

  const [name, setName] = useState<string>(initialName || '');
  const [inputs, setInputs] = useState<Realtime.IntentInput[]>([]);
  const [intentEntities, setIntentEntities] = useState<Normal.Normalized<Realtime.IntentSlot>>(() => Normal.createEmpty());
  const [creating, setCreating] = useState(false);

  const createIntent = useDispatch(Intent.createIntent);
  const allIntentNames = useMemo(() => allIntents.map((intent) => intent.name), [allIntents]);

  const reset = () => {
    setName('');
    setInputs([]);
    setIntentEntities(Normal.createEmpty());
    setCreating(false);
  };

  const handleSetInputs = useCallback(
    (newInputs: Realtime.IntentInput[]) => {
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
    },
    [intentEntities, inputs]
  );

  const finalizeIntentCreate = useCallback(async () => {
    if (creating) return;

    if (allIntentNames.includes(name)) {
      toast.error(`'${name}' is already being used, please use another name`);
      return;
    }

    setCreating(true);

    try {
      const newIntent = {
        name,
        slots: intentEntities,
        inputs,
      } as Partial<Realtime.Intent>;

      const intentID = await createIntent(newIntent);

      onCreate?.(intentID);
      reset();
    } catch (e) {
      toast.error(e);
    }
  }, [creating, allIntentNames, name, inputs, intentEntities, onCreate]);

  const cancel = () => {
    reset();
  };

  const updateSlot = useCallback((slotID: string, data: Partial<Realtime.IntentSlot>) => {
    setIntentEntities((prevUsedSlots) => Normal.patchOne(prevUsedSlots, slotID, data));
  }, []);

  const addRequiredSlot = useCallback((slotID: string) => {
    setIntentEntities((prevUsedSlots) => {
      if (Normal.hasOne(prevUsedSlots, slotID)) {
        return Normal.patchOne(prevUsedSlots, slotID, { required: true });
      }

      return Normal.appendOne(prevUsedSlots, slotID, { ...intentSlotFactory({ id: slotID }), required: true });
    });
  }, []);

  const removeRequiredSlot = useCallback(
    (slotID: string) => {
      const oldInputSlots = getUniqSlots(inputs);

      if (oldInputSlots.includes(slotID)) {
        updateSlot(slotID, { required: false });
      } else {
        setIntentEntities((prevUsedSlots) => Normal.removeOne(prevUsedSlots, slotID));
      }
    },
    [updateSlot, inputs]
  );

  const updateSlotDialog = useCallback((slotID: string, dialog: Partial<Realtime.IntentSlotDialog>) => {
    setIntentEntities((prevUsedSlots) =>
      Normal.patchOne(prevUsedSlots, slotID, {
        dialog: { ...Normal.getOne(prevUsedSlots, slotID)?.dialog, ...dialog },
      } as Partial<Realtime.IntentSlot>)
    );
  }, []);

  return {
    name,
    reset,
    inputs,
    cancel,
    setName: (name: string) => setName(applyPlatformIntentAndSlotNameFormatting(name, platform)),
    onCreate: finalizeIntentCreate,
    creating,
    setInputs: handleSetInputs,
    intentEntities,
    addRequiredSlot,
    updateSlotDialog,
    removeRequiredSlot,
  };
};
