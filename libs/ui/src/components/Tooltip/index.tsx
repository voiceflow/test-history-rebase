import React from 'react';

import type { PopperTypes } from '@/components/Popper';
import Popper from '@/components/Popper';
import type { PopperPlacement } from '@/hooks';

import { Container, JSONCode, Paragraph, Section, Title } from './components';

export interface TooltipProps {
  children?: React.ReactNode | PopperTypes.Renderer;
  placement?: PopperPlacement;
  portalNode?: HTMLElement;
  initialOpened?: boolean;
  anchorRenderer: (props: {
    ref: React.Ref<any>;
    isOpen: boolean;
    onToggle: VoidFunction;
    onClose: VoidFunction;
  }) => React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({
  placement = 'auto-end',
  children,
  portalNode,
  anchorRenderer,
  initialOpened,
}) => (
  <Popper
    width="410px"
    maxHeight="500px"
    placement={placement}
    portalNode={portalNode}
    renderContent={(props) => <Container>{typeof children === 'function' ? children(props) : children}</Container>}
    initialOpened={initialOpened}
    preventOverflowPadding={20}
  >
    {({ ref, onClose, onToggle, isOpened }) => anchorRenderer({ ref, isOpen: isOpened, onToggle, onClose })}
  </Popper>
);

export default Object.assign(Tooltip, {
  Title,
  Section,
  JSONCode,
  Paragraph,
});
