import Popper from '@ui/components/Popper';
import { PopperPlacement } from '@ui/hooks';
import React from 'react';

import { Container, JSONCode, Paragraph, Section, Title } from './components';

export interface TooltipProps {
  placement?: PopperPlacement;
  portalNode?: HTMLElement;
  anchorRenderer: (props: { ref: React.Ref<any>; isOpen: boolean; onToggle: VoidFunction; onClose: VoidFunction }) => React.ReactNode;
}

interface TooltipComponent extends React.FC<TooltipProps> {
  Title: typeof Title;
  Section: typeof Section;
  JSONCode: typeof JSONCode;
  Paragraph: typeof Paragraph;
}

const Tooltip: TooltipComponent = ({ placement = 'auto-end', children, portalNode, anchorRenderer }) => (
  <Popper
    width="440px"
    maxHeight="500px"
    placement={placement}
    portalNode={portalNode}
    renderContent={() => <Container>{children}</Container>}
    preventOverflowPadding={20}
  >
    {({ ref, onClose, onToggle, isOpened }) => anchorRenderer({ ref, isOpen: isOpened, onToggle, onClose })}
  </Popper>
);

Tooltip.Title = Title;
Tooltip.Section = Section;
Tooltip.JSONCode = JSONCode;
Tooltip.Paragraph = Paragraph;

export default Tooltip;
