import { Utils } from '@voiceflow/common';
import { CustomScrollbars, hexToRGBA, preventDefault } from '@voiceflow/ui';
import React from 'react';

import { Interaction, OnInteraction } from '@/pages/Prototype/types';
import perf, { PerfAction } from '@/performance';
import { ClassName } from '@/styles/constants';

import { handleRequestActions } from '../utils';
import * as S from './styles';

interface InteractionsProps {
  color?: string;
  interactions: Interaction[];
  onInteraction: OnInteraction;
}

const Interactions: React.FC<InteractionsProps> = ({ interactions, onInteraction, color }) => {
  const hasInteractions = !!interactions.length;

  React.useEffect(() => {
    if (hasInteractions) {
      perf.action(PerfAction.PROTOTYPE_BUTTONS_RENDERED);
    }
  }, [hasInteractions]);

  if (!hasInteractions) {
    return null;
  }

  return (
    <>
      {interactions.map(({ name, request, isActionButton }) => {
        const ButtonElement = isActionButton ? S.ActionButton : S.Button;

        return (
          <ButtonElement
            key={name}
            onClick={Utils.functional.chainVoid(handleRequestActions(request), () => onInteraction({ name, request: request || name }))}
            className={ClassName.PROTOTYPE_BUTTON}
            rgbaColor={hexToRGBA(color ?? '#3D81E2')}
            onMouseDown={preventDefault()}
          >
            {name}
          </ButtonElement>
        );
      })}
    </>
  );
};

export const StickyInteractions: React.FC<InteractionsProps> = (props) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.minHeight = `${containerRef.current.scrollHeight}px`;
    }
  });

  return (
    <S.Container ref={containerRef}>
      <CustomScrollbars>
        <S.ScrollContainer>
          <Interactions {...props} />
        </S.ScrollContainer>
      </CustomScrollbars>
    </S.Container>
  );
};

export const InlineInteractions: React.FC<InteractionsProps> = (props) => {
  return (
    <S.InlineContainer>
      <Interactions {...props} />
    </S.InlineContainer>
  );
};
