import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';
import React from 'react';

import * as Intent from '@/ducks/intent';
import { useDidUpdateEffect, useDispatch, useIntent, useLinkedState } from '@/hooks';
import IntentForm from '@/pages/Canvas/components/IntentModalsV2/components/IntentForm';

interface EditIntentFormProps {
  intentID: string;
  withNameSection?: boolean;
  withDescriptionBottomBorder?: boolean;
  rightSlider?: boolean;
  prefilledNewUtterance?: string;
}

const DEFAULT_INPUTS: Realtime.IntentInput[] = [];

const EditIntentForm: React.FC<EditIntentFormProps> = ({
  intentID,
  rightSlider,
  withNameSection = false,
  prefilledNewUtterance,
  withDescriptionBottomBorder,
}) => {
  const { intent, intentIsBuiltIn } = useIntent(intentID);

  const [name, setName] = useLinkedState(intent?.name ?? '');
  const [inputs, setInputs] = useLinkedState(intent?.inputs || DEFAULT_INPUTS);

  const addRequiredSlot = useDispatch(Intent.addRequiredSlot);
  const removeRequiredSlot = useDispatch(Intent.removeRequiredSlot);
  const patchIntentSlotDialog = useDispatch(Intent.updateIntentSlotDialog);

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

  const updateSlotDialog = (slotID: string, dialog: Partial<Realtime.IntentSlotDialog>) => {
    patchIntentSlotDialog(intentID, slotID, dialog);
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
      name={name}
      noteID={intent?.noteID}
      inputs={inputs}
      setName={setName}
      intentID={intentID}
      saveName={saveName}
      isBuiltIn={intentIsBuiltIn}
      setInputs={onUpdateUtterances}
      rightSlider={rightSlider}
      intentEntities={intent.slots}
      withNameSection={withNameSection}
      addRequiredSlot={addRequiredSlotToIntent}
      updateSlotDialog={updateSlotDialog}
      removeRequiredSlot={removeRequiredSlotFromIntent}
      prefilledNewUtterance={prefilledNewUtterance}
      withDescriptionSection
      withDescriptionBottomBorder={withDescriptionBottomBorder}
    />
  ) : null;
};

export default EditIntentForm;
