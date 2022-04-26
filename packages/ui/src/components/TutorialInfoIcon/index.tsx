import SvgIcon from '@ui/components/SvgIcon';
import TutorialTooltip, { TutorialTooltipProps } from '@ui/components/TutorialTooltip';
import React from 'react';

import { IconContainer } from './components';

export interface TutorialInfoIconProps {
  placement?: TutorialTooltipProps['placement'];
  tooltipProps?: Omit<TutorialTooltipProps, 'placement' | 'portalNode' | 'anchorRenderer'>;
}

interface TutorialInfoIconComponent extends React.FC<TutorialInfoIconProps> {
  IconContainer: typeof IconContainer;
}

const TutorialInfoIcon: TutorialInfoIconComponent = ({ children, placement = 'bottom-start', tooltipProps }) => (
  <TutorialTooltip
    {...tooltipProps}
    placement={placement}
    portalNode={document.body}
    anchorRenderer={({ isOpen }: { isOpen: boolean }) => (
      <IconContainer isOpen={isOpen}>
        <SvgIcon size={16} icon="info" />
      </IconContainer>
    )}
  >
    {children}
  </TutorialTooltip>
);

// can be used to override the default styles
TutorialInfoIcon.IconContainer = IconContainer;

export default TutorialInfoIcon;
