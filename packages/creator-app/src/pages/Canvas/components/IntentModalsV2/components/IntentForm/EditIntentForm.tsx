import { ChatModels } from '@voiceflow/chat-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';
import { VoiceModels } from '@voiceflow/voice-types';
import React from 'react';

import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import * as SlotV2 from '@/ducks/slotV2';
import { useDidUpdateEffect, useDispatch, useLinkedState, useSelector } from '@/hooks';
import IntentForm from '@/pages/Canvas/components/IntentModalsV2/components/IntentForm/index';
import { isBuiltInIntent } from '@/utils/intent';

interface EditIntentFormProps {
  intentID: string;
  withNameSection?: boolean;
}

const EditIntentForm: React.FC<EditIntentFormProps> = ({ intentID, withNameSection = false }) => {
  const intent = useSelector(IntentV2.intentByIDSelector, { id: intentID });
  const [name, setName] = useLinkedState(intent?.name || '');
  const [inputs, setInputs] = useLinkedState(intent?.inputs || []);

  const slotsMap = useSelector(SlotV2.slotMapSelector);

  const addRequiredSlot = useDispatch(Intent.addRequiredSlot);
  const removeRequiredSlot = useDispatch(Intent.removeRequiredSlot);
  const patchIntentSlotDialog = useDispatch(Intent.updateIntentSlotDialog);

  const usedSlotKeys = intent?.slots.allKeys || [];
  const usedSlots = React.useMemo(() => {
    return usedSlotKeys.reduce<Realtime.IntentSlot[]>((slots, key) => (intent?.slots.byKey[key] ? [...slots, intent?.slots.byKey[key]] : slots), []);
  }, [usedSlotKeys, slotsMap, intent?.slots]);

  const isBuiltIn = React.useMemo(() => isBuiltInIntent(intentID), [intentID]);
  const noteID = intent?.noteID;

  const patchIntent = useDispatch(Intent.patchIntent);

  const saveName = () => {
    patchIntent(intentID, { name });
  };

  const addRequiredSlotToIntent = async (slotID: string) => {
    await addRequiredSlot(intentID, slotID);
  };

  const removeRequiredSlotFromIntent = async (slotID: string) => {
    await removeRequiredSlot(intentID, slotID);
  };

  const updateSlotDialog = (slotID: string, prompt: VoiceModels.IntentPrompt<any>[] | ChatModels.Prompt[]) => {
    patchIntentSlotDialog(intentID, slotID, { prompt } as Realtime.IntentSlotDialog);
  };

  const onUpdateUtterances = (inputs: Realtime.IntentInput[]) => {
    setInputs(inputs);
    patchIntent(intentID, { inputs });
  };

  useDidUpdateEffect(() => {
    if (!intent) {
      toast.error('Someone else has deleted this intent, return to canvas');
    }
  }, [intent]);

  return intent ? (
    <IntentForm
      withDescriptionSection
      intentID={intentID}
      usedSlots={usedSlots}
      noteID={noteID}
      isBuiltIn={isBuiltIn}
      inputs={inputs}
      setInputs={onUpdateUtterances}
      name={name}
      setName={setName}
      saveName={saveName}
      withNameSection={withNameSection}
      addRequiredSlot={addRequiredSlotToIntent}
      removeRequiredSlot={removeRequiredSlotFromIntent}
      updateSlotDialog={updateSlotDialog}
    />
  ) : null;
};

export default EditIntentForm;
