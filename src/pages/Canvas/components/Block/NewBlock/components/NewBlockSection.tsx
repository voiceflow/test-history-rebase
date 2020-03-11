import React from 'react';

import Content from './NewBlockContent';
import Header, { NewBlockHeaderProps } from './NewBlockHeader';
import Container from './NewBlockSectionContainer';

type NewBlockSectionProps = NewBlockHeaderProps;

const NewBlockSection: React.FC<NewBlockSectionProps> = ({ children, ...props }) => (
  <Container>
    <Header {...props} />
    <Content>{children}</Content>
  </Container>
);

export default NewBlockSection;
