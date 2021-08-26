import { stopPropagation } from '@voiceflow/ui';
import React from 'react';

import Tooltip, { Section, Title, TooltipProps } from '@/components/Tooltip';

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
    {title && <Title>{title}</Title>}

    <Section marginBottomUnits={contentBottomUnits}>{children}</Section>

    {!!(helpTitle && helpMessage) && (
      <>
        <Title>{helpTitle}</Title>
        <Section>{helpMessage}</Section>
      </>
    )}
  </Tooltip>
);

export default TutorialTooltip;
