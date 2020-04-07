import React from 'react';

import ClickableText from '@/components/Text/ClickableText';
import { styled } from '@/hocs';

import { Interaction } from '../../../types';

const Container = styled.div`
  margin: 5px 8px 0 20px;

  & > span {
    margin: 5px 5px 0 5px;
  }
`;

interface InteractionsProps {
  interactions: Interaction[];
  onInteraction: (input: string) => void;
}

const Interactions: React.FC<InteractionsProps> = ({ interactions, onInteraction }) => {
  if (!interactions.length) {
    return null;
  }

  return (
    <Container>
      {interactions.map(({ name }) => (
        <ClickableText key={name} onClick={() => onInteraction(name)}>
          {name}
        </ClickableText>
      ))}
    </Container>
  );
};

export default Interactions;
