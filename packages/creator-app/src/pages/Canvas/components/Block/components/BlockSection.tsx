import React from 'react';

import { BLOCK_SECTION_CLASSNAME } from '@/pages/Canvas/constants';

import Header, { BlockHeaderProps } from './BlockHeader';
import Container from './BlockSectionContainer';

export type BlockSectionProps = BlockHeaderProps;

const BlockSection: React.OldFC<BlockSectionProps> = ({ children, ...props }) => (
  <Container className={BLOCK_SECTION_CLASSNAME}>
    <Header {...props} />
    <section>{children}</section>
  </Container>
);

export default BlockSection;
