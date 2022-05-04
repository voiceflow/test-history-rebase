import React from 'react';

import {
  ActionsContainer,
  AddCollapseSection,
  CollapseSection,
  Container,
  Content,
  Divider,
  Header,
  ListItem,
  SimpleSection,
  Title,
} from './components';

interface SectionV2Props {
  header?: React.ReactNode;
}

const SectionV2: React.FC<SectionV2Props> = ({ header, children }) => (
  <Container>
    {header}
    {children}
  </Container>
);

export default Object.assign(SectionV2, {
  Title,
  Header,
  Divider,
  Content,
  ListItem,
  Container,
  SimpleSection,
  CollapseSection,
  ActionsContainer,
  AddCollapseSection,
});
