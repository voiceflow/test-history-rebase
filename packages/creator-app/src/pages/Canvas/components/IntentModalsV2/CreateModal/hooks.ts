import { ChatModels } from '@voiceflow/chat-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';
import { VoiceModels } from '@voiceflow/voice-types';
import { normalize } from 'normal-store';
import { useCallback, useMemo, useState } from 'react';

import * as Intent from '@/ducks/intent';
import { getProjectTypeNewSlotsCreator, getUniqSlots } from '@/ducks/intent/utils';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import { useDispatch, useSelector } from '@/hooks';
import { applyPlatformIntentNameFormatting } from '@/utils/intent';

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
  updateSlotDialog: (slotID: string, prompt: Array<VoiceModels.IntentPrompt<any> & ChatModels.Prompt>) => void;
  usedSlots: Realtime.IntentSlot[];
  cancel: () => void;
  reset: () => void;
  creating: boolean;
}

export const useCreateIntent = ({ initialName, onCreate }: useCreateIntentProps): CreateIntentProps => {
  const allIntents = useSelector(IntentV2.allIntentsSelector);
  const platform = useSelector(ProjectV2.active.platformSelector);
  const projectMeta = useSelector(ProjectV2.active.metaSelector);

  const newSlotsCreator = getProjectTypeNewSlotsCreator(projectMeta.type);

  const [name, setName] = useState<string>(initialName || '');
  const [inputs, setInputs] = useState<Realtime.IntentInput[]>([]);
  const [usedSlots, setUsedSlots] = useState<Realtime.IntentSlot[]>([]);
  const [creating, setCreating] = useState(false);

  const createIntent = useDispatch(Intent.createIntent);

  const currentUsedSlotIDs = useMemo(() => usedSlots.map(({ id }) => id), [usedSlots]);
  const allIntentNames = useMemo(() => allIntents.map((intent) => intent.name), [allIntents]);

  const reset = () => {
    setName('');
    setInputs([]);
    setUsedSlots([]);
    setCreating(false);
  };

  const handleSetInputs = useCallback(
    (inputs: Realtime.IntentInput[]) => {
      const newIntentSlots = getUniqSlots(inputs).reduce<Realtime.IntentSlot[]>(
        (slots, slotId) => (currentUsedSlotIDs.includes(slotId) ? slots : [...slots, newSlotsCreator(slotId)]),
        []
      );
      setUsedSlots([...usedSlots, ...newIntentSlots]);
      setInputs(inputs);
    },
    [currentUsedSlotIDs, usedSlots]
  );

  const finalizeIntentCreate = useCallback(async () => {
    if (creating) return;
    if (allIntentNames.includes(name)) {
      toast.error(`'${name}' is already being used, please use another name`);
      return;
    }

    setCreating(true);
    const newIntent = {
      name,
      inputs,
      slots: normalize(usedSlots),
    } as Partial<Realtime.Intent>;
    try {
      const intentID = await createIntent(newIntent);
      onCreate?.(intentID);
      reset();
    } catch (e) {
      toast.error(e);
    }
  }, [creating, allIntentNames, name, inputs, usedSlots, onCreate]);

  const cancel = () => {
    reset();
  };

  const updateSlot = useCallback(
    (slotID: string, data: Partial<Realtime.IntentSlot>) => {
      const updatedUsedSlots = usedSlots.map((slot) => {
        if (slot.id === slotID) {
          return {
            ...slot,
            ...data,
          };
        }
        return slot;
      }) as Realtime.IntentSlot[];
      setUsedSlots(updatedUsedSlots);
    },
    [usedSlots]
  );

  const addRequiredSlot = useCallback(
    (slotID: string) => {
      if (currentUsedSlotIDs.includes(slotID)) {
        let tempSlot = {};
        // Move updated slot to end of array
        const filteredSlots = usedSlots.filter((slot) => {
          if (slot.id === slotID) {
            tempSlot = slot;
            return false;
          }
          return true;
        });
        setUsedSlots([...filteredSlots, { ...tempSlot, required: true }] as Realtime.IntentSlot[]);
      } else {
        const newIntentSlot = newSlotsCreator(slotID);
        setUsedSlots([...usedSlots, { ...newIntentSlot, required: true }]);
      }
    },
    [currentUsedSlotIDs, usedSlots, updateSlot]
  );

  const removeRequiredSlot = useCallback(
    (slotID: string) => {
      updateSlot(slotID, { required: false });
    },
    [updateSlot]
  );

  const updateSlotDialog = useCallback(
    (slotID: string, prompt: Array<VoiceModels.IntentPrompt<any> & ChatModels.Prompt>) => {
      // Currently, we only allow adding prompt while making a new intent
      updateSlot(slotID, { dialog: { prompt, confirm: [], utterances: [], confirmEnabled: false } } as Partial<Realtime.IntentSlot>);
    },
    [updateSlot]
  );

  return {
    name,
    setName: (name: string) => setName(applyPlatformIntentNameFormatting(name, platform)),
    onCreate: finalizeIntentCreate,
    inputs,
    setInputs: handleSetInputs,
    addRequiredSlot,
    removeRequiredSlot,
    updateSlotDialog,
    usedSlots,
    cancel,
    reset,
    creating,
  };
};
