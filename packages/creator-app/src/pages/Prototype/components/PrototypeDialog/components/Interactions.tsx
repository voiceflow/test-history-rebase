import { BaseRequest, RequestType } from '@voiceflow/general-types';
import { BoxFlex, hexToRGBA, preventDefault, toRGBAString } from '@voiceflow/ui';
import React from 'react';
import SimpleBar from 'simplebar-react';

import { styled, transition } from '@/hocs';
import perf, { PerfAction } from '@/performance';
import { FadeLeftContainer } from '@/styles/animations';
import { ClassName } from '@/styles/constants';
import { Color } from '@/types';

import { Interaction } from '../../../types';

interface ButtonProps {
  rgbaColor: Color;
}

const Button = styled(FadeLeftContainer)<ButtonProps>`
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
  text-transform: capitalize;

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
  onInteraction: (request: string | BaseRequest) => void;
}

const SIMPLE_BUTTON_REQUESTS = [RequestType.INTENT, RequestType.TEXT];

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
      {interactions.map(({ name, request }) => {
        const ButtonElement = !request || SIMPLE_BUTTON_REQUESTS.includes(request.type as RequestType) ? Button : ActionButton;

        return (
          <ButtonElement
            key={name}
            onClick={() => onInteraction(request || name)}
            className={ClassName.PROTOTYPE_BUTTON}
            rgbaColor={hexToRGBA(color ?? '#5D9DF5')}
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
    <BoxFlex flexWrap="wrap-reverse" pt={8} ml={40}>
      <Interactions {...props} />
    </BoxFlex>
  );
};
