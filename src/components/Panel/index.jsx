import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import CloseIcon from '@/svgs/close.svg';

import { Container, Header, Title } from './components';

export * from './components';

function Panel({ title, onClose, className, children }) {
  return (
    <Container className={className}>
      <Header onClick={onClose}>
        <Title>{title}</Title>
        {onClose && <SvgIcon icon={CloseIcon} />}
      </Header>
      {children}
    </Container>
  );
}

export default Panel;
