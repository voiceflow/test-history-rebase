import React from 'react';
import { Collapse } from 'reactstrap';

import { SvgIconProps } from '@/components/SvgIcon';
import { useToggle } from '@/hooks/toggle';

import { Container, Content, Header, HeaderIcon } from './components';

type UncontrolledCollapseProps = {
  isOpen: boolean;
  onToggle: () => void;
  title?: string;
  rightIcon?: boolean;
  iconProps?: Partial<SvgIconProps>;
};

export const UncontrolledCollapse: React.FC<UncontrolledCollapseProps> = ({ title, isOpen, onToggle, rightIcon = false, children, iconProps }) => {
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
};

type ControlledCollapseProps = { opened?: boolean } & Omit<UncontrolledCollapseProps, 'onToggle' | 'isOpen'>;

const ControlledCollapse: React.FC<ControlledCollapseProps> = ({ opened, ...props }) => {
  const [isOpen, onToggle] = useToggle();

  const toggle = React.useCallback(() => onToggle(), []);

  React.useEffect(() => onToggle(!!opened), [!!opened]);

  return <UncontrolledCollapse {...props} isOpen={isOpen} onToggle={toggle} />;
};

export default ControlledCollapse;
