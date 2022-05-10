import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';
import React from 'react';

import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import { useDidUpdateEffect, useDispatch, useLinkedState, useSelector } from '@/hooks';
import IntentForm from '@/pages/Canvas/components/IntentModalsV2/components/IntentForm';
import { isBuiltInIntent } from '@/utils/intent';

interface EditIntentFormProps {
  intentID: string;
  withNameSection?: boolean;
  withDescriptionBottomBorder?: boolean;
  rightSlider?: boolean;
}

const EditIntentForm: React.FC<EditIntentFormProps> = ({ rightSlider, withDescriptionBottomBorder, intentID, withNameSection = false }) => {
  const intent = useSelector(IntentV2.intentByIDSelector, { id: intentID });
  const [name, setName] = useLinkedState(intent?.name || '');
  const [inputs, setInputs] = useLinkedState(intent?.inputs || []);

  const addRequiredSlot = useDispatch(Intent.addRequiredSlot);
  const removeRequiredSlot = useDispatch(Intent.removeRequiredSlot);
  const patchIntentSlotDialog = useDispatch(Intent.updateIntentSlotDialog);

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
      rightSlider={rightSlider}
      withDescriptionSection
      intentID={intentID}
      intentEntities={intent.slots}
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
      withDescriptionBottomBorder={withDescriptionBottomBorder}
    />
  ) : null;
};

export default EditIntentForm;
