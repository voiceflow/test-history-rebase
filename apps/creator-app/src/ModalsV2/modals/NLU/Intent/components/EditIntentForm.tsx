import * as Platform from '@voiceflow/platform-config';
import { toast } from '@voiceflow/ui';
import React from 'react';

import * as IntentV2 from '@/ducks/intentV2';
import * as Tracking from '@/ducks/tracking';
import { useDidUpdateEffect, useDispatch, useLinkedState, useSelector, useTrackingEvents } from '@/hooks';
import { useIntentNameProcessor } from '@/hooks/intent.hook';
import { isBuiltInIntent } from '@/utils/intent';

import IntentForm from './IntentForm';

interface EditIntentFormProps {
  intentID: string;
  creationType: Tracking.IntentEditType;
  isNLUManager?: boolean;
  withNameSection?: boolean;
  onEnterEntityPrompt: (slotID: string, options?: { autogenerate: boolean }) => void;
  utteranceCreationType: Tracking.CanvasCreationType;
  prefilledNewUtterance?: string;
  withDescriptionBottomBorder?: boolean;
}

const DEFAULT_INPUTS: Platform.Base.Models.Intent.Input[] = [];

const EditIntentForm: React.FC<EditIntentFormProps> = ({
  intentID,
  creationType,
  isNLUManager,
  withNameSection = false,
  onEnterEntityPrompt,
  utteranceCreationType,
  prefilledNewUtterance,
  withDescriptionBottomBorder,
}) => {
  const intent = useSelector(IntentV2.platformIntentByIDSelector, { id: intentID });

  const intentIsBuiltIn = React.useMemo(() => !!intent && isBuiltInIntent(intent.id), [intent?.id]);

  const [name, setName] = useLinkedState(intent?.name ?? '');
  const [inputs, setInputs] = useLinkedState(intent?.inputs || DEFAULT_INPUTS);

  const addRequiredSlot = useDispatch(IntentV2.addRequiredSlot);
  const removeRequiredSlot = useDispatch(IntentV2.removeRequiredSlot);
  const [trackingEvents] = useTrackingEvents();

  const patchIntent = useDispatch(IntentV2.patchIntent);

  const intentNameProcessor = useIntentNameProcessor();

  const saveName = () => {
    const { error, formattedName } = intentNameProcessor(name, intentID);

    setName(formattedName);

    if (error) {
      toast.error(error);
      return;
    }

    patchIntent(intentID, { name: formattedName });
    trackingEvents.trackIntentEdit({ creationType });
  };

  const onIntentNameSuggested = (suggestedName: string) => {
    const { error, formattedName } = intentNameProcessor(suggestedName, intentID);

    if (error) return;

    setName(formattedName);
    patchIntent(intentID, { name: formattedName });
  };

  const addRequiredSlotToIntent = async (slotID: string) => {
    await addRequiredSlot(intentID, slotID);
    trackingEvents.trackIntentEdit({ creationType });
  };

  const removeRequiredSlotFromIntent = async (slotID: string) => {
    await removeRequiredSlot(intentID, slotID);
    trackingEvents.trackIntentEdit({ creationType });
  };

  const onUpdateUtterances = (inputs: Platform.Base.Models.Intent.Input[]) => {
    setInputs(inputs);
    patchIntent(intentID, { inputs });
    trackingEvents.trackIntentEdit({ creationType });
  };

  useDidUpdateEffect(() => {
    if (!intent) {
      toast.error('Someone else has deleted this intent, return to canvas');
    }
  }, [intent]);

  if (!intent) return null;

  return (
    <IntentForm
      name={name}
      noteID={intent.noteID}
      inputs={inputs}
      setName={setName}
      intentID={intentID}
      saveName={saveName}
      isBuiltIn={intentIsBuiltIn}
      setInputs={onUpdateUtterances}
      isNLUManager={isNLUManager}
      creationType={creationType}
      intentEntities={intent.slots}
      withNameSection={withNameSection}
      addRequiredSlot={addRequiredSlotToIntent}
      removeRequiredSlot={removeRequiredSlotFromIntent}
      onEnterEntityPrompt={onEnterEntityPrompt}
      prefilledNewUtterance={prefilledNewUtterance}
      utteranceCreationType={utteranceCreationType}
      onIntentNameSuggested={onIntentNameSuggested}
      withDescriptionSection
      withDescriptionBottomBorder={withDescriptionBottomBorder}
    />
  );
};

export default EditIntentForm;
