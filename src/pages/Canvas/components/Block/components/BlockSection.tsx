import React from 'react';

import { BlockState } from '@/constants/canvas';

import Header, { BlockHeaderProps } from './BlockHeader';
import Container from './BlockSectionContainer';

export type BlockSectionProps = BlockHeaderProps & {
  state: BlockState;
};

const ACTIVATED_STATES = [BlockState.ACTIVE, BlockState.SELECTED];

const BlockSection: React.FC<BlockSectionProps> = ({ state, children, ...props }) => {
  const isActivated = ACTIVATED_STATES.includes(state);

  return (
    <Container>
      <Header {...props} disabled={state === BlockState.DISABLED} isActivated={isActivated} />
      <section>{children}</section>
    </Container>
  );
};

export default BlockSection;
