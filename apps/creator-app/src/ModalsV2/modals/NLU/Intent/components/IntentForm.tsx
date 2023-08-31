import { Nullable } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import { Box, Bubble, SectionV2, useOnScreen } from '@voiceflow/ui';
import * as Normal from 'normal-store';
import React from 'react';

import * as IntentV2 from '@/ducks/intentV2';
import * as Tracking from '@/ducks/tracking';
import { useDispatch, useSelector } from '@/hooks';

import BuiltInPrompt from './BuiltInPrompt';
import DescriptionSection from './DescriptionSection';
import IntentEntitiesSection from './IntentEntitiesSection';
import NameSection from './NameSection';
import UtteranceSection from './UtteranceSection';

interface IntentFormProps {
  name: string;
  inputs: Platform.Base.Models.Intent.Input[];
  noteID?: string;
  setName: (name: string) => void;
  saveName?: () => void;
  intentID?: string;
  isBuiltIn?: boolean;
  autofocus?: boolean;
  setInputs: (inputs: Platform.Base.Models.Intent.Input[]) => void;
  creationType: Tracking.IntentEditType;
  isNLUManager?: boolean;
  intentEntities: Normal.Normalized<Platform.Base.Models.Intent.Slot>;
  addRequiredSlot: (slotID: string) => void;
  withNameSection?: boolean;
  removeRequiredSlot: (slotID: string) => void;
  onEnterEntityPrompt: (slotID: string, options?: { autogenerate: boolean }) => void;
  utteranceCreationType: Tracking.CanvasCreationType;
  prefilledNewUtterance?: string;
  onIntentNameSuggested?: (name: string) => void;
  withDescriptionSection?: boolean;
  withDescriptionBottomBorder?: boolean;
}

const IntentForm: React.FC<IntentFormProps> = ({
  name,
  inputs,
  setName,
  intentID,
  saveName,
  isBuiltIn,
  autofocus,
  setInputs,
  creationType,
  isNLUManager,
  intentEntities,
  addRequiredSlot,
  withNameSection = true,
  removeRequiredSlot,
  onEnterEntityPrompt,
  utteranceCreationType,
  prefilledNewUtterance,
  onIntentNameSuggested,
  withDescriptionSection = false,
  withDescriptionBottomBorder,
}) => {
  const intentsMap = useSelector(IntentV2.customIntentMapSelector);

  const patchIntent = useDispatch(IntentV2.patchIntent);

  const entitiesDividerRef = React.useRef<Nullable<HTMLHRElement>>(null);

  const [showUtteranceSection, setShowUtteranceSection] = React.useState(false);

  const isEntitiesVisible = useOnScreen(entitiesDividerRef, { initialState: true });

  const scrollToEntities = () => {
    entitiesDividerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const intent = intentID ? intentsMap[intentID] : null;

  React.useEffect(() => {
    if (!intent) return;

    setShowUtteranceSection(!isBuiltIn || !!intent.inputs.length);
  }, [intent, isBuiltIn]);

  const utteranceSectionVisible = !isBuiltIn || showUtteranceSection;

  return (
    <>
      {withNameSection && (
        <NameSection
          name={name}
          setName={setName}
          saveName={saveName}
          autofocus={!name}
          isBuiltIn={isBuiltIn}
          hasBottomPadding={utteranceSectionVisible}
        />
      )}

      {utteranceSectionVisible && (
        <UtteranceSection
          inputs={inputs}
          intentID={intentID ?? null}
          isBuiltIn={isBuiltIn}
          autofocus={!!name && autofocus}
          intentName={name}
          withBorderTop={withNameSection}
          prefilledUtterance={prefilledNewUtterance}
          onUpdateUtterances={setInputs}
          onIntentNameSuggested={onIntentNameSuggested}
          utteranceCreationType={utteranceCreationType}
        />
      )}

      {isBuiltIn && !showUtteranceSection && <BuiltInPrompt intentID={intentID} setShowUtteranceSection={setShowUtteranceSection} />}

      {!isBuiltIn && (
        <>
          <SectionV2.Divider ref={entitiesDividerRef} />

          <IntentEntitiesSection
            onAddRequired={addRequiredSlot}
            onEnterPrompt={onEnterEntityPrompt}
            intentEntities={intentEntities}
            onRemoveRequired={removeRequiredSlot}
            addDropdownPlacement={isNLUManager ? 'bottom-end' : 'bottom-start'}
          />
        </>
      )}

      {withDescriptionSection && intentID && (
        <DescriptionSection
          intentID={intentID}
          creationType={creationType}
          onCreateNote={(noteID) => intentID && patchIntent(intentID, { noteID })}
          withBottomBorder={withDescriptionBottomBorder}
        />
      )}

      {!isEntitiesVisible && !isBuiltIn && (
        <Box.FlexCenter position="sticky" bottom="20px" zIndex={1000}>
          <Bubble onClick={scrollToEntities} direction="down">
            Entities
          </Bubble>
        </Box.FlexCenter>
      )}
    </>
  );
};

export default IntentForm;
