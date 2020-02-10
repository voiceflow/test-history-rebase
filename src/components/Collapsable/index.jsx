import React from 'react';
import { Collapse } from 'reactstrap';

import { useToggle } from '@/hooks/toggle';

import { Container, Content, Header, HeaderIcon } from './components';

export default function ControlledCollapse({ title, opened, rightIcon = false, children }) {
  const [isOpen, onToggle] = useToggle();

  React.useEffect(() => onToggle(!!opened), [onToggle, !!opened]);

  return (
    <Container>
      {!!title && (
        <Header onClick={onToggle} rightIcon={rightIcon}>
          {!rightIcon && <HeaderIcon size={10} icon="caretDown" color="#6E849A" rotate={isOpen} />}

          <span>{title}</span>

          {rightIcon && <HeaderIcon size={10} icon="caretDown" color="#6E849A" rotate={isOpen} rightIcon={rightIcon} />}
        </Header>
      )}

      <Collapse isOpen={isOpen}>
        <Content>{children}</Content>
      </Collapse>
    </Container>
  );
}
