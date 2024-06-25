import React from 'react';

import { BLOCK_SECTION_CLASSNAME } from '@/pages/Canvas/constants';

import type { BlockHeaderProps } from './BlockHeader';
import Header from './BlockHeader';
import Container from './BlockSectionContainer';

export type BlockSectionProps = React.PropsWithChildren<BlockHeaderProps>;

const BlockSection: React.FC<BlockSectionProps> = ({ children, ...props }) => (
  <Container className={BLOCK_SECTION_CLASSNAME}>
    <Header {...props} />
    <section>{children}</section>
  </Container>
);

export default BlockSection;
