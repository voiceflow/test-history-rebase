import SvgIcon from '@ui/components/SvgIcon';
import TutorialTooltip, { TutorialTooltipProps } from '@ui/components/TutorialTooltip';
import React from 'react';

import { IconContainer } from './components';

export interface TutorialInfoIconProps {
  visible?: boolean;
  children?: TutorialTooltipProps['children'];
  placement?: TutorialTooltipProps['placement'];
  tooltipProps?: Omit<TutorialTooltipProps, 'placement' | 'portalNode' | 'anchorRenderer'>;
}

const TutorialInfoIcon: React.FC<TutorialInfoIconProps> = ({ visible = true, children, placement = 'bottom-start', tooltipProps }) => (
  <TutorialTooltip
    {...tooltipProps}
    placement={placement}
    portalNode={document.body}
    anchorRenderer={({ isOpen }: { isOpen: boolean }) => (
      <IconContainer isOpen={isOpen} visible={visible}>
        <SvgIcon size={16} icon="info" />
      </IconContainer>
    )}
  >
    {children}
  </TutorialTooltip>
);

export default Object.assign(TutorialInfoIcon, {
  // can be used to override the default styles
  IconContainer,
});
