import React from 'react';
import { Collapse } from 'reactstrap';

import { useToggle } from '@/hooks/toggle';

import { Container, Content, Header, HeaderIcon } from './components';

export function UncontrolledCollapse({ title, isOpen, onToggle, rightIcon = false, children, iconProps }) {
  return (
    <Container>
      {!!title && (
        <Header onClick={onToggle} rightIcon={rightIcon}>
          {!rightIcon && <HeaderIcon size={10} icon="caretDown" color="#6E849A" rotate={isOpen} {...iconProps} />}

          <span>{title}</span>

          {rightIcon && <HeaderIcon size={10} icon="caretDown" color="#6E849A" rotate={isOpen} rightIcon={rightIcon} {...iconProps} />}
        </Header>
      )}

      <Collapse isOpen={isOpen}>
        <Content>{children}</Content>
      </Collapse>
    </Container>
  );
}

export default function ControlledCollapse({ opened, ...props }) {
  const [isOpen, onToggle] = useToggle();

  React.useEffect(() => onToggle(!!opened), [onToggle, !!opened]);

  return <UncontrolledCollapse {...props} isOpen={isOpen} onToggle={onToggle} />;
}
