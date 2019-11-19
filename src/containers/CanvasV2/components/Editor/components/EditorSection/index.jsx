import React from 'react';

import SvgIcon from '@/components/SvgIcon';

import { Container, Header } from './components';

const EditorSection = ({ label, collapse = false, children }) => (
  <Container>
    <Header>
      <div>{label}</div>
      {collapse && <SvgIcon icon="caretDown" />}
    </Header>
    {children}
  </Container>
);

export default EditorSection;
