import { ChatModels } from '@voiceflow/chat-types';
import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { FlexCenter, SvgIcon, useOnScreen } from '@voiceflow/ui';
import { VoiceModels } from '@voiceflow/voice-types';
import React from 'react';

import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import { useDispatch, useSelector } from '@/hooks';
import BuiltInPrompt from '@/pages/Canvas/components/IntentModalsV2/components/components/BuiltInPrompt';
import { FadeDownContainer } from '@/styles/animations';

import DescriptionSection from '../components/DescriptionSection';
import EntitiesSection from '../components/EntitiesSection';
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
  usedSlots: Realtime.IntentSlot[];
  setInputs: (inputs: Realtime.IntentInput[]) => void;
  intentID?: string;
  withNameSection?: boolean;
  autofocusUtterance?: boolean;
  withDescriptionSection?: boolean;
  addRequiredSlot: (slotID: string) => void;
  removeRequiredSlot: (slotID: string) => void;
  updateSlotDialog: (slotID: string, prompt: Array<VoiceModels.IntentPrompt<string> & ChatModels.Prompt>) => void;
}

const IntentForm: React.FC<IntentFormProps> = ({
  name,
  setName,
  saveName,
  usedSlots,
  isBuiltIn,
  withNameSection = true,
  withDescriptionSection = false,
  intentID,
  autofocusUtterance,
  inputs,
  setInputs,
  addRequiredSlot,
  removeRequiredSlot,
  updateSlotDialog,
}) => {
  const intentsMap = useSelector(IntentV2.customIntentMapSelector);

  const patchIntent = useDispatch(Intent.patchIntent);

  const [showUtteranceSection, setShowUtteranceSection] = React.useState(false);
  const entitiesRef = React.useRef<Nullable<HTMLDivElement>>(null);
  const isEntitiesVisible = useOnScreen(entitiesRef, true);

  const scrollToEntities = () => {
    entitiesRef.current?.scrollIntoView({ behavior: 'smooth' });
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
          <div ref={entitiesRef} />
          <EntitiesSection
            updateSlotDialog={updateSlotDialog}
            removeRequiredSlot={removeRequiredSlot}
            addRequiredSlot={addRequiredSlot}
            usedSlots={usedSlots}
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
