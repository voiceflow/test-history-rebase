import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { FlexCenter, SectionV2, SvgIcon, useOnScreen } from '@voiceflow/ui';
import * as Normal from 'normal-store';
import React from 'react';

import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import { useDispatch, useSelector } from '@/hooks';
import BuiltInPrompt from '@/pages/Canvas/components/IntentModalsV2/components/components/BuiltInPrompt';
import IntentEntitiesSection from '@/pages/Canvas/components/IntentModalsV2/components/components/IntentEntitiesSection';
import { FadeDownContainer } from '@/styles/animations';

import DescriptionSection from '../components/DescriptionSection';
import { JumpToEntitiesBubble } from '../components/index';
import NameSection from '../components/NameSection';
import UtteranceSection from '../components/UtteranceSection';

interface IntentFormProps {
  name: string;
  noteID?: string;
  setName: (name: string) => void;
  saveName?: () => void;
  inputs: Realtime.IntentInput[];
  isBuiltIn?: boolean;
  setInputs: (inputs: Realtime.IntentInput[]) => void;
  intentID?: string;
  withNameSection?: boolean;
  autofocusUtterance?: boolean;
  intentEntities: Normal.Normalized<Realtime.IntentSlot>;
  withDescriptionSection?: boolean;
  addRequiredSlot: (slotID: string) => void;
  removeRequiredSlot: (slotID: string) => void;
  updateSlotDialog: (slotID: string, dialog: Partial<Realtime.IntentSlotDialog>) => void;
}

const IntentForm: React.FC<IntentFormProps> = ({
  name,
  setName,
  saveName,
  isBuiltIn,
  withNameSection = true,
  withDescriptionSection = false,
  intentID,
  autofocusUtterance,
  inputs,
  setInputs,
  intentEntities,
  addRequiredSlot,
  removeRequiredSlot,
  updateSlotDialog,
}) => {
  const intentsMap = useSelector(IntentV2.customIntentMapSelector);

  const patchIntent = useDispatch(Intent.patchIntent);

  const [showUtteranceSection, setShowUtteranceSection] = React.useState(false);
  const entitiesDividerRef = React.useRef<Nullable<HTMLHRElement>>(null);
  const isEntitiesVisible = useOnScreen(entitiesDividerRef, true);

  const scrollToEntities = () => {
    entitiesDividerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    const intent = intentID && intentsMap[intentID];
    if (!intent) return;
    setShowUtteranceSection(!isBuiltIn || !!intent?.inputs?.length);
  }, [intentID, intentsMap]);

  return (
    <>
      {withNameSection && <NameSection name={name} setName={setName} saveName={saveName} />}
      {(!isBuiltIn || showUtteranceSection) && (
        <UtteranceSection inputs={inputs} onUpdateUtterances={setInputs} autofocus={autofocusUtterance} withBorderTop={withNameSection} />
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
          />
        </>
      )}

      {withDescriptionSection && intentID && (
        <DescriptionSection intentID={intentID} onCreateNote={(noteID) => intentID && patchIntent(intentID, { noteID })} />
      )}

      {!isEntitiesVisible && (
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
