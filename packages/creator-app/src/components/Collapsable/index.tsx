import cn from 'classnames';
import React from 'react';
import { Collapse } from 'reactstrap';

import { SvgIconProps } from '@/components/SvgIcon';
import { useToggle } from '@/hooks/toggle';
import { ClassName } from '@/styles/constants';

import { Container, Content, Header, HeaderIcon } from './components';

type UncontrolledCollapseProps = {
  type?: string;
  title?: string;
  isOpen: boolean;
  onToggle: () => void;
  rightIcon?: boolean;
  iconProps?: Partial<SvgIconProps>;
};

export const UncontrolledCollapse: React.FC<UncontrolledCollapseProps> = ({
  type,
  title,
  isOpen,
  onToggle,
  rightIcon = false,
  children,
  iconProps,
}) => (
  <Container
    className={cn(ClassName.COLLAPSE, {
      [`${ClassName.COLLAPSE}--opened`]: isOpen,
      [`${ClassName.COLLAPSE}--${type}`]: !!type,
    })}
  >
    {!!title && (
      <Header onClick={onToggle} rightIcon={rightIcon} className={ClassName.COLLAPSE_HEADER}>
        {!rightIcon && <HeaderIcon size={10} icon="caretDown" color="#6E849A" rotate={isOpen} {...iconProps} />}

        <span>{title}</span>

        {rightIcon && <HeaderIcon size={10} icon="caretDown" color="#6E849A" rotate={isOpen} rightIcon={rightIcon} {...iconProps} />}
      </Header>
    )}

    <Collapse isOpen={isOpen}>
      <Content className={ClassName.COLLAPSE_CONTENT}>{children}</Content>
    </Collapse>
  </Container>
);

type ControlledCollapseProps = { opened?: boolean } & Omit<UncontrolledCollapseProps, 'onToggle' | 'isOpen'>;

const ControlledCollapse: React.FC<ControlledCollapseProps> = ({ opened, ...props }) => {
  const [isOpen, onToggle] = useToggle();

  const toggle = React.useCallback(() => onToggle(), []);

  React.useEffect(() => onToggle(!!opened), [!!opened]);

  return <UncontrolledCollapse {...props} isOpen={isOpen} onToggle={toggle} />;
};

export default ControlledCollapse;
