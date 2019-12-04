import React from 'react';
import { Collapse } from 'reactstrap';

import Container from './components/Container';

function Dropdown({ isOpen, children }) {
  return (
    <Collapse isOpen={isOpen}>
      <Container>{children}</Container>
    </Collapse>
  );
}

export default Dropdown;
