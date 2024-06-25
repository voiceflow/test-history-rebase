import type { TooltipProps } from '@ui/components/Tooltip';
import Tooltip from '@ui/components/Tooltip';
import { stopPropagation } from '@ui/utils';
import React from 'react';

import { AnchorContainer } from './components';

export interface TutorialTooltipProps
  extends Pick<TooltipProps, 'children' | 'placement' | 'portalNode' | 'initialOpened'> {
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
  initialOpened,
  anchorRenderer,
  contentBottomUnits = 3,
}) => {
  const renderContent = (content?: React.ReactNode) => (
    <>
      {title && <Tooltip.Title>{title}</Tooltip.Title>}

      <Tooltip.Section marginBottomUnits={contentBottomUnits}>{content}</Tooltip.Section>

      {!!(helpTitle && helpMessage) && (
        <>
          <Tooltip.Title>{helpTitle}</Tooltip.Title>
          <Tooltip.Section>{helpMessage}</Tooltip.Section>
        </>
      )}
    </>
  );

  return (
    <Tooltip
      placement={placement}
      portalNode={portalNode}
      initialOpened={initialOpened}
      anchorRenderer={({ ref, isOpen, onToggle }) => (
        <AnchorContainer ref={ref} isActive={isOpen} onClick={stopPropagation(onToggle)}>
          {anchorRenderer({ isOpen })}
        </AnchorContainer>
      )}
    >
      {typeof children === 'function' ? (props) => renderContent(children(props)) : renderContent(children)}
    </Tooltip>
  );
};

export default TutorialTooltip;
