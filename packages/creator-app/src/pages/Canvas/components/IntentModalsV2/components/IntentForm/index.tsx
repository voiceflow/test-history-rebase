import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { FlexCenter, SvgIcon, useOnScreen } from '@voiceflow/ui';
import React from 'react';

import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import * as SlotV2 from '@/ducks/slotV2';
import { useDispatch, useSelector } from '@/hooks';
import BuiltInPrompt from '@/pages/Canvas/components/IntentModalsV2/components/components/BuiltInPrompt';
import { FadeDownContainer } from '@/styles/animations';
import { isBuiltInIntent } from '@/utils/intent';

import DescriptionSection from '../components/DescriptionSection';
import EntitiesSection from '../components/EntitiesSection';
import { JumpToEntitiesBubble } from '../components/index';
import NameSection from '../components/NameSection';
import UtteranceSection from '../components/UtteranceSection';

interface IntentFormProps {
  intentID: string;
  withDescriptionSection?: boolean;
  withNameSection?: boolean;
}

const IntentForm: React.FC<IntentFormProps> = ({ withNameSection = true, withDescriptionSection = true, intentID }) => {
  const intentsMap = useSelector(IntentV2.customIntentMapSelector);
  const intent = intentsMap[intentID];

  const entitiesVisibleRef = React.useRef<HTMLDivElement>(null);
  const slotsMap = useSelector(SlotV2.slotMapSelector);
  const isBuiltIn = isBuiltInIntent(intent.id);
  const patchIntent = useDispatch(Intent.patchIntent);

  const [showUtteranceSection, setShowUtteranceSection] = React.useState(false);

  const scrollToEntitiesRef = React.useRef<Nullable<HTMLDivElement>>(null);
  const hideScrollTo = useOnScreen(entitiesVisibleRef, true);

  const usedSlotKeys = intent?.slots.allKeys || [];
  const usedSlots = React.useMemo(() => {
    const existingUsedSlots: Realtime.Slot[] = [];
    usedSlotKeys.forEach((key) => {
      if (slotsMap[key]) {
        existingUsedSlots.push(slotsMap[key]);
      }
    });
    return existingUsedSlots;
  }, [usedSlotKeys, slotsMap]);

  const scrollToEntities = () => {
    scrollToEntitiesRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  React.useEffect(() => {
    setShowUtteranceSection(!isBuiltIn || !!intent.inputs.length);
  }, [intent.id]);

  return (
    <>
      {withNameSection && <NameSection intent={intent} />}
      {(!isBuiltIn || showUtteranceSection) && <UtteranceSection withBorderTop={withNameSection} intent={intent} />}
      {isBuiltIn && !showUtteranceSection && <BuiltInPrompt setShowUtteranceSection={setShowUtteranceSection} />}
      {!isBuiltIn && (
        <>
          <div ref={scrollToEntitiesRef} />
          <EntitiesSection entitiesVisibleRef={entitiesVisibleRef} slots={usedSlots} intent={intent} />
        </>
      )}
      {withDescriptionSection && (
        <DescriptionSection intentID={intent.id} noteID={intent.noteID} onCreateNote={(noteID) => patchIntent(intent.id, { noteID })} />
      )}

      {!hideScrollTo && !!usedSlots.length && (
        <FlexCenter style={{ position: 'sticky', bottom: '20px' }}>
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
