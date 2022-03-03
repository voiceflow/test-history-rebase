import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { FlexCenter, SvgIcon, useOnScreen } from '@voiceflow/ui';
import React from 'react';

import * as SlotV2 from '@/ducks/slotV2';
import { useSelector } from '@/hooks';
import { FadeDownContainer } from '@/styles/animations';

import EntitiesSection from '../components/EntitiesSection';
import { JumpToEntitiesBubble } from '../components/index';
import NameSection from '../components/NameSection';
import UtteranceSection from '../components/UtteranceSection';

const IntentForm: React.FC<{ intent: Realtime.Intent }> = ({ intent }) => {
  const entitiesVisibleRef = React.useRef<HTMLDivElement>(null);
  const slotsMap = useSelector(SlotV2.slotMapSelector);

  const scrollToEntitiesRef = React.useRef<Nullable<HTMLDivElement>>(null);
  const hideScrollTo = useOnScreen(entitiesVisibleRef, true);

  const allSlotKeys = intent?.slots.allKeys || [];
  const usedSlots = React.useMemo(() => allSlotKeys.map((id) => slotsMap[id]), [allSlotKeys]);

  const scrollToEntities = () => {
    scrollToEntitiesRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  return (
    <>
      <NameSection intent={intent} />
      <UtteranceSection intent={intent} />
      <div ref={scrollToEntitiesRef} />
      <EntitiesSection entitiesVisibleRef={entitiesVisibleRef} slots={usedSlots} intent={intent} />
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
