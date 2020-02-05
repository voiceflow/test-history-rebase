import React from 'react';

import Tooltip, { Section, Title } from '@/componentsV2/Tooltip';
import { stopPropagation } from '@/utils/dom';

import { AnchorContainer, HelpMessage } from './components';

const TutorialTooltip = ({
  title,
  children,
  placement = 'top-start',
  helpTitle = 'Still having trouble?',
  helpMessage = <HelpMessage />,
  portalNode,
  anchorRenderer,
  contentBottomUnits = 3,
}) => {
  return (
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

      {!!helpTitle && <Title>{helpTitle}</Title>}

      {!!helpMessage && <Section>{helpMessage}</Section>}
    </Tooltip>
  );
};

export default TutorialTooltip;
