import Tooltip, { TooltipProps } from '@ui/components/Tooltip';
import { stopPropagation } from '@ui/utils';
import React from 'react';

import { AnchorContainer } from './components';

export interface TutorialTooltipProps extends Pick<TooltipProps, 'placement' | 'portalNode'> {
  title?: React.ReactNode;
  helpTitle?: React.ReactNode;
  helpMessage?: React.ReactNode;
  anchorRenderer: (props: { isOpen: boolean }) => React.ReactNode;
  contentBottomUnits?: number;
}

const TutorialTooltip: React.FC<TutorialTooltipProps> = ({
  title,
  children,
  placement = 'top-start',
  helpTitle = 'Still having trouble?',
  portalNode,
  helpMessage,
  anchorRenderer,
  contentBottomUnits = 3,
}) => (
  <Tooltip
    placement={placement}
    portalNode={portalNode}
    anchorRenderer={({ ref, isOpen, onToggle }) => (
      <AnchorContainer opened={isOpen} onClick={stopPropagation(onToggle)} ref={ref}>
        {anchorRenderer({ isOpen })}
      </AnchorContainer>
    )}
  >
    {title && <Tooltip.Title>{title}</Tooltip.Title>}

    <Tooltip.Section marginBottomUnits={contentBottomUnits}>{children}</Tooltip.Section>

    {!!(helpTitle && helpMessage) && (
      <>
        <Tooltip.Title>{helpTitle}</Tooltip.Title>
        <Tooltip.Section>{helpMessage}</Tooltip.Section>
      </>
    )}
  </Tooltip>
);

export default TutorialTooltip;
