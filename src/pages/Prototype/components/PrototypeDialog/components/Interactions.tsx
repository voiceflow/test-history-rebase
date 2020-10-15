import React from 'react';
import SimpleBar from 'simplebar-react';

import { css, styled, transition } from '@/hocs';
import { FadeLeftContainer } from '@/styles/animations';

import { Interaction } from '../../../types';

const Container = styled.div<{ hasInteractions: boolean }>`
  position: absolute;
  width: 100%;
  bottom: 0;
  overflow-y: hidden;
  height: 72px;
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

const Chip = styled(FadeLeftContainer)`
  ${transition()};
  border-radius: 25px;
  box-shadow: 0 1px 1px 0 rgba(17, 49, 96, 0.06);
  border: solid 1px rgba(93, 157, 245, 0.4);
  color: #5d9df5;
  background: white;
  cursor: pointer;
  margin-right: 10px;
  padding: 8px 20px;
  display: inline-block;
  text-transform: capitalize;

  :hover,
  :active {
    color: white;
    background: #5d9df5;
  }
`;

interface InteractionsProps {
  interactions: Interaction[];
  onInteraction: (input: string) => void;
}

const Interactions: React.FC<InteractionsProps> = ({ interactions, onInteraction }) => {
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
              <Chip key={name} onClick={() => onInteraction(name)}>
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
