import { IconVariant, SvgIcon, Toggle } from '@voiceflow/ui';
import React from 'react';

import { SectionToggleVariant } from '../../constants';
import { Container, ToggleArrowContainer } from './components';

interface CollapseTriggerProps {
  variant: SectionToggleVariant;
  onToggle?: React.MouseEventHandler;
  isCollapsed?: boolean;
  disabled?: boolean;
}

const CollapseTrigger: React.FC<CollapseTriggerProps> = ({ disabled, onToggle, isCollapsed, variant }) => (
  <Container disabled={disabled}>
    {variant === SectionToggleVariant.ARROW && (
      <ToggleArrowContainer onClick={onToggle} isCollapsed={isCollapsed}>
        <SvgIcon variant={IconVariant.TERTIARY} icon="arrowLeft" size={12} />
      </ToggleArrowContainer>
    )}

    {variant === SectionToggleVariant.TOGGLE && <Toggle checked={!isCollapsed} onChange={onToggle} small />}
  </Container>
);

export default CollapseTrigger;
