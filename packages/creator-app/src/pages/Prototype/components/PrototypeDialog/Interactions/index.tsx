import { BaseRequest } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { hexToRGBA, preventDefault } from '@voiceflow/ui';
import React from 'react';

import { Interaction, OnInteraction } from '@/pages/Prototype/types';
import perf, { PerfAction } from '@/performance';
import { ClassName } from '@/styles/constants';
import { openURLInANewTab } from '@/utils/window';

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

  const handleRequestActions = (request: Interaction['request']) => () => {
    if (request.payload && typeof request.payload === 'object') {
      request.payload.actions?.forEach((action) => {
        if (BaseRequest.Action.isOpenURLAction(action) && action.payload.url) {
          openURLInANewTab(action.payload.url);
        }
      });
    }
  };

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
      <S.ScrollContainer>
        <Interactions {...props} />
      </S.ScrollContainer>
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
