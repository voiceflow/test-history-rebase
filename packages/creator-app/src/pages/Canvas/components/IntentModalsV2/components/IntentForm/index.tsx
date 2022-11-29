import { Nullable } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import { FlexCenter, SectionV2, SvgIcon, useOnScreen } from '@voiceflow/ui';
import * as Normal from 'normal-store';
import React from 'react';

import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import * as Tracking from '@/ducks/tracking';
import * as VersionV2 from '@/ducks/versionV2';
import { useActiveProjectTypeConfig, useDispatch, useSelector } from '@/hooks';
import { FadeDownContainer } from '@/styles/animations';

import BuiltInPrompt from '../components/BuiltInPrompt';
import DescriptionSection from '../components/DescriptionSection';
import { JumpToEntitiesBubble } from '../components/index';
import IntentEntitiesSection from '../components/IntentEntitiesSection';
import NameSection from '../components/NameSection';
import UtteranceSection from '../components/UtteranceSection';

interface IntentFormProps {
  name: string;
  inputs: Platform.Base.Models.Intent.Input[];
  utteranceCreationType: Tracking.CanvasCreationType;
  creationType: Tracking.IntentEditType;
  noteID?: string;
  setName: (name: string) => void;
  saveName?: () => void;
  setInputs: (inputs: Platform.Base.Models.Intent.Input[]) => void;
  intentID?: string;
  isBuiltIn?: boolean;
  autofocus?: boolean;
  isNLUManager?: boolean;
  intentEntities: Normal.Normalized<Platform.Base.Models.Intent.Slot>;
  addRequiredSlot: (slotID: string) => void;
  withNameSection?: boolean;
  updateSlotDialog: (slotID: string, dialog: Partial<Platform.Base.Models.Intent.SlotDialog>) => void;
  removeRequiredSlot: (slotID: string) => void;
  prefilledNewUtterance?: string;
  withDescriptionSection?: boolean;
  withDescriptionBottomBorder?: boolean;
}

const IntentForm: React.FC<IntentFormProps> = ({
  name,
  inputs,
  utteranceCreationType,
  creationType,
  setName,
  intentID,
  saveName,
  isBuiltIn,
  autofocus,
  setInputs,
  isNLUManager,
  intentEntities,
  addRequiredSlot,
  withNameSection = true,
  updateSlotDialog,
  removeRequiredSlot,
  prefilledNewUtterance,
  withDescriptionSection = false,
  withDescriptionBottomBorder,
}) => {
  const projectConfig = useActiveProjectTypeConfig();

  const locales = useSelector(VersionV2.active.localesSelector);
  const intentsMap = useSelector(IntentV2.customIntentMapSelector);

  const patchIntent = useDispatch(Intent.patchIntent);

  const entitiesDividerRef = React.useRef<Nullable<HTMLHRElement>>(null);

  const [showUtteranceSection, setShowUtteranceSection] = React.useState(false);

  const isEntitiesVisible = useOnScreen(entitiesDividerRef, { initialState: true });

  const scrollToEntities = () => {
    entitiesDividerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const recommendedUtterancesSupported = React.useMemo(
    () => locales.some((locale) => projectConfig.project.locale.utteranceRecommendations.includes(locale)),
    [locales, projectConfig]
  );

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
          intentID={intentID ?? null}
          inputs={inputs}
          utteranceCreationType={utteranceCreationType}
          isBuiltIn={isBuiltIn}
          autofocus={!!name && autofocus}
          withBorderTop={withNameSection}
          prefilledUtterance={prefilledNewUtterance}
          onUpdateUtterances={setInputs}
          withRecommendations={isNLUManager && recommendedUtterancesSupported && !!inputs.length}
        />
      )}

      {isBuiltIn && !showUtteranceSection && <BuiltInPrompt setShowUtteranceSection={setShowUtteranceSection} />}

      {!isBuiltIn && (
        <>
          <SectionV2.Divider ref={entitiesDividerRef} />

          <IntentEntitiesSection
            onAddRequired={addRequiredSlot}
            intentEntities={intentEntities}
            onChangeDialog={updateSlotDialog}
            onRemoveRequired={removeRequiredSlot}
            addDropdownPlacement={isNLUManager ? 'bottom-end' : 'bottom-start'}
          />
        </>
      )}

      {withDescriptionSection && intentID && (
        <DescriptionSection
          creationType={creationType}
          withBottomBorder={withDescriptionBottomBorder}
          intentID={intentID}
          onCreateNote={(noteID) => intentID && patchIntent(intentID, { noteID })}
        />
      )}

      {!isEntitiesVisible && !isBuiltIn && (
        <FlexCenter style={{ position: 'sticky', bottom: '20px', zIndex: 1000 }}>
          <FadeDownContainer>
            <JumpToEntitiesBubble onClick={scrollToEntities}>
              <SvgIcon icon="arrowDown" color="white" style={{ display: 'inline-block', marginRight: 4 }} />
              Entities
            </JumpToEntitiesBubble>
          </FadeDownContainer>
        </FlexCenter>
      )}
    </>
  );
};

export default IntentForm;
