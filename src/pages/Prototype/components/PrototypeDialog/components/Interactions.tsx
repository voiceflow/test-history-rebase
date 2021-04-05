import React from 'react';
import SimpleBar from 'simplebar-react';

import { css, styled, transition } from '@/hocs';
import { FadeLeftContainer } from '@/styles/animations';
import { Color } from '@/types';
import { hexToRGBA, toRGBAString } from '@/utils/colors';
import { preventDefault } from '@/utils/dom';

import { Interaction } from '../../../types';

export const INTERACTIONS_CONTAINER_HEIGHT = 72;

const Container = styled.div<{ hasInteractions: boolean }>`
  position: absolute;
  width: 100%;
  bottom: 0;
  overflow-y: hidden;
  height: ${INTERACTIONS_CONTAINER_HEIGHT}px;
  white-space: nowrap;

  ${({ hasInteractions }) =>
    hasInteractions &&
    css`
      background-image: linear-gradient(to bottom, rgba(253, 253, 253, 0), rgba(253, 253, 253, 0.29) 28%, #fdfdfd 85%);
    `}

  & > span {
    margin: 5px 5px 0 5px;
  }
`;

const InnerContainer = styled(SimpleBar)`
  padding: 16px 20px;
`;

type ChipProps = {
  rgbaColor: Color;
};

const Chip = styled(FadeLeftContainer)<ChipProps>`
  ${transition('color', 'background')};
  border-radius: 25px;
  box-shadow: 0 1px 1px 0 rgba(17, 49, 96, 0.06);
  border: solid 1px ${({ rgbaColor }) => toRGBAString({ ...rgbaColor, a: 0.4 })};
  color: ${({ rgbaColor }) => toRGBAString(rgbaColor)};
  background: white;
  cursor: pointer;
  margin-right: 10px;
  padding: 8px 20px;
  display: inline-block;
  text-transform: capitalize;

  :hover,
  :active {
    color: white;
    background: ${({ rgbaColor }) => toRGBAString(rgbaColor)};
  }
`;

interface InteractionsProps {
  interactions: Interaction[];
  onInteraction: (input: string) => void;
  color?: string;
}

const Interactions: React.FC<InteractionsProps> = ({ interactions, onInteraction, color }) => {
  const hasInteractions = !!interactions.length;
  if (!hasInteractions) {
    return null;
  }

  return (
    <Container hasInteractions={hasInteractions}>
      <InnerContainer>
        {hasInteractions && (
          <>
            {interactions.map(({ name }) => (
              <Chip key={name} onMouseDown={preventDefault()} onClick={() => onInteraction(name)} rgbaColor={hexToRGBA(color ?? '#5D9DF5')}>
                {name}
              </Chip>
            ))}
          </>
        )}
      </InnerContainer>
    </Container>
  );
};

export default Interactions;
