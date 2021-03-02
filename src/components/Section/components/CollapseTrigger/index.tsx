import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import Toggle from '@/components/Toggle';
import { IconVariant } from '@/constants';

import { SectionToggleVariant } from '../../constants';
import { Container, ToggleArrowContainer, ToggleSwitchContainer } from './components';

type CollapseTriggerProps = {
  variant: SectionToggleVariant;
  onToggle?: React.MouseEventHandler;
  isCollapsed?: boolean;
  disabled?: boolean;
};

const CollapseTrigger: React.FC<CollapseTriggerProps> = ({ disabled, onToggle, isCollapsed, variant }) => (
  <Container disabled={disabled}>
    {variant === SectionToggleVariant.ARROW && (
      <ToggleArrowContainer onClick={onToggle} isCollapsed={isCollapsed}>
        <SvgIcon variant={IconVariant.TERTIARY} icon="arrowLeft" size={12} />
      </ToggleArrowContainer>
    )}

    {variant === SectionToggleVariant.TOGGLE && (
      <ToggleSwitchContainer>
        <Toggle checked={!isCollapsed} onChange={onToggle} />
      </ToggleSwitchContainer>
    )}
  </Container>
);

export default CollapseTrigger;
