import { BaseRequest } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { BoxFlex, hexToRGBA, preventDefault, toRGBAString } from '@voiceflow/ui';
import React from 'react';
import SimpleBar from 'simplebar-react';

import { styled, transition } from '@/hocs';
import { MessageFadeUpContainer } from '@/pages/Prototype/components/PrototypeDialog/components/Message/components/Message/components';
import perf, { PerfAction } from '@/performance';
import { ClassName } from '@/styles/constants';
import { Color } from '@/types';
import { getValidHref } from '@/utils/string';

import { Interaction, OnInteraction } from '../../../types';

interface ButtonProps {
  rgbaColor: Color;
}

const Button = styled(MessageFadeUpContainer)<ButtonProps>`
  ${transition('color', 'background')};
  border-radius: 25px;
  box-shadow: 0 1px 1px 0 rgba(17, 49, 96, 0.06);
  border: solid 1px ${({ rgbaColor }) => toRGBAString({ ...rgbaColor, a: 0.4 })};
  color: ${({ rgbaColor }) => toRGBAString(rgbaColor)};
  background: white;
  cursor: pointer;
  margin: 5px;
  padding: 8px 20px;
  display: inline-block;

  :hover,
  :active {
    color: white;
    background: ${({ rgbaColor }) => toRGBAString(rgbaColor)};
  }
`;

const ActionButton = styled(Button)`
  ${transition('border')};
  border: solid 1px rgba(141, 162, 181, 0.4);
  color: #132144;
  text-transform: none;

  :hover,
  :active {
    color: #132144;
    background: rgba(238, 244, 246, 0.5);
    border: solid 1px rgba(141, 162, 181, 0.6);
  }
`;

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
        if (BaseRequest.Action.isOpenURLAction(action)) {
          window.open(getValidHref(action.payload.url), '_blank');
        }
      });
    }
  };

  return (
    <>
      {interactions.map(({ name, request, isActionButton }) => {
        const ButtonElement = isActionButton ? ActionButton : Button;

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

const Container = styled.div`
  position: sticky;
  bottom: 0;
  height: 65px;
  margin-left: -24px;
  margin-right: -24px;
  background-image: linear-gradient(to bottom, rgba(253, 253, 253, 0), rgba(253, 253, 253, 0.3) 8%, #fdfdfd 80%);
`;

const ScrollContainer = styled(SimpleBar)`
  padding: 0 20px 15px 20px;
  white-space: nowrap;
`;

const InlineContainer = styled(BoxFlex)`
  padding-top: 8px;
  margin-left: 40px;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

export const StickyInteractions: React.FC<InteractionsProps> = (props) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.minHeight = `${containerRef.current.scrollHeight}px`;
    }
  });

  return (
    <Container ref={containerRef}>
      <ScrollContainer>
        <Interactions {...props} />
      </ScrollContainer>
    </Container>
  );
};

export const InlineInteractions: React.FC<InteractionsProps> = (props) => {
  return (
    <InlineContainer>
      <Interactions {...props} />
    </InlineContainer>
  );
};
