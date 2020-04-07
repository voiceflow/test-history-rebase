import React from 'react';

import { BlockState } from '@/constants/canvas';

import Content from './NewBlockContent';
import Header, { NewBlockHeaderProps } from './NewBlockHeader';
import Container from './NewBlockSectionContainer';

export type NewBlockSectionProps = NewBlockHeaderProps & {
  state: BlockState;
};

const ACTIVATED_STATES = [BlockState.ACTIVE, BlockState.SELECTED];

const NewBlockSection: React.FC<NewBlockSectionProps> = ({ state, children, ...props }) => {
  const isActivated = ACTIVATED_STATES.includes(state);

  return (
    <Container>
      <Header {...props} disabled={state === BlockState.DISABLED} isActivated={isActivated} />
      <Content>{children}</Content>
    </Container>
  );
};

export default NewBlockSection;
