import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { FlexCenter, SvgIcon, useOnScreen } from '@voiceflow/ui';
import React from 'react';

import * as SlotV2 from '@/ducks/slotV2';
import { useSelector } from '@/hooks';
import { FadeDownContainer } from '@/styles/animations';

import DescriptionSection from '../components/DescriptionSection';
import EntitiesSection from '../components/EntitiesSection';
import { JumpToEntitiesBubble } from '../components/index';
import NameSection from '../components/NameSection';
import UtteranceSection from '../components/UtteranceSection';

const IntentForm: React.FC<{ intent: Realtime.Intent; withDescriptionSection?: boolean; withNameSection?: boolean }> = ({
  withNameSection = true,
  withDescriptionSection = true,
  intent,
}) => {
  const entitiesVisibleRef = React.useRef<HTMLDivElement>(null);
  const slotsMap = useSelector(SlotV2.slotMapSelector);
  const [description, setDescription] = React.useState('');

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
      {withNameSection && <NameSection intent={intent} />}
      <UtteranceSection withBorderTop={withNameSection} intent={intent} />
      <div ref={scrollToEntitiesRef} />
      <EntitiesSection entitiesVisibleRef={entitiesVisibleRef} slots={usedSlots} intent={intent} />
      {withDescriptionSection && <DescriptionSection handleDescriptionChange={setDescription} description={description} />}

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
