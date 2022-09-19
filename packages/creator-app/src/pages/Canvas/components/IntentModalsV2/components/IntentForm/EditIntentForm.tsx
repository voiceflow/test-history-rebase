import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';
import React from 'react';

import * as Intent from '@/ducks/intent';
import * as Tracking from '@/ducks/tracking';
import { useDidUpdateEffect, useDispatch, useIntent, useIntentNameProcessor, useLinkedState, useTrackingEvents } from '@/hooks';

import IntentForm from './index';

interface EditIntentFormProps {
  intentID: string;
  creationType: Tracking.IntentEditType;
  isNLUManager?: boolean;
  withNameSection?: boolean;
  prefilledNewUtterance?: string;
  withDescriptionBottomBorder?: boolean;
}

const DEFAULT_INPUTS: Realtime.IntentInput[] = [];

const EditIntentForm: React.FC<EditIntentFormProps> = ({
  intentID,
  creationType,
  isNLUManager,
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
  const [trackingEvents] = useTrackingEvents();

  const patchIntent = useDispatch(Intent.patchIntent);

  const intentNameProcessor = useIntentNameProcessor();

  const saveName = () => {
    const { error, formattedName } = intentNameProcessor(name, intentID);

    setName(formattedName);

    if (error) {
      toast.error(error);
      return;
    }

    patchIntent(intentID, { name });
    trackingEvents.trackIntentEdit({ creationType });
  };

  const addRequiredSlotToIntent = async (slotID: string) => {
    await addRequiredSlot(intentID, slotID);
    trackingEvents.trackIntentEdit({ creationType });
  };

  const removeRequiredSlotFromIntent = async (slotID: string) => {
    await removeRequiredSlot(intentID, slotID);
    trackingEvents.trackIntentEdit({ creationType });
  };

  const updateSlotDialog = (slotID: string, dialog: Partial<Realtime.IntentSlotDialog>) => {
    patchIntentSlotDialog(intentID, slotID, dialog);
  };

  const onUpdateUtterances = (inputs: Realtime.IntentInput[]) => {
    setInputs(inputs);
    patchIntent(intentID, { inputs });
    trackingEvents.trackIntentEdit({ creationType });
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
      creationType={creationType}
      inputs={inputs}
      setName={setName}
      intentID={intentID}
      saveName={saveName}
      isBuiltIn={intentIsBuiltIn}
      setInputs={onUpdateUtterances}
      isNLUManager={isNLUManager}
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
